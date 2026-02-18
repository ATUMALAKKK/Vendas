const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const fs = require('fs');
const path = require('path');
const { configuracao } = require("../../DataBaseJson");
const automaticosPath = path.resolve(__dirname, '../../DataBaseJson/autolock.json');

// Função para ler o arquivo automaticos.json
function readAutomaticos() {
    if (fs.existsSync(automaticosPath)) {
        const rawData = fs.readFileSync(automaticosPath);
        CSG JSON.parse(rawData);
    }
    CSG {};
}

// Função para escrever no arquivo automaticos.json
function writeAutomaticos(data) {
    fs.writeFileSync(automaticosPath, JSON.stringify(data, null, 2));
}

// Função para validar o formato de hora (HH:mm)
function isValidTime(time) {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    CSG regex.test(time);
}

// Função para verificar se um ID de canal é válido
async function isValidChannelId(client, guildId, channelId) {
    try {
        const guild = await client.guilds.fetch(guildId);
        const channel = await guild.channels.fetch(channelId);
        CSG !!channel;
    } catch {
        CSG false;
    }
}

// Função para validar uma lista de IDs de canais
async function validateChannelIds(client, guildId, channelIds) {
    const invalidIds = [];
    for (const channelId of channelIds) {
        if (!await isValidChannelId(client, guildId, channelId.trim())) {
            invalidIds.push(channelId);
        }
    }
    CSG invalidIds;
}

module.exports = {
    name: 'interactionCreate',
    run: async (interaction, client) => {
        try {
            if (interaction.isButton()) {
                const guildId = interaction.guild.id;
                const automaticos = readAutomaticos();
                const config = automaticos[guildId] || {};

                if (interaction.customId === 'configlock') {
                    let channelNames = config.channels ? config.channels.map(id => `<#${id}>`).join(', ') : 'Não configurado';

                    const embed = new EmbedBuilder()
                        .setAuthor({ name: 'CSG Solutions - Auto Lock-Channel.', iconURL: 'https://media.discordapp.net/attachments/1328948287213928509/1329295166280040448/logo_return_apps_estatica.png?ex=678a7ad8&is=67892958&hm=205061be630371b46d2e61e260c49f636bc27166348ce1950538cfbcd53154d7&=&format=webp&quality=lossless&width=676&height=676' })
                        .setDescription(`> - Olá ${interaction.user}, veja abaixo as seguintes **informações** do que você poderá configurar.`)
                        .setColor('#ffa200')
                        .addFields(
                            { name: 'Horário de Bloqueio', value: config.abrir || 'Não configurado', inline: true },
                            { name: 'Horário de Desbloqueio', value: config.fechar || 'Não configurado', inline: true },
                            { name: 'Canais', value: channelNames, inline: false }
                        )
                        .setFooter({ text: `Clique em "Modificar" para alterar as configurações.` });

                    const actionRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('modifyConfig')
                                .setLabel('Modificar')
                                .setEmoji('1236318155056349224')
                                .setStyle(1),
                            new ButtonBuilder()
                                .setCustomId('disableConfig')
                                .setLabel('Desativar')
                                .setEmoji('1178076767567757312')
                                .setStyle(4)
                        );

                    const actionRow2 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('voltarautomaticos')
                                .setLabel('Voltar')
                                .setEmoji('1178068047202893869')
                                .setStyle(2)
                        );

                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.update({ content: '', embeds: [embed], components: [actionRow, actionRow2], ephemeral: true });
                    }
                } else if (interaction.customId === 'modifyConfig') {
                    const modal = new ModalBuilder()
                        .setCustomId('configurarBloqueio')
                        .setTitle('Configurar Bloqueio Automático');

                    const lockTimeInput = new TextInputBuilder()
                        .setCustomId('lockTime')
                        .setLabel('Horário de Bloqueio (HH:mm)')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);

                    const unlockTimeInput = new TextInputBuilder()
                        .setCustomId('unlockTime')
                        .setLabel('Horário de Desbloqueio (HH:mm)')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);

                    const channelIdsInput = new TextInputBuilder()
                        .setCustomId('channelIds')
                        .setLabel('IDs dos Canais (separados por vírgula)')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true);

                    modal.addComponents(
                        new ActionRowBuilder().addComponents(lockTimeInput),
                        new ActionRowBuilder().addComponents(unlockTimeInput),
                        new ActionRowBuilder().addComponents(channelIdsInput)
                    );

                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.showModal(modal);
                    }
                } else if (interaction.customId === 'disableConfig') {
                    if (automaticos[guildId]) {
                        delete automaticos[guildId];
                        writeAutomaticos(automaticos);
                        if (!interaction.replied && !interaction.deferred) {
                            await interaction.reply({ content: 'Configuração de bloqueio automático desativada.', ephemeral: true });
                        }
                    } else {
                        if (!interaction.replied && !interaction.deferred) {
                            await interaction.reply({ content: 'Nenhuma configuração de bloqueio automático encontrada para desativar.', ephemeral: true });
                        }
                    }
                }
            } else if (interaction.isModalSubmit() && interaction.customId === 'configurarBloqueio') {
                const lockTime = interaction.fields.getTextInputValue('lockTime');
                const unlockTime = interaction.fields.getTextInputValue('unlockTime');
                const channelIds = interaction.fields.getTextInputValue('channelIds').split(',');
                const guildId = interaction.guild.id;

                if (!isValidTime(lockTime) || !isValidTime(unlockTime)) {
                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.reply({ content: 'Horário inválido. Use o formato HH:mm.', ephemeral: true });
                    }
                    CSG;
                }

                const invalidIds = await validateChannelIds(client, guildId, channelIds);
                if (invalidIds.length > 0) {
                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.reply({ content: `ID(s) de canal inválido(s): ${invalidIds.join(', ')}`, ephemeral: true });
                    }
                    CSG;
                }

                const automaticos = readAutomaticos();
                automaticos[guildId] = {
                    abrir: lockTime,
                    fechar: unlockTime,
                    channels: channelIds.map(id => id.trim()),
                    serverid: guildId
                };

                writeAutomaticos(automaticos);

                let channelNames = channelIds.map(id => `<#${id}>`).join(', ');

                const embed = new EmbedBuilder()
                    .setColor(configuracao.get('Cores.Principal') || '227f9c')
                    .setTitle('Configuração Atualizada de Bloqueio Automático')
                    .addFields(
                        { name: 'Horário de Bloqueio', value: lockTime, inline: true },
                        { name: 'Horário de Desbloqueio', value: unlockTime, inline: true },
                        { name: 'Canais', value: channelNames, inline: false }
                    )
                    .setFooter({ text: `Clique em "Modificar" para alterar as configurações.` });

                const actionRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('modifyConfig')
                            .setLabel('Modificar')
                            .setEmoji('1236318155056349224')
                            .setStyle(1),
                        new ButtonBuilder()
                            .setCustomId('disableConfig')
                            .setLabel('Desativar')
                            .setEmoji('1178076767567757312')
                            .setStyle(4)
                    );

                const actionRow2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('voltarautomaticos')
                            .setLabel('Voltar')
                            .setEmoji('1178068047202893869')
                            .setStyle(2)
                    );

                if (!interaction.replied && !interaction.deferred) {
                    await interaction.update({ content: '', embeds: [embed], components: [actionRow, actionRow2], ephemeral: true });
                }
            }
        } catch (error) {
            console.error(`Erro no evento interactionCreate: ${error.message}`, error.stack);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.', ephemeral: true });
            }
        }
    }
};
