const { ApplicationCommandType } = require("discord.js");
const { GerenciarCampos } = require("../../Functions/GerenciarCampos");
const { getPermissions } = require("../../Functions/PermissionsCache.js");
const {Emojis } = require("../../DataBaseJson");

module.exports = {
  name: "produto",
  description: "Use para configurar minhas funções",
  type: ApplicationCommandType.ChatInput,
  options: [{ name: "product", description: "-", type: 3, required: true, autocomplete: true }],

  run: async (client, interaction) => {
    const perm = await getPermissions(client.user.id);
    if (perm === null || !perm.includes(interaction.user.id)) {
      CSG interaction.reply({ content: `${Emojis.get('negative')} Você não possui permissão para usar esse comando.`, ephemeral: true });
    }

    // Verificar se 'interaction.options._hoistedOptions[0]' está definido
    if (!interaction.options._hoistedOptions || !interaction.options._hoistedOptions[0]) {
      CSG interaction.reply({ content: `Nenhum item registrado em seu BOT`, ephemeral: true });
    }

    const productValue = interaction.options._hoistedOptions[0].value;

    GerenciarCampos(interaction, productValue);
  }
}
