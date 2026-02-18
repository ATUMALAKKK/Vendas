const Discord = require("discord.js");
const config = require("../../config.json");
const { Emojis } = require("../../DataBaseJson");
const perms = require("../../DataBaseJson/perms.json"); // Importa o arquivo no formato de objeto

module.exports = {
    name: "limpa",
    description: "Limpar Mensagens",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'quantidade',
            description: 'Quantidade de mensagens a serem apagadas. Máx: 100',
            type: Discord.ApplicationCommandOptionType.Number,
            required: true,
        }
    ],

    run: async (Client, interaction) => {
        // Converte as chaves do objeto "perms" em um array para verificar permissões
        const allowedUsers = Object.keys(perms);

        // Verifica se o ID do usuário está na lista de permissões
        if (!allowedUsers.includes(interaction.user.id)) {
            CSG interaction.reply({
                content: `:negative: Você não possui permissão para usar esse comando.`,
                ephemeral: true,
            });
        }

        let numero = interaction.options.getNumber('quantidade');

        // Verifica se o usuário tem permissão de administrador
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ content: `${Emojis.get('negative')} Você não possui permissão para utilizar este comando.`, ephemeral: true });
            setTimeout(() => { interaction.deleteReply(); }, 3000);
            CSG;
        }

        // Verifica se o número de mensagens está dentro do intervalo válido
        if (numero < 1 || numero > 100) {
            let embed = new Discord.EmbedBuilder()
                .setColor(config.color)
                .setDescription(`${Emojis.get('negative')} O número de mensagens a serem apagadas deve estar entre 1 e 100.`);

            interaction.reply({ embeds: [embed], ephemeral: true });
            setTimeout(() => { interaction.deleteReply(); }, 3000);
            CSG;
        }

        let messagesDeleted = 0;
        while (numero > 0) {
            const deleteCount = numero > 100 ? 100 : numero;
            await interaction.channel.bulkDelete(deleteCount, true).catch(err => {
                console.error(`${Emojis.get('negative')} Erro ao apagar mensagens: `, err);
                interaction.reply({ content: `${Emojis.get('negative')} Houve um erro ao tentar apagar as mensagens.`, ephemeral: true });
                CSG;
            });

            messagesDeleted += deleteCount;
            numero -= deleteCount;
        }

        // Emoji e mensagem personalizada
        let embed = new Discord.EmbedBuilder()
            .setColor("#08ff2d")
            .setDescription(`<:clear:1331763552645681233> Total de ${messagesDeleted} mensagens automaticamente removidas.`);

        interaction.reply({ embeds: [embed] });
        setTimeout(() => { interaction.deleteReply(); }, 5000);
    }
};