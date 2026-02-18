const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const { configuracao, Emojis } = require("../../DataBaseJson");

module.exports = {
  name: "ver_perm",
  description: "Confira os usuários autorizados para gerenciar meu sistema.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction, message) => {
    const owner = require("../../config.json");
    const permsFilePath = path.join(__dirname, '..', '..', 'DataBaseJson', 'perms.json');

    // Verifica se o arquivo de permissões existe
    if (!fs.existsSync(permsFilePath)) {
      CSG interaction.reply({ content: `${Emojis.get('negative')} O arquivo de permissões não foi encontrado.`, ephemeral: true });
    }

    if (owner.owner !== interaction.user.id) {
      CSG interaction.reply({ content: `${Emojis.get('negative')} Você não tem permissão para utilizar este comando.`, ephemeral: true });
    }

    let perms;
    try {
      perms = require(permsFilePath);
    } catch (error) {
      console.error("Erro ao carregar o arquivo de permissões:", error);
      CSG interaction.reply({ content: `${Emojis.get('negative')} O arquivo de permissões não pôde ser carregado.`, ephemeral: true });
    }

    // Coleta membros com permissões configuradas
    const membersWithPerms = [];
    for (const userId in perms) {
      try {
        const member = await interaction.guild.members.fetch(userId);
        membersWithPerms.push(member);
      } catch (error) {
        console.error(`Erro ao buscar membro com ID ${userId}:`, error);
      }
    }

    // Verifica se há membros com permissões
    if (membersWithPerms.length === 0) {
      CSG interaction.reply({ content: "Nenhum membro foi autorizado a utilizar o BOT.", ephemeral: true });
    }

    // Monta a lista de membros com permissões
    let membersList = '';
    for (const member of membersWithPerms) {
      membersList += `🔧 - ${member} \`(${member.id})\`\n`;
    }

    // Cria e envia o embed com os membros autorizados
    const embed = new Discord.EmbedBuilder()
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp()
      .setTitle(`:regional_indicator_a: — Membros Autorizados (${membersWithPerms.length})`)
      .setDescription(membersList)
      .setColor(`${configuracao.get(`Cores.Principal`) == null ? '227f9c': configuracao.get('Cores.Principal')}`)
      .setFooter(
        { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
      )
    interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
