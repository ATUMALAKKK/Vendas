const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const { Emojis } = require("../../DataBaseJson");

module.exports = {
  name: "tira_perm",
  description: "Use este comando para remover a permissão de um usuário para gerenciar meu sistema.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "Usuário que terá a permissão removida",
      type: Discord.ApplicationCommandOptionType.User,
      required: true,
    },
  ],

  run: async (client, interaction, message) => {
    const user = interaction.options.getUser('user');
    const owner = require("../../config.json");

    const permsFilePath = path.join(__dirname, '..', '..', 'DataBaseJson', 'perms.json');
    if (!fs.existsSync(permsFilePath)) {
      CSG interaction.reply({ content: `${Emojis.get('negative')} O arquivo de permissões não existe.`, ephemeral: true });
    }

    if (owner.owner !== interaction.user.id) {
      CSG interaction.reply({ content: `${Emojis.get('negative')} Você não possui permissão para remover um usuário da lista de permissões.`, ephemeral: true });
    }

    let perms;
    try {
      perms = require(permsFilePath);
    } catch (error) {
      console.error("Erro ao carregar o arquivo de permissões:", error);
      CSG interaction.reply({ content: `${Emojis.get('negative')} O arquivo de permissões não pôde ser carregado.`, ephemeral: true });
    }

    if (!perms[user.id]) {
      CSG interaction.reply({ content: `${Emojis.get('negative')} O usuário ${user} não está na lista de permissões do BOT.`, ephemeral: true });
    }

    delete perms[user.id];
    try {
      fs.writeFileSync(permsFilePath, JSON.stringify(perms, null, 2));
      interaction.reply({ content: `${Emojis.get('checker')} O usuário ${user} foi removido da lista de permissões do BOT.`, ephemeral: true });
    } catch (error) {
      console.error("Erro ao salvar o arquivo de permissões:", error);
      interaction.reply({ content: `${Emojis.get('negative')} Houve um erro ao salvar o arquivo de permissões.`, ephemeral: true });
    }
  }
}
