const { ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, EmbedBuilder  } = require("discord.js");
const { configuracao, tickets } = require("../DataBaseJson");
const Discord = require("discord.js")


async function CreateTicket(interaction, valor) {


    await interaction.reply({ content: `🔁 | Aguarde estamos criando seu Ticket!`, ephemeral: true });
    await interaction.message.edit()

    const ggg = tickets.get(`tickets.funcoes.${valor}`)
    const aparencia = tickets.get(`tickets.aparencia`)

    if (ggg == null || Object.keys(ggg).length == 0) CSG interaction.editReply({ content: `❌ |  Essa função não existe!`, ephemeral: true });

    const thread2222 = interaction.channel.threads.cache.find(x => x.name.includes(interaction.user.id));
    if (thread2222 !== undefined) {
        const row4 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${thread2222.id}`)
                    .setLabel('Ir para o Ticket')
                    .setStyle(5)
            )

        interaction.editReply({ content: `❌ |  Você já possuí um ticket aberto.`, components: [row4] })
        CSG
    }


    const thread = await interaction.channel.threads.create({
        name: `${valor}・${interaction.user.username}・${interaction.user.id}`,
        autoArchiveDuration: 10080, 
        type: Discord.ChannelType.PrivateThread,
        reason: 'Ticket aberto',
        members: [interaction.user.id],
        permissionOverwrites: [
            {
                id: configuracao.get('ConfigRoles.cargoadm'), // Substitua pelo ID do seu cargo
                allow: [Discord.PermissionFlagsBits.SendMessagesInThreads],
            },
            {
                id: configuracao.get('ConfigRoles.cargosup'), // Substitua pelo ID do seu cargo
                allow: [Discord.PermissionFlagsBits.SendMessagesInThreads],
            },
            {
                id: interaction.user.id, // Substitua pelo ID do seu cargo
                allow: [Discord.PermissionFlagsBits.SendMessagesInThreads],
            },
        ],
    });

    const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setURL(`https://discord.com/channels/${interaction.guild.id}/${thread.id}`)
                .setLabel('Ir para o Ticket')
                .setStyle(5)
        )

    interaction.editReply({ content: `✅ |  Ticket criado com sucesso!`, components: [row4] })

    const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
        .setTitle(`${valor}`)
        .setDescription(`${ggg.descricao == undefined ? ggg.predescricao : ggg.descricao}`)
        .setFooter(
            { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
        )
        .setTimestamp()

    if (ggg.banner !== undefined) {
        embed.setImage(`${ggg.banner}`)
    }

    if (aparencia.color !== undefined) {
        embed.setColor(`${aparencia.color}`)
    }

    const button = new Discord.ButtonBuilder()
        .setCustomId('notifyuser')
        .setLabel('Notificar Usuário')
        .setEmoji(`1237170461302067200`)
        .setStyle(1)
        .setDisabled(false)
    const button2 = new Discord.ButtonBuilder()
        .setCustomId('assumerticket')
        .setLabel('Assumir Ticket')
        .setEmoji(`1237174322187993229`)
        .setStyle(3)
        .setDisabled(true)
     const button4 = new Discord.ButtonBuilder()
        .setCustomId('renameTicket')
        .setLabel('Renomear Ticket')
        .setEmoji(`1258924338002919535`)
        .setStyle(3)
        .setDisabled(false)
    const button3 = new Discord.ButtonBuilder()
        .setCustomId('deletar')
        .setLabel('Deletar e Salvar')
        .setEmoji(`1237170463520587847`)
        .setStyle(4)

    const row = new Discord.ActionRowBuilder()
        .addComponents(button, button2, button4, button3,);



    thread.send({ components: [row], embeds: [embed], content: `${interaction.user} ${configuracao.get('ConfigRoles.cargoadm') == null ? '' : `<@&${configuracao.get('ConfigRoles.cargoadm')}>`} ${configuracao.get('ConfigRoles.cargosup') == null ? '' : `<@&${configuracao.get('ConfigRoles.cargosup')}>`}` })


}


async function CloseAllTickets(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        CSG interaction.reply({ content: "❌ | Você não tem permissão para usar este comando!", ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;
    if (!guild) {
        CSG interaction.editReply({ content: "❌ | Não foi possível acessar o servidor.", ephemeral: true });
    }

    let ticketThreads = [];
    
    // Busca todos os canais do servidor
    const channels = await guild.channels.fetch();
    
    for (const [, channel] of channels) {
        if (channel.isTextBased() && channel.threads) {
            try {
                const activeThreads = await channel.threads.fetchActive();
                const archivedThreads = await channel.threads.fetchArchived();
                
                const ticketsInChannel = [...activeThreads.threads.values(), ...archivedThreads.threads.values()]
                    .filter(thread => 
                        thread.name.includes('・') && 
                        thread.name.split('・').length === 3 &&
                        !isNaN(thread.name.split('・')[2])
                    );
                
                ticketThreads = [...ticketThreads, ...ticketsInChannel];
            } catch (error) {
                console.error(`Erro ao buscar threads no canal ${channel.id}:`, error);
            }
        }
    }

    if (ticketThreads.length === 0) {
        CSG interaction.editReply({ content: "😅 | Não há tickets para deletar.", ephemeral: true });
    }

    const confirmButton = new ButtonBuilder()
        .setCustomId('confirm_delete_all')
        .setLabel('Confirmar')
        .setStyle(4) // Danger
        .setEmoji('1324732706566701077');

    const cancelButton = new ButtonBuilder()
        .setCustomId('cancel_delete_all')
        .setLabel('Cancelar')
        .setStyle(2) // Secondary
        .setEmoji('1324732768503992342');

    const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

    const confirmEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Deletar Todos os Tickets')
        .setDescription(`Você está prestes a deletar permanentemente ${ticketThreads.length} ticket(s). Essa ação não pode ser desfeita.`)
        .setFooter({ text: 'Por favor, confirme sua ação.' });

    const confirmMessage = await interaction.editReply({ embeds: [confirmEmbed], components: [row], ephemeral: true });

    const filter = i => i.user.id === interaction.user.id;
    const collector = confirmMessage.createMessageComponentCollector({ filter, time: 30000 });

    collector.on('collect', async i => {
        if (i.customId === 'confirm_delete_all') {
            await i.update({ content: '🔁 Deletando tickets...', embeds: [], components: [] });

            let deletedCount = 0;
            for (const thread of ticketThreads) {
                try {
                    await thread.send('Este ticket está sendo deletado automáticamente');
                    await thread.delete();
                    deletedCount++;
                } catch (error) {
                    console.error(`Erro ao deletar o ticket ${thread.id}:`, error);
                }
            }

            const resultsEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ Operação Concluída')
                .setDescription(`${deletedCount} de ${ticketThreads.length} ticket(s) foram deletados permanentemente.`)
                .setTimestamp();

            await i.editReply({ content: '', embeds: [resultsEmbed], components: [] });
        } else if (i.customId === 'cancel_delete_all') {
            await i.update({ content: '❌ Operação cancelada.', embeds: [], components: [] });
        }
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
            interaction.editReply({ content: '⏱️ Tempo esgotado. Operação cancelada.', embeds: [], components: [] });
        }
    });
}



module.exports = {
    CreateTicket,
    CloseAllTickets
}