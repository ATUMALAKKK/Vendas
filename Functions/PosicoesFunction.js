const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")
const { configuracao } = require("../DataBaseJson")
const { EstatisticasStorm } = require("../index.js")

function Posicao1(interaction, client) {

    const aa = configuracao.get(`posicoes`)

    const pos1 = aa?.pos1
    const pos2 = aa?.pos2
    const pos3 = aa?.pos3

    const embed = new EmbedBuilder()
        .setAuthor({ name: 'Rust - Página Posições.', iconURL: 'https://cdn.discordapp.com/attachments/1331745623929655391/1331768744527269972/a_4d4a9e53dc5c1dfa0426d4785a3c9b63.gif?ex=6792d1cb&is=6791804b&hm=cce19310dc6f9158801ad2be0098eac973f0234f453198dbd475ce33e339b285&' })
        .setColor('#8000ff')
        .setDescription(`> - Posições são cargos atribuídos com base nos gastos dos clientes no servidor.`)
        .addFields(
            { name: `__Primeira Colocação__`, value: `${pos1 == undefined ? `\`Não configurado\`` : `Recebe o **cargo** <@&${pos1.role}> após **gastar** \`R$ ${Number(pos1.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`.`}` },
            { name: `__Segunda Colocação__`, value: `${pos2 == undefined ? `\`Não configurado\`` : `Recebe o **cargo** <@&${pos2.role}> após **gastar** \`R$ ${Number(pos2.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`.`}` },
            { name: `__Terceira Colocação__`, value: `${pos3 == undefined ? `\`Não configurado\`` : `Recebe o **cargo** <@&${pos3.role}> após **gastar** \`R$ ${Number(pos3.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`.`}` },

        )
        .setFooter(
            { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
        )
        .setTimestamp()

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("Editarprimeiraposição")
                .setLabel('Definir primeira posição')
                .setEmoji(`1192563018547081369`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("Editarsegundaposição")
                .setLabel('Definir segunda posição')
                .setEmoji(`1192563056522309672`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("Editarterceiraposição")
                .setLabel('Definir terceira posição')
                .setEmoji(`1192563090726846464`)
                .setStyle(2),
        )

        const row2 = new ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
                .setCustomId("voltar3")
                .setLabel('Voltar')
                .setEmoji(`1178068047202893869`)
                .setStyle(2)
        );

    interaction.update({ embeds: [embed], components: [row, row2] })

}


async function CheckPosition(client) {
    const aa = configuracao.get(`posicoes`)
    if (aa === null) CSG;
    const { pos1, pos2, pos3 } = aa ?? {};
    await Promise.all(client.guilds.cache.map(async (guild) => {
        await processPosition(pos1, guild);
        await processPosition(pos2, guild);
        await processPosition(pos3, guild);
    }));
    async function processPosition(pos, guild) {
        if (!pos) CSG;

        const role = guild.roles.cache.get(pos.role);
        const aa = await EstatisticasStorm.GastouMais(null, Number(pos.valor));
        try {
            const members = await guild.members.fetch({ user: aa.map(user => user.userid) });

            for (const user of aa) {
                const member = members.get(user.userid);
                if (member && !member.roles.cache.has(role.id)) {
                    await member.roles.add(role.id).catch(() => {});
                }
            }
        } catch (error) {}
    }
}

module.exports = { Posicao1, CheckPosition }