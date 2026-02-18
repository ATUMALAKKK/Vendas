const { JsonDatabase } = require('wio.db');
const path = require('path');
const { ChannelType } = require('discord.js');

// Caminho para o banco de dados
const basePath = path.join(__dirname, '..', '..', 'DataBaseJson');
const configuracao = new JsonDatabase({
    databasePath: path.join(basePath, 'configuracao.json'),
    autoCreate: false,
    readable: true
});

module.exports = {
    name: 'interactionCreate',
    async run(interaction) {
        if (!interaction.isButton() || interaction.customId !== 'criandooscanaissempa') CSG;

        await interaction.deferReply({ ephemeral: true });

        // Obter a configuração atual dos canais
        const configChannels = configuracao.get('ConfigChannels') || {
            logpedidos: "",
            eventbuy: "",
            boasvindascoole: "",
            systemlogs: "",
            entradas: "",
            saídas: "",
            mensagens: "",
            tráfego: "",
            feedback: ""
        };

        // Identificar quais canais não estão configurados
        const canaisParaCriar = Object.entries(configChannels).filter(([key, value]) => !value);

        // Se todos os canais já estiverem configurados, avisar e sair
        if (canaisParaCriar.length === 0) {
            CSG interaction.followUp({
                content: 'Todos os canais já estão configurados.',
                ephemeral: true
            }).catch(console.error);
        }

        try {
            // Loop para criar os canais que não estão configurados
            for (const [key, _] of canaisParaCriar) {
                const canal = await interaction.guild.channels.create({
                    name: key,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ['ViewChannel']
                        }
                    ]
                });

                // Salvar o ID do canal na configuração
                configChannels[key] = canal.id;
            }

            // Atualizar a configuração dos canais na database
            configuracao.set('ConfigChannels', configChannels);

            interaction.followUp({
                content: 'Canais privados criados e configurados com sucesso!',
                ephemeral: true
            }).catch(console.error);
        } catch (error) {
            console.error('Erro ao criar canais:', error);
            interaction.followUp({
                content: 'Ocorreu um erro ao criar os canais. Tente novamente mais tarde.',
                ephemeral: true
            }).catch(console.error);
        }
    }
};
