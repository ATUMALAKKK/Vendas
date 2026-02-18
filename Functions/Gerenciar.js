const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

async function Gerenciar(interaction, client) {
    try {
        // Criação do embed
        const embed = new EmbedBuilder()
            .setAuthor({
                name: "Rust - Página Definições.",
                iconURL: "https://cdn.discordapp.com/attachments/1331745623929655391/1331768744527269972/a_4d4a9e53dc5c1dfa0426d4785a3c9b63.gif"
            })
            .setColor("#ffa200")
            .setDescription(
                `> - Olá ${interaction.user}, veja abaixo as seguintes **informações** do que você poderá configurar.`
            );

        // Criação das linhas de botões
        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("painelconfigbv")
                .setLabel("Boas Vindas")
                .setEmoji("1311382245658984599")
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("configcargos")
                .setLabel("Cargos")
                .setEmoji("1178086257784533092")
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("personalizarcanais")
                .setLabel("Canais")
                .setEmoji("1178086457169170454")
                .setStyle(2)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("personalizarantifake")
                .setLabel("Anti-Fake")
                .setEmoji("1292614641587064893")
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("painelpersonalizar")
                .setLabel("Personalizar bot")
                .setEmoji("1310966681971200053")
                .setStyle(1)
                .setDisabled(false)
        );

        const row3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("voltar1")
                .setLabel("Voltar")
                .setEmoji("1178068047202893869")
                .setStyle(2)
        );

        if (!interaction.message) {
            await interaction.reply({
                embeds: [embed],
                components: [row1, row2, row3],
                content: ""
            });
        } else {
            await interaction.update({
                embeds: [embed],
                components: [row1, row2, row3],
                content: ""
            });
        }
    } catch (error) {
        console.error("Erro na função Gerenciar:", error);
    }
}

module.exports = {
    Gerenciar
};