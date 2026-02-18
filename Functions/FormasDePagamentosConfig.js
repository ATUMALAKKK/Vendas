const { ActionRowBuilder, TextInputBuilder, TextInputStyle, InteractionType, ModalBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const { configuracao, Emojis } = require("../DataBaseJson");



async function FormasDePagamentos(interaction) {

    const embed = new EmbedBuilder()
    .setAuthor({ name: 'Rust - Formas de Pagamentos.', iconURL: 'https://cdn.discordapp.com/attachments/1331745623929655391/1331768744527269972/a_4d4a9e53dc5c1dfa0426d4785a3c9b63.gif?ex=6792d1cb&is=6791804b&hm=cce19310dc6f9158801ad2be0098eac973f0234f453198dbd475ce33e339b285&' })
    .setColor('#8000ff')
    .setDescription(`## Formas de Pagamentos \n> Selecione o Botão que você deseja utilizar para começar a suas vendas! \n-# O nosso Sistema Mercado Pago esta em Manutenção, iremos melhora-lo.`)
    .addFields(
        { name: `•  Mercado Pago`, value: `${configuracao.get("pagamentos.MpOnOff") != true ? `${Emojis.get('desligado')} \`Desabilitado\`` : `${Emojis.get('ligado')} \`Ativado\``}\n${configuracao.get("pagamentos.MpAPI") != "" ? `${Emojis.get('ligado')} \`Configurado\`` : `${Emojis.get('desligado')} \`Não configurado\``}`, inline: true },
        { name: `•  Pagamento Pix`, value: `${configuracao.get("pagamentos.SemiAutomatico.status") != true ? `${Emojis.get('desligado')} \`Desabilitado\`` : `${Emojis.get('ligado')} \`Ativado\``}\n${configuracao.get("pagamentos.SemiAutomatico.pix") != null ? `${Emojis.get('ligado')} \`Configurado\`` : `${Emojis.get('desligado')} \`Não configurado\``}`, inline: true },
    )
        .setFooter(
            { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
          )
          .setTimestamp()


    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("configurarmercadopago")
                .setLabel('Definir Mercado Pago')
                .setEmoji(`1309599984257073152`)
                .setDisabled(false)
                .setStyle(2),

                new ButtonBuilder()
                .setCustomId("ConfigurarPagamentoManual")
                .setLabel('Definir Pagamento Pix')
                .setEmoji(`1309886639224389683`)
                .setStyle(2),

        )

    const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("voltar1")
                .setLabel('Voltar')
                .setEmoji(`1178068047202893869`)
                .setStyle(2)
    )


    await interaction.update({ content: ``, embeds: [embed], ephemeral: true, components: [row2, row4] })

}

module.exports = {
    FormasDePagamentos
}