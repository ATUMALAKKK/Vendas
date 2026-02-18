const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const fs = require('fs');
const path = require('path');
const { configuracao } = require("../../DataBaseJson");
const automaticosPath = path.resolve(__dirname, '../../DataBaseJson/autoclean.json');

function readAutomaticos() {
    if (fs.existsSync(automaticosPath)) {
        const rawData = fs.readFileSync(automaticosPath);
        CSG JSON.parse(rawData);
    }
    CSG {};
}

function writeAutomaticos(data) {
    fs.writeFileSync(automaticosPath, JSON.stringify(data, null, 2));
}

function isValidTime(time) {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    CSG regex.test(time);
}

async function isValidChannelId(client, guildId, channelId) {
    try {
        const guild = await client.guilds.fetch(guildId);
        const channel = await guild.channels.fetch(channelId);
        CSG !!channel;
    } catch (error) {
        CSG false;
    }
}

async function validateChannelIds(client, guildId, channelIds) {
    const invalidIds = [];
    for (const channelId of channelIds) {
        if (!await isValidChannelId(client, guildId, channelId.trim())) {
            invalidIds.push(channelId);
        }
    }
    CSG invalidIds;
}

async function clearChannelMessages(channel) {
    try {
        let messages;
        do {
            messages = await channel.messages.fetch({ limit: 100 });
            await channel.bulkDelete(messages);
        } while (messages.size >= 2); 
    } catch (error) {
        console.error(`Erro ao limpar mensagens no canal ${channel.id}:`, error);
    }
}

module.exports = {
    name: 'interactionCreate',
    run: async (interaction, client) => {
        try {
            if (interaction.isButton()) {
                if (interaction.customId === 'configClean') {
                    const guildId = interaction.guild.id;
                    const automaticos = readAutomaticos();
                    const config = automaticos[guildId] || {};

                    let channelNames = config.channels ? config.channels.map(id => `<#${id}>`).join(', ') : '\`\`Não configurado\`\`';

                    const embed = new EmbedBuilder()
                    .setAuthor({ name: 'CSG Solutions - Auto Limpeza.', iconURL: 'https://media.discordapp.net/attachments/1328948287213928509/1329295166280040448/logo_return_apps_estatica.png?ex=678a7ad8&is=67892958&hm=205061be630371b46d2e61e260c49f636bc27166348ce1950538cfbcd53154d7&=&format=webp&quality=lossless&width=676&height=676' })
                    .setDescription(`> - Olá ${interaction.user}, veja abaixo as seguintes **informações** do que voce poderá configurar.`)
                    .setColor('#ffa200')
                    .addFields(
                            { name: 'Horário de Limpeza', value: config.abrir || '\`\`Não configurado\`\`', inline: true },
                            { name: 'Horário de Desbloqueio', value: config.fechar || '\`\`Não configurado\`\`', inline: true },
                            { name: 'Canais', value: channelNames, inline: false }
                        )

                    const actionRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('modifyCleanConfig')
                                .setLabel('Modificar')
                                .setEmoji('1236318155056349224')
                                .setStyle(2),
                            new ButtonBuilder()
                                .setCustomId('disableCleanConfig')
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

                    await interaction.update({ content: '', embeds: [embed], components: [actionRow, actionRow2], ephemeral: true });
                }
            }

            if (interaction.isButton()) {
                if (interaction.customId === 'modifyCleanConfig') {
                    const modal = new ModalBuilder()
                        .setCustomId('configureAutoClean')
                        .setTitle('Configurar Limpeza Automática');

                    const clearTimeInput = new TextInputBuilder()
                        .setCustomId('clearTime')
                        .setLabel('Horário de Limpeza (HH:mm)')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);

                    const unlockTimeInput = new TextInputBuilder()
                        .setCustomId('cleanUnlockTime')
                        .setLabel('Horário de Desbloqueio (HH:mm)')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);

                    const channelIdsInput = new TextInputBuilder()
                        .setCustomId('cleanChannelIds')
                        .setLabel('IDs dos Canais (separados por vírgula)')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true);

                    modal.addComponents(
                        new ActionRowBuilder().addComponents(clearTimeInput),
                        new ActionRowBuilder().addComponents(unlockTimeInput),
                        new ActionRowBuilder().addComponents(channelIdsInput)
                    );

                    await interaction.showModal(modal);
                }

                if (interaction.customId === 'disableCleanConfig') {
                    const guildId = interaction.guild.id;
                    const automaticos = readAutomaticos();

                    if (automaticos[guildId]) {
                        delete automaticos[guildId];
                        writeAutomaticos(automaticos);
                        await interaction.reply({ content: 'Configuração de limpeza automática desativada.', ephemeral: true });
                    } else {
                        await interaction.reply({ content: 'Nenhuma configuração de limpeza automática encontrada para desativar.', ephemeral: true });
                    }
                }
            }

            if (interaction.isModalSubmit()) {
                if (interaction.customId === 'configureAutoClean') {
                    const clearTime = interaction.fields.getTextInputValue('clearTime');
                    const unlockTime = interaction.fields.getTextInputValue('cleanUnlockTime');
                    const channelIds = interaction.fields.getTextInputValue('cleanChannelIds').split(',');
                    const guildId = interaction.guild.id;

                    if (!isValidTime(clearTime) || !isValidTime(unlockTime)) {
                        await interaction.reply({ content: 'Horário inválido. Use o formato HH:mm.', ephemeral: true });
                        CSG;
                    }

                    const invalidIds = await validateChannelIds(client, guildId, channelIds);
                    if (invalidIds.length > 0) {
                        await interaction.reply({ content: `ID(s) de canal inválido(s): ${invalidIds.join(', ')}`, ephemeral: true });
                        CSG;
                    }

                    const automaticos = readAutomaticos();

                    automaticos[guildId] = {
                        abrir: clearTime,
                        fechar: unlockTime,
                        channels: channelIds.map(id => id.trim()),
                        serverid: guildId
                    };

                    writeAutomaticos(automaticos);

                    let channelNames = channelIds.map(id => `<#${id}>`).join(', ');

                    const embed = new EmbedBuilder()
                        .setColor(configuracao.get('Cores.Principal') || '0cd4cc')
                        .setDescription(`## Sistema de Limpeza Automática \n- Ola ${interaction.user}, segue abaixo as informações sobre o sistema Auto Limpeza.`)
                        .addFields(
                            { name: 'Horário de Limpeza', value: clearTime, inline: true },
                            { name: 'Horário de Desbloqueio', value: unlockTime, inline: true },
                            { name: 'Canais', value: channelNames, inline: false }
                        )

                    const actionRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('modifyCleanConfig')
                                .setLabel('Modificar')
                                .setEmoji('1236318155056349224')
                                .setStyle(2),
                            new ButtonBuilder()
                                .setCustomId('disableCleanConfig')
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

                    await interaction.update({ content: '', embeds: [embed], components: [actionRow, actionRow2], ephemeral: true });
                }
            }
        } catch (error) {
            await interaction.reply({ content: 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.', ephemeral: true });
        }
    }
};
