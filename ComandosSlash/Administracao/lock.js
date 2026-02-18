const { PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Discord = require("discord.js");
const { getPermissions } = require("../../Functions/PermissionsCache.js");
const { Emojis } = require("../../DataBaseJson");

module.exports = {
  name: "block",
  description: "Trancar Chat",
  type: Discord.ApplicationCommandType.ChatInput,
  defaultMemberPermissions: [PermissionFlagsBits.ManageChannels],
  run: async (client, interaction) => {

    const perm = await getPermissions(client.user.id);
    if (!perm || !perm.includes(interaction.user.id)) {
      CSG interaction.reply({ content: `${Emojis.get('negative')} Você não possui permissão para usar esse comando.`, ephemeral: true });
    }

    // Botões para "Liberar" e "Trancar" o canal
    const unlockButton = new ButtonBuilder()
      .setCustomId('Liberar1')
      .setLabel('Liberar')
      .setEmoji('<:emoji_36:1332790955136520273>') // Emoji de liberar
      .setStyle(ButtonStyle.Success);

    const lockButton = new ButtonBuilder()
      .setCustomId('Trancar1')
      .setLabel('Trancar')
      .setEmoji('<:emoji_37:1332790921229631530>') // Emoji de trancar
      .setStyle(ButtonStyle.Danger);

    const buttonRow = new ActionRowBuilder().addComponents(lockButton, unlockButton);

    let lockEmbed = new EmbedBuilder()
      .setDescription(`- Olá, Esse canal foi fechado esperar um administrador abrir\n <:emoji_37:1332790921229631530> Este canal foi trancado por ${interaction.user}.`)
      .setColor('#2b2d31');

    interaction.reply({ embeds: [lockEmbed], components: [buttonRow] }).then(() => {
      interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false })
        .catch(error => {
          console.error(error);
          interaction.reply({ content: 'Erro ao trancar o canal. Verifique as permissões do bot.' });
        });
    });

    const collector = interaction.channel.createMessageComponentCollector();

    collector.on("collect", async (collectedInteraction) => {
      // Verifica se o usuário que clicou no botão é o mesmo que executou o comando
      if (collectedInteraction.user.id !== interaction.user.id) {
        CSG collectedInteraction.reply({
          content: `${Emojis.get('negative')} Você não tem permissão para modificar este canal.`,
          ephemeral: true
        });
      }

      if (collectedInteraction.customId === 'Liberar1') {
        // Liberar o canal
        await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true });

        const unlockEmbed = new EmbedBuilder()
          .setDescription(`- Olá, Esse canal foi liberado por um administrador\n <:emoji_36:1332790955136520273> Este canal foi liberado por ${interaction.user}.`)
          .setColor('#2b2d31');

        collectedInteraction.update({ embeds: [unlockEmbed], components: [buttonRow] });
      } else if (collectedInteraction.customId === 'Trancar1') {
      
        collectedInteraction.update({ embeds: [lockEmbedAgain], components: [buttonRow] });
      }
    });
  }
};