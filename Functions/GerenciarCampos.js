const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } = require("discord.js")
const { produtos, configuracao } = require("../DataBaseJson")
const { QuickDB } = require("quick.db");
const db = new QuickDB();

async function GerenciarCampos2(interaction, campo, produtoname, update, reply) {

    let ggg
    let ggg2
    if (produtoname == undefined) {
        ggg2 = await db.set(`${interaction.message.id}.camposelect`, campo)
        ggg = await db.get(interaction.message.id)

    } else {
        ggg = {
            name: produtoname,
            camposelect: campo
        }
    }
    const hhhh = produtos.get(`${ggg.name}.Campos`)

    const gggaaa = hhhh.find(campo22 => campo22.Nome === campo)


    const infoCargosAdd = gggaaa.roleadd ? `Após a compra, terá o cargo <@&${gggaaa.roleadd}> adicionado` : '';
    const infoCargosRemove = gggaaa.rolerem ? `Após a compra, terá o cargo <@&${gggaaa.rolerem}> removido` : '';

    const bothUndefined = !gggaaa.roleadd && !gggaaa.rolerem;

    const a1 = gggaaa.condicao?.idcargo ? `Possuir o cargo <@&${gggaaa.condicao?.idcargo}> cargo.` : '';
    const a2 = gggaaa.condicao?.valorminimo ? `Comprar no mínimo ${gggaaa.condicao?.valorminimo} unidades.` : '';
    const a3 = gggaaa.condicao?.valormaximo ? `Comprar no máximo ${gggaaa.condicao?.valormaximo} unidades.` : '';

    const a4 = !gggaaa.condicao?.idcargo && !gggaaa.condicao?.valorminimo && !gggaaa.condicao?.valormaximo;
    const condicaoInfoValue = `${a1}${a2 && (a1 || a3) ? '\n' : ''}${a2}${a3 && (a2 || a1) ? '\n' : ''}${a3 || ''}`;

    const ggawdwadaw = produtos.get(`${ggg.name}.UltimaReposicao`)

    var detalhesaa

    if (ggawdwadaw !== null) {
        detalhesaa = `Última reposição no estoque <t:${Math.ceil(ggawdwadaw / 1000)}:R>`
    } else {
        detalhesaa = `Criado <t:${Math.ceil(gggaaa.criado / 1000)}:R>`
    }

    const embed = new EmbedBuilder()
        .setAuthor({ name: 'Rust - Configurar Produto.', iconURL: 'https://cdn.discordapp.com/attachments/1331745623929655391/1331768744527269972/a_4d4a9e53dc5c1dfa0426d4785a3c9b63.gif?ex=6792d1cb&is=6791804b&hm=cce19310dc6f9158801ad2be0098eac973f0234f453198dbd475ce33e339b285&' })
        .setFooter(
            { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
        )
        .setTimestamp()
        .setColor('#8000ff')
        .setTitle(`${gggaaa.Nome}`)
        .setDescription('> - *Informações do Produto abaixo*')
        .addFields(
            { name: `**Cargos**`, value: `${infoCargosAdd}${bothUndefined ? '\`Não Definido\`' : (infoCargosAdd && infoCargosRemove ? '\n' : '')}${infoCargosRemove || ''}`, inline: false },
            { name: `**Estoque**`, value: `\`${gggaaa.estoque.length} Unidades\``, inline: true },
            { name: `**Preço**`, value: `\`R$ ${Number(gggaaa.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\``, inline: true },
            { name: `**Condições**`, value: `${a4 ? '\`Não Definido\`' : condicaoInfoValue}`, inline: true },
        )

    if (gggaaa.desc !== '') {
        embed.setDescription(`${gggaaa.desc}`)
    }

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("editarcampooo")
                .setLabel('Editar')
                .setEmoji(`1292614700194074689`)
                .setStyle(2),

            new ButtonBuilder()
                .setCustomId("addestoquecampos")
                .setLabel('Adicionar Estoque')
                .setEmoji(`1309888161421332531`)
                .setStyle(2),

            new ButtonBuilder()
                .setCustomId("cargosremadd")
                .setLabel('Cargos')
                .setEmoji(`1183066194085953597`)
                .setStyle(2),

            new ButtonBuilder()
                .setCustomId("gwdawdwadawawderenciarcampossss")
                .setLabel('Definir Condições')
                .setEmoji(`1178317298793205851`)
                .setStyle(2),


        )

    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("colocarvenda")
                .setLabel("Colocar a venda")
                .setEmoji(`1178157032688336916`)
                .setStyle(3),

                new ButtonBuilder()
                .setCustomId("excluirproduto")
                .setLabel('Deletar Produto')
                .setEmoji(`1178076767567757312`)
                .setStyle(4),

        )

    const row5 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("Voltar4")
                .setLabel('Voltar')
                .setEmoji(`1178068047202893869`)
                .setStyle(2),

        )
    if (produtoname == undefined) {
        await interaction.update({ embeds: [embed], components: [row2, row3, row5], content: `` })
    } else {
        if (update !== true) {
            await interaction.reply({ embeds: [embed], components: [row2, row3, row5], content: ``, fetchReply: true, ephemeral: true }).then(async msg => {
                await db.set(`${msg.id}`, ggg)
            })
        } else {
            if (reply !== true) {
                await interaction.update({ embeds: [embed], components: [row2, row3, row5], content: `` }).then(async msg => {
                    await db.set(`${interaction.message.id}`, ggg)
                })
            } else {
                await interaction.reply({ embeds: [embed], components: [row2, row3, row5], content: ``, ephemeral: true }).then(async msg => {
                    const message = await interaction.fetchReply();
                    db.set(message.id, ggg)
                })
            }
        }
    }

}

async function GerenciarCampos(interaction, produtoname) {

    const ggg = produtos.get(produtoname)

    var campos = ''
    if (ggg.Campos.length === 0) {
        campos = `\`Nenhum campo adicionado\``;
    } else {
        for (let i = ggg.Campos.length - 1; i >= Math.max(0, ggg.Campos.length - 5); i--) {
            const campooo = ggg.Campos[i];
            campos += `- Nome: \`${campooo.Nome}\` Estoque: \`${campooo.estoque.length}\` Valor: \`R$ ${Number(campooo.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`\n`;
        }

        if (ggg.Campos.length > 5) {
            campos += `E mais ${ggg.Campos.length - 5}...`;
        }
    }

    var cupom = ''
    if (ggg.Cupom.length === 0) {
        cupom = `\`Nenhum cupom\``;
    } else {
        for (let i = ggg.Cupom.length - 1; i >= Math.max(0, ggg.Cupom.length - 3); i--) {
            const cupommmm = ggg.Cupom[i];

            const a1 = cupommmm.condicoes?.cargospodeusar ? `Possuí o cargo <@&${cupommmm.condicoes?.cargospodeusar}>` : '';
            const a2 = cupommmm.condicoes?.precominimo ? `Comprar no mínimo \`${cupommmm.condicoes?.precominimo}\` unidades` : '';
            const a3 = cupommmm.condicoes?.qtdmaxima ? `Comprar no máximo \`${cupommmm.condicoes?.qtdmaxima}\` unidades` : '';

            const a4 = !cupommmm.condicoes?.cargospodeusar && !cupommmm.condicoes?.precominimo && !cupommmm.condicoes?.qtdmaxima;
            const condicaoInfoValue = `${a1}${a2 && (a1 || a3) ? ',' : ''}${a2}${a3 && (a2 || a1) ? ',' : ''}${a3 || ''}`;

            cupom += `- Código: \`${cupommmm.Nome}\` Quantidade: \`${cupommmm.qtd == undefined ? `Ilimitado` : cupommmm.qtd}\` Desconto: \`${cupommmm.desconto}%\` Max. Usos: \`${cupommmm.maxuse == undefined ? `Ilimitado` : cupommmm.maxuse}\` Validade: \`${cupommmm.diasvalidos2 == undefined ? `Não expira` : cupommmm.diasvalidos2}\` N. Usos: \`${cupommmm.usos}\` Condições: ${a4 ? 'Não Definido' : condicaoInfoValue}\n`;
        }

        if (ggg.Cupom.length > 3) {
            cupom += `E mais ${ggg.Cupom.length - 3}...`;
        }
    }
    const embed = new EmbedBuilder()
        .setAuthor({ name: 'Rust - Gerenciar Campos.', iconURL: 'https://cdn.discordapp.com/attachments/1331745623929655391/1331768744527269972/a_4d4a9e53dc5c1dfa0426d4785a3c9b63.gif?ex=6792d1cb&is=6791804b&hm=cce19310dc6f9158801ad2be0098eac973f0234f453198dbd475ce33e339b285&' })
        .setTitle(`${ggg.Config.name}`)
        .addFields(
            { name: `Campos`, value: `${campos}` },
            { name: `Cupons`, value: `${cupom}` },
            { name: `Entrega automática?`, value: `\`${ggg.Config.entrega}\`` }
        )
        .setColor('#8000ff')

    const aaaaaa = produtos.get(`${produtoname}.Campos`)
    const gggaa = produtos.get(`${produtoname}`)

    const selectMenuBuilder = new StringSelectMenuBuilder()
        .setCustomId('configurarcampooo')
        .setPlaceholder('Clique aqui para gerenciar algum campo')
        .setMinValues(0)

    for (const aaaaaab of aaaaaa) {

        const gggag = aaaaaab.desc == '' ? `Não definido` : `${aaaaaab.desc}`

        const option = {
            label: `${aaaaaab.Nome}`,
            description: `${gggag.slice(0, 70)}`,
            value: aaaaaab.Nome,
        };
        selectMenuBuilder.addOptions(option);
    }

    const row2 = new ActionRowBuilder().addComponents(selectMenuBuilder);

    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("addcampoo")
                .setLabel('Adicionar campo')
                .setEmoji(`1178076508150059019`)
                .setStyle(3),

            new ButtonBuilder()
                .setCustomId("remcampo")
                .setLabel('Remover campo')
                .setEmoji(`1178076767567757312`)
                .setStyle(4),
        )

    const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("voltargerenciarproduto")
                .setLabel('Voltar')
                .setEmoji(`1178068047202893869`)
                .setStyle(2),

        )

    if (selectMenuBuilder.options == 0) {

        try {
            await interaction.update({ components: [row3, row4], embeds: [embed], content: `` })
            await db.set(interaction.message.id, { name: produtoname })
        } catch (error) {
            await interaction.reply({ components: [row3, row4], embeds: [embed], content: ``, fetchReply: true, ephemeral: true })
            interaction.fetchReply().then(async msg => {
                await db.set(`${msg.id}`, { name: produtoname })
            })
        }
    } else {
        try {
            await interaction.update({ components: [row2, row3, row4], embeds: [embed], content: `` })
            await db.set(interaction.message.id, { name: produtoname })
        } catch (error) {
            interaction.reply({ components: [row2, row3, row4], embeds: [embed], content: ``, fetchReply: true, ephemeral: true })
            interaction.fetchReply().then(async msg => {
                await db.set(`${msg.id}`, { name: produtoname })
            })
        }

    }

}

module.exports = {
    GerenciarCampos,
    GerenciarCampos2
}