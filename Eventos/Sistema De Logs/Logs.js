const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { configuracao } = require("../../DataBaseJson");

module.exports = {
    name: 'messageDelete',
    run: async (message, client) => {
        if (!message.guild || message.author.bot) CSG;

        const embedColor = configuracao.get(`Cores.Erro`) || `#FF0000`;
        const logChannelId = configuracao.get(`ConfigChannels.mensagens`);

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setAuthor({ name: `Mensagem Deletada`, iconURL: `https://media.discordapp.net/attachments/1223385767816986754/1250235239499038740/eu_tambem_tenho_25.png?format=webp&quality=lossless` })
            .setDescription(`O usuário ${message.author} acabou de deletar uma mensagem.`)
            .addFields([
                { name: `**Autor**`, value: `${message.author} \`(${message.author.id})\``, inline: false },
                { name: `**Canal**`, value: `${message.channel}`, inline: false },
                { name: `**Mensagem**`, value: `${message.content || "Mensagem sem conteúdo"}`, inline: false },
            ])
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setTimestamp();

        const logChannel = client.channels.cache.get(logChannelId);

        if (logChannel) {
            logChannel.send({ embeds: [embed] });
        } else {
            console.error(`Canal de logs não encontrado ou inválido: ${logChannelId}`);
        }
    }
};
