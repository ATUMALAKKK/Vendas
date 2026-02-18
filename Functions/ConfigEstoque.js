const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const { EmbedBuilder } = require('discord.js');
const db = new QuickDB();

function MessageStock(interaction, stat, prod, camp, update, reply) {
    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("addestoque1")
                .setLabel('Adicionar')
                .setEmoji(`1178076508150059019`)
                .setStyle(3),
            new ButtonBuilder()
                .setCustomId("estoquearquivo")
                .setLabel('Enviar arquivo')
                .setEmoji(`1178347788501794836`)
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId("estoquefantasma")
                .setLabel('Adicionar estoque fantasma')
                .setEmoji(`1294436857643274324`)
                .setStyle(2),
        );

    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("estoquedsadas")
                .setLabel('Visualizar estoque')
                .setEmoji(`1178317490686795836`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("cleanestoquecampos")
                .setLabel('Resetar Estoque')
                .setEmoji(`1178076767567757312`)
                .setStyle(2),
        );

    const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("Voltar10")
                .setLabel('Voltar')
                .setEmoji(`1178068047202893869`)
                .setStyle(2)
        );

    if (stat == 1) {
        const embed = new EmbedBuilder()
        .setAuthor({ name: 'Rust - Configurar Estoque.', iconURL: 'https://cdn.discordapp.com/attachments/1331745623929655391/1331768744527269972/a_4d4a9e53dc5c1dfa0426d4785a3c9b63.gif?ex=6792d1cb&is=6791804b&hm=cce19310dc6f9158801ad2be0098eac973f0234f453198dbd475ce33e339b285&' })
        .setColor('#8000ff')
        .setDescription(`> - Olá ${interaction.user}, selecione algum método abaixo para adicionar o **estoque de produtos.**`);

        if (update !== true) {
            interaction.reply({
                embeds: [embed],
                components: [row2, row3, row4],
                ephemeral: true,
                fetchReply: true
            }).then(async () => {
                const message = await interaction.fetchReply();
                db.set(message.id, { name: prod, camposelect: camp });
            });
        } else {
            if (reply !== true) {
                interaction.update({
                    embeds: [embed],
                    components: [row2, row3, row4],
                    ephemeral: true,
                    fetchReply: true
                }).then(async () => {
                    db.set(interaction.message.id, { name: prod, camposelect: camp });
                });
            } else {
                interaction.reply({
                    embeds: [embed],
                    components: [row2, row3, row4],
                    ephemeral: true,
                    fetchReply: true
                }).then(async () => {
                    const message = await interaction.fetchReply();
                    db.set(message.id, { name: prod, camposelect: camp });
                });
            }
        }
    } else {
        const embed = new EmbedBuilder()
        .setAuthor({ name: 'Rust - Configurar Estoque.', iconURL: 'https://cdn.discordapp.com/attachments/1331745623929655391/1331768744527269972/a_4d4a9e53dc5c1dfa0426d4785a3c9b63.gif?ex=6792d1cb&is=6791804b&hm=cce19310dc6f9158801ad2be0098eac973f0234f453198dbd475ce33e339b285&' })
        .setColor('#8000ff')
        .setDescription(`> - Olá ${interaction.user}, selecione algum método abaixo para adicionar o **estoque de produtos.**`);

        interaction.update({
            embeds: [embed],
            components: [row2, row3, row4]
        });
    }
}

// Exportação da função
module.exports = {
    MessageStock
};
