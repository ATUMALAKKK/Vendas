const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const { GerenciarCampos2 } = require("../../Functions/GerenciarCampos");
const { getPermissions } = require("../../Functions/PermissionsCache.js");
const db = new QuickDB();
const { Emojis } = require("../../DataBaseJson");

module.exports = {
  name: "item",
  description: "Use para configurar minhas funções",
  type: ApplicationCommandType.ChatInput,

  options: [{ name: "item", description: "-", type: 3, required: true, autocomplete: true }],


  run: async (client, interaction, message) => {

    const perm = await getPermissions(client.user.id)
    if (perm === null || !perm.includes(interaction.user.id)) {
      CSG interaction.reply({ content: `${Emojis.get('negative')} Você não possui permissão para usar esse comando.`, ephemeral: true });
    }

    if (interaction.options._hoistedOptions[0].value == 'nada') CSG interaction.reply({ content: `Nenhum item registrado em seu BOT`, ephemeral: true })


    const separarpor_ = interaction.options._hoistedOptions[0].value.split('_')
    const produtoname = separarpor_[0]
    const camponame = separarpor_[1]

    GerenciarCampos2(interaction, camponame, produtoname)



  }
}
