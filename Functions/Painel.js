const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { produtos, configuracao, Emojis } = require("../DataBaseJson");
const { owner } = require("../config.json"); 
const startTime = Date.now();
const maxMemory = 100;
const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
const memoryUsagePercentage = (usedMemory / maxMemory) * 100;
const roundedPercentage = Math.min(100, Math.round(memoryUsagePercentage));
const donobot = `<@${owner}>`;


async function Painel(interaction, client) {

  if (!interaction || !interaction.user || !client || !client.user || !interaction.guild) {
    console.error("Erro: um dos objetos necessários está indefinido");
    CSG;
  }

  const embed = new EmbedBuilder()
  .setAuthor({
    name: 'Rust - Página Principal.',
    iconURL: 'https://cdn.discordapp.com/attachments/1330322327493414952/1331638850614726738/a_4d4a9e53dc5c1dfa0426d4785a3c9b63.gif?ex=679258d2&is=67910752&hm=f6aa8fb7357e3cb1467977c3b17e936b25a8e9b2b5537a48a6184a453de68e10&'
  })
  .setDescription(`> - Olá ${interaction.user}, veja abaixo as seguintes **informações** do que você poderá configurar.`)
  .addFields(
    { name: `> •  ${Emojis.get('butts')} Bot Online desde:`, value: `<t:${Math.ceil(startTime / 1000)}:R>`, inline: true },
    { name: `> •  ${Emojis.get('owner')} Dono do Bot:`, value: `${donobot}`, inline: true }
  )
    .setColor('#ffa200')
    .setImage('https://cdn.discordapp.com/attachments/1328160059443904577/1332799327164170322/My4fEV7_1.mp4?ex=67969199&is=67954019&hm=eee6349d52211436799f749cc0af2983ca6dfc88b607c4da59b19f2e2f949aac&')
    .setColor('#8600ff')

  const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("painelconfigvendas")
        .setLabel('Sistema de Loja')
        .setEmoji(`1312177745526128721`)
        .setStyle(2)
        .setDisabled(false),

      new ButtonBuilder()
        .setCustomId("painelconfigticket")
        .setLabel('Sistema de Ticket')
        .setEmoji(`1178064939651448973`)
        .setStyle(2)
        .setDisabled(false),
    );

  const row3 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("eaffaawwawa")
        .setLabel('Ações Automáticas')
        .setEmoji(`1249486320397586522`)
        .setStyle(2)
        .setDisabled(false),

      new ButtonBuilder()
        .setCustomId("formasdepagamentos")
        .setLabel('Formas de Pagamento')
        .setEmoji(`1178086986360307732`)
        .setStyle(2),

      new ButtonBuilder()
        .setCustomId("gerenciarconfigs")
        .setLabel('Definições')
        .setEmoji(`1178066377014255828`)
        .setStyle(2)
        .setDisabled(false),
    );

  if (interaction.message == undefined) {
    interaction.reply({ content: ``, components: [row2, row3], embeds: [embed], ephemeral: true });
  } else {
    interaction.update({ content: ``, components: [row2, row3], embeds: [embed], ephemeral: true });
  }
}


async function Gerenciar2(interaction, client) {

  if (!interaction || !interaction.user || !client || !client.user || !produtos) {
    console.error("Erro: um dos objetos necessários está indefinido");
    CSG;
  }

  const ggg = produtos.valueArray ? produtos.valueArray() : [];

  const embed = new EmbedBuilder()
  .setAuthor({ name: 'Rust - Página Loja.', iconURL: 'https://cdn.discordapp.com/attachments/1331745623929655391/1331768744527269972/a_4d4a9e53dc5c1dfa0426d4785a3c9b63.gif?ex=6792d1cb&is=6791804b&hm=cce19310dc6f9158801ad2be0098eac973f0234f453198dbd475ce33e339b285&' })
  .setColor('#8600ff')
  .setDescription(`> - Olá ${interaction.user}, veja abaixo as seguintes **informações** do que voce poderá configurar.`)
  .addFields(
    { name: `${Emojis.get('estoque')} Quantidade de Produtos`, value: `\`${ggg.length} produtos\``, inline: true },
  )
  .setFooter(
    { text: interaction.guild.name || 'Nome do servidor não disponível', iconURL: interaction.guild.iconURL({ dynamic: true }) || null }
  )
  .setTimestamp()
  .setImage('https://cdn.discordapp.com/attachments/1326871425780547625/1331774722949513276/My4fEV7_1.mp4?ex=6792d75d&is=679185dd&hm=8eef91c5942aa69c2441e9015efbfc7cc0ac0b77ce62033934b3a7a6eeb2c3c8&')

  const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("criarrrr")
        .setLabel('Criar')
        .setEmoji(`1178067873894236311`)
        .setStyle(2),

      new ButtonBuilder()
        .setCustomId("gerenciarotemae")
        .setLabel('Gerenciar')
        .setEmoji(`1292614700194074689`)
        .setStyle(2),

      new ButtonBuilder()
        .setCustomId("gerenciarposicao")
        .setLabel('Posições')
        .setEmoji(`1178086608004722689`)
        .setStyle(2),
    )

  const row3 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("voltar00")
        .setLabel('Voltar')
        .setEmoji(`1178068047202893869`)
        .setStyle(2)
    )

  await interaction.update({ embeds: [embed], components: [row2, row3], content: `` })
}

module.exports = {
  Painel,
  Gerenciar2
}
