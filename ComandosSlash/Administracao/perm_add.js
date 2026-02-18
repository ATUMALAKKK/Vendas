const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const { Emojis } = require("../../DataBaseJson");

module.exports = {
  name: "perms",
  description: "Use este comando para conceder permissão a um usuário para gerenciar meu sistema.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "Usuário que vai receber a permissão",
      type: Discord.ApplicationCommandOptionType.User,
      required: true,
    },
  ],

  run: async (client, interaction, message) => {
    const user = interaction.options.getUser('user');
    const owner = require('../../config.json');

    if (owner.owner !== interaction.user.id) {
      CSG interaction.reply({ content: `${Emojis.get('negative')} Você não possui permissão para adicionar um usuário na lista de permissões.`, ephemeral: true });
    }

    let perms;
    const filePath = path.join(__dirname, '..', '..', 'DataBaseJson', 'perms.json');
    try {
      if (fs.existsSync(filePath)) {
        perms = require(filePath);
      } else {
        perms = {};
      }
    } catch (error) {
      console.error("Erro ao carregar o arquivo de permissões:", error);
      CSG interaction.reply({ content: `${Emojis.get('negative')} O arquivo de permissões não pôde ser carregado.`, ephemeral: true });
    }

    if (!perms[user.id]) {
      perms[user.id] = user.id;
      try {
        fs.writeFileSync(filePath, JSON.stringify(perms, null, 2));
        interaction.reply({ content: `${Emojis.get('checker')} O usuário ${user} foi adicionado à lista de permissões do BOT.`, ephemeral: true });
      } catch (error) {
        console.error("Erro ao salvar o arquivo de permissões:", error);
        interaction.reply({ content: `${Emojis.get('negative')} Houve um erro ao salvar o arquivo de permissões.`, ephemeral: true });
      }
    } else {
      CSG interaction.reply({ content: `${Emojis.get('negative')} O usuário já possui permissão no BOT.`, ephemeral: true });
    }
  }
}
