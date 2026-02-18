const Discord = require("discord.js");
const { Emojis } = require("../../DataBaseJson");

module.exports = {
    name: "anunciar",
    description: "Envie uma mensagem personalizada",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "texto",
            description: "Coloque o texto da mensagem aqui.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "botao",
            description: "Escolha se quer mensagem com botão automático.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: "SIM", value: "sim" },
                { name: "NÃO", value: "nao" }
            ]
        },
        {
            name: "canal",
            description: "Selecione o canal para enviar a mensagem (opcional).",
            type: Discord.ApplicationCommandOptionType.Channel,
            channelTypes: [Discord.ChannelType.GuildText],
            required: false
        }
    ],

    run: async (client, interaction) => {
        const texto = interaction.options.getString("texto");
        const canal = interaction.options.getChannel("canal") || interaction.channel;
        const botao = interaction.options.getString("botao");

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ 
                content: `${Emojis.get('negative')} Você não possui permissão para utilizar este comando.`, 
                ephemeral: true 
            });
            setTimeout(() => { interaction.deleteReply(); }, 3000);
            CSG;
        }

        const button = new Discord.ButtonBuilder()
            .setCustomId('botao')
            .setLabel('Mensagem Automática')
            .setStyle(Discord.ButtonStyle.Secondary)
            .setDisabled(true);

        const actionRow = new Discord.ActionRowBuilder().addComponents(button);

        try {
            await canal.send({ 
                content: texto,
                components: botao === 'sim' ? [actionRow] : [] 
            });

            interaction.reply({ 
                content: `${Emojis.get('checker')} Mensagem enviada com sucesso!`, 
                ephemeral: true 
            });
            setTimeout(() => { interaction.deleteReply(); }, 3000);
        } catch (error) {
            console.error('Erro ao enviar a mensagem:', error);
            interaction.reply({ 
                content: `${Emojis.get('negative')} Ocorreu um erro ao tentar enviar a mensagem.`, 
                ephemeral: true 
            });
        }
    }
};
