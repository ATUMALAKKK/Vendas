const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { configuracao, Emojis } = require("../DataBaseJson");

function msgbemvindo(interaction, client) {
    const embed = new EmbedBuilder()
    .setAuthor({ name: 'Rust - Configurar Boas vindas.', iconURL: 'https://cdn.discordapp.com/attachments/1331745623929655391/1331768744527269972/a_4d4a9e53dc5c1dfa0426d4785a3c9b63.gif?ex=6792d1cb&is=6791804b&hm=cce19310dc6f9158801ad2be0098eac973f0234f453198dbd475ce33e339b285&' })
    .setColor('#8000ff')
    .setImage('https://media.discordapp.net/attachments/1328948287213928509/1329294482725933120/GIF-Barrinha-returnsolutions.gif?ex=678a7a35&is=678928b5&hm=68c02ccbb3b72820abab13c927b40a4a820feb9bb0c9e2623b0bc203c3b3dfea&=')

        .setDescription(
            `
${Emojis.get('convers')} **Mensagem**
${configuracao.get("Entradas.msg") == null ? "Não definido" : configuracao.get("Entradas.msg")}${
                configuracao.get(`Entradas.tempo`) == null || configuracao.get(`Entradas.tempo`) === 0
                    ? ""
                    : `\n${Emojis.get('expix')} **Tempo**\n\`${configuracao.get(`Entradas.tempo`)} segundos\``
            }`
        )
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("editarmensagemboasvindas").setLabel("Editar").setEmoji(`1178079212700188692`).setStyle(2),

        new ButtonBuilder().setCustomId("voltar2").setLabel("Voltar").setEmoji(`1178068047202893869`).setStyle(2)
    );

    interaction.update({ components: [row2], embeds: [embed] });
}

module.exports = {
    msgbemvindo,
};
