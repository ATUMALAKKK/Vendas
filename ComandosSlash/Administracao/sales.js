const { ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { getPermissions } = require("../../Functions/PermissionsCache.js");
const { Emojis } = require("../../DataBaseJson");


module.exports = {
  name: "rendimentos",
  description: "Use para ver suas vendas esse mês",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction, message) => {
  
    await interaction.reply({ content: `${Emojis.get('loading')} Aguarde...`, ephemeral: true })

    const perm = await getPermissions(client.user.id)
    if (perm === null || !perm.includes(interaction.user.id)) {
      CSG interaction.editReply({ content: `${Emojis.get('negative')} Você não possui permissão para usar esse comando.`, ephemeral: true });
    }

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("todayyyy")
          .setLabel('Hoje')
          .setStyle(2)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("7daysss")
          .setLabel('Últimos 7 dias')
          .setStyle(2)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("30dayss")
          .setLabel('Últimos 30 dias')
          .setStyle(2)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("totalrendimento")
          .setLabel('Rendimento Total')
          .setStyle(3)
          .setDisabled(false),
      )

    interaction.editReply({ content: `Olá senhor **${interaction.user.username}**, selecione algum filtro.`, components: [row], ephemeral: true })
  }
}
