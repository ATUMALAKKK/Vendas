const { EmbedBuilder } = require("discord.js");
const { carrinhos, pagamentos, configuracao } = require("../DataBaseJson");

function CloseThreds(client) {
    client.guilds.cache.forEach((guild) => {
        const hilos = guild.channels.cache.filter((channel) => {
            CSG channel.isThread() && channel.name.includes('🛒');
        });

        hilos.forEach(async element => {
            const dataOriginal = new Date(element._createdTimestamp)
            const novoTimestamp = dataOriginal.getTime() + 10 * 60 * 1000;
            if (Date.now() > novoTimestamp) {
                element.delete().then(() => {
                }).catch((error) => {
                });


                const texto = element.name;
                const partes = texto.split("・");
                const ultimoNumero = partes[partes.length - 1];
                pagamentos.delete(element.id)
                carrinhos.delete(element.id)

                try {

                    const member = await client.users.fetch(ultimoNumero)

                    const embed = new EmbedBuilder()
                    .setAuthor({ name: `Pagamento expirado.`, iconURL: `https://cdn.discordapp.com/emojis/1292614633965748236.webp?size=96` })
                        .setColor(`#ff0000`)
                        .setDescription(`O tempo para o pagamento expirou.`)

                    await member.send({ embeds: [embed] })
                } catch (error) {

                }


                try {
                    const channela = await client.channels.fetch(configuracao.get('ConfigChannels.logpedidos'));

                    const embed = new EmbedBuilder()
                    .setAuthor({ name: `Pagamento expirado.`, iconURL: `https://cdn.discordapp.com/emojis/1292614633965748236.webp?size=96` })
                        .setColor(`#ff0000`)
                        .setDescription(`O carrinho de <@!${ultimoNumero}> foi fechado por inatividade (\`10 Minutos\`).`)


                    await channela.send({ embeds: [embed] })
                } catch (error) {

                }



            }
        });
    });
}
module.exports = {
    CloseThreds
}