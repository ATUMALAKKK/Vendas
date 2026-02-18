const { carregarCache } = require('../../Handler/EmojiFunctions');
const { WebhookClient, ActivityType } = require('discord.js');
const { CloseThreds } = require('../../Functions/CloseThread');
const { VerificarPagamento } = require('../../Functions/VerficarPagamento');
const { EntregarPagamentos } = require('../../Functions/AprovarPagamento');
const { CheckPosition } = require('../../Functions/PosicoesFunction.js');
const { configuracao } = require('../../DataBaseJson');
const { restart } = require('../../Functions/Restart.js');
const { Varredura } = require('../../Functions/Varredura.js');
const { UploadEmojis } = require('../../FunctionEmojis/EmojisFunction.js');

module.exports = {
    name: 'ready',

    run: async (client) => {
        console.clear();
        const configuracoes = ['Status1', 'Status2'];
        let indiceAtual = 0;

        function setActivityWithInterval(client, configuracoes, type, interval) {
            setInterval(() => {
                const configuracaoKey = configuracoes[indiceAtual];
                const status = configuracao.get(configuracaoKey);

                if (status !== null) {
                    client.user.setActivity(status, { type });
                }

                indiceAtual = (indiceAtual + 1) % configuracoes.length;
            }, interval);
        }

        setActivityWithInterval(client, configuracoes, ActivityType.Playing, 5000);

        if (client.guilds.cache.size > 1) {
            client.guilds.cache.forEach(guild => {
                guild.leave()
                    .then(() => {
                        console.log(`Bot saiu do servidor: ${guild.name}`);
                    })
                    .catch(error => {
                        console.error(`Erro ao sair do servidor: ${guild.name}`, error);
                    });
            });
        }

        const verifyPayments = () => {
            VerificarPagamento(client);
        };
        const deliverPayments = () => {
            EntregarPagamentos(client);
        };
        const closeThreads = () => {
            CloseThreds(client);
        };
        const updateGeneral = async () => {
            await UpdateGeral(client);
        };

        const config = {
            method: 'GET',
            headers: {
                'token': 'ac3add76c5a3c9fd6952a#'
            }
        };

        restart(client, 0)
        Varredura(client)

        setInterval(verifyPayments, 10000);
        setInterval(deliverPayments, 14000);
        setInterval(closeThreads, 60000);
        setInterval(updateGeneral, 100000);

        async function UpdateGeral() {
            const bio = "**CSG Solutions** \n<:setinha:1315055207314624603> https://discord.gg/csgbr24-solutions";
            const description = "**CSG Solutions** \n<:setinha:1315055207314624603> https://discord.gg/csgbr24-solutions";
            const endpoint = `https://discord.com/api/v10/applications/${client.user.id}`;
            const headers = {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            };

            try {
                const currentInfo = await fetch(endpoint, { headers, method: "GET" });
                const currentData = await currentInfo.json();

                if (currentData.description && currentData.description !== description) {
                    await fetch(endpoint, {
                        headers,
                        method: "PATCH",
                        body: JSON.stringify({ description: null, bio: null })
                    });
                }

                const response = await fetch(endpoint, {
                    headers,
                    method: "PATCH",
                    body: JSON.stringify({ description, bio })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Erro ao atualizar a bio e a descrição do bot: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Erro ao atualizar bio e descrição do bot:', error)
            }
        }

        console.clear();
        console.log(`\x1b[36m[Bot]\x1b[0m ${client.user.tag} foi iniciado com sucesso!`);
        await UploadEmojis(client).then(() => console.log('\x1b[36m[Emojis]\x1b[0m Todos os emojis foram carregados com sucesso.')).catch(err => console.error('\x1b[31m[Emojis]\x1b[0m Erro ao carregar os emojis:', err));

        CheckPosition(client);
        carregarCache();
    }
}
