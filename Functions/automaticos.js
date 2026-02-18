const { ApplicationCommandType, EmbedBuilder, Webhook, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const fs = require("fs");
const path = require("path");
const client = require("discord.js")
const { JsonDatabase } = require("wio.db");
const { produtos, configuracao } = require("../DataBaseJson");

async function automatico(interaction, client) {

    const embed = new EmbedBuilder()
    .setAuthor({ name: 'Rust - Ações Automáticas.', iconURL: 'https://cdn.discordapp.com/attachments/1331745623929655391/1331768744527269972/a_4d4a9e53dc5c1dfa0426d4785a3c9b63.gif?ex=6792d1cb&is=6791804b&hm=cce19310dc6f9158801ad2be0098eac973f0234f453198dbd475ce33e339b285&' })
    .setDescription(`> - Olá ${interaction.user}, veja abaixo as seguintes **informações** do que voce poderá configurar.`)
    .setColor('#8000ff')
        .setFooter(
            { text: interaction.guild.name}
        )
        .setTimestamp()

    const row2 = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
            .setCustomId("configlock")
            .setLabel('Definir Lock-Channels')
            .setEmoji(`1304514418025037925`)
            .setStyle(2),

                new ButtonBuilder()
                .setCustomId("configClean")
                .setLabel('Definir Limpeza')
                .setEmoji(`1238300628225228961`)
                .setStyle(2)
                .setDisabled(false),

                new ButtonBuilder()
                .setCustomId("configmsgauto")
                .setLabel('Definir Mensagens')
                .setEmoji(`1238709839685746758`)
                .setStyle(2)
                .setDisabled(false),


        )

    const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("voltar1")
                .setEmoji(`1178068047202893869`)
                .setLabel('Voltar')
                .setStyle(2)
        )

    await interaction.update({ embeds: [embed], content: ``, ephemeral: true, components: [row2,row4] })
}

module.exports = {
    automatico
}
