
const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
const { produtos, carrinhos, configuracao, pagamentos, Emojis} = require("../../DataBaseJson");
const { QuickDB } = require("quick.db");
const { GerenciarCampos, GerenciarCampos2 } = require("../../Functions/GerenciarCampos");
const { MessageStock } = require("../../Functions/ConfigEstoque.js");
const { MessageCreate } = require("../../Functions/SenderMessagesOrUpdates");
const { VerificaçõesCarrinho, CreateCarrinho } = require("../../Functions/CreateCarrinho");
const { DentroCarrinho1, DentroCarrinho2, DentroCarrinhoPix } = require("../../Functions/DentroCarrinho");
const { VerificarCupom, AplicarCupom } = require("../../Functions/VerificarCupom");
const { getPermissions } = require("../../Functions/PermissionsCache.js");
const db = new QuickDB();


module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {


        if (interaction.type == Discord.InteractionType.ModalSubmit) {

            if (interaction.customId === '2313awdawdawdawdaw123141') {

                let cupom = interaction.fields.getTextInputValue('tokenMP');

                await VerificarCupom(interaction, cupom)

                //await AplicarCupom(interaction, cupom)


            }


            if (interaction.customId === '2313141') {

                let qtd = interaction.fields.getTextInputValue('tokenMP');



                const ggg = carrinhos.get(interaction.channel.id)


                const hhhh = produtos.get(`${ggg.infos.produto}.Campos`)
                const gggaaa = hhhh.find(campo22 => campo22.Nome === ggg.infos.campo)

                if (isNaN(qtd) || qtd <= 0 || qtd % 1 !== 0) {
                    CSG interaction.reply({
                        content: `❓ A quantidade \`${qtd}\` não é um número inteiro válido ou é menor ou igual a zero, tente novamente.`,
                        ephemeral: true
                    });
                }

                if (qtd > gggaaa.estoque.length) {
                    CSG interaction.reply({
                        content: `${Emojis.get('negative')} A quantidade solicitada de \`${qtd}\` excede o estoque disponível.`,
                        ephemeral: true
                    });
                }


                if (ggg.cupomadicionado !== undefined) {
                    const hhhh = produtos.get(`${ggg.infos.produto}.Cupom`)
                    const gggaaa = hhhh.find(campo22 => campo22.Nome === ggg.cupomadicionado)

                    if (gggaaa.condicoes?.precominimo !== undefined) {

                        if (qtd < gggaaa.condicoes?.precominimo) {
                            CSG interaction.reply({ content: `${Emojis.get('negative')} A quantidade solicitada de \`${qtd}\` não está no valor minimo para utilizar o cupom de \`${gggaaa.condicoes?.precominimo}\`.`, ephemeral: true })
                        }

                        if (qtd > gggaaa.condicoes?.qtdmaxima) {
                            CSG interaction.reply({ content: `${Emojis.get('negative')} A quantidade solicitada de \`${qtd}\` excede o limite para o uso do cupom de \`${gggaaa.condicoes?.precominimo}\`.`, ephemeral: true })
                        }

                    }

                }

                await carrinhos.set(`${interaction.channel.id}.quantidadeselecionada`, qtd)

                DentroCarrinho1(interaction, 1)

            }
        }





        let infos = {}

        if (interaction.isButton()) {

            if (interaction.customId == 'codigocopiaecola') {
                const yy = await carrinhos.get(interaction.channel.id)
                interaction.reply({ content: `${yy.pagamentos.cp}`, ephemeral: true })

            }

            if (interaction.customId == 'pagarpix') {
                DentroCarrinhoPix(interaction, client)
            }

            if (interaction.customId == 'voltarcarrinho') {
                DentroCarrinho1(interaction, 1)
            }

            if (interaction.customId == 'irparapagamento') {
                if (configuracao.get(`pagamentos.SemiAutomatico.status`) == true) {
                    interaction.deferUpdate()
                    await interaction.message.edit({ content: `${Emojis.get('loading')} Aguarde um momento...`, components: [], embeds: [] })

                    const pagamento = configuracao.get(`pagamentos.SemiAutomatico`)
                    const { qrGenerator } = require('../../Lib/QRCodeLib.js')
                    const qr = new qrGenerator({ imagePath: './Lib/aaaaa.png' })
                    const yy = await carrinhos.get(interaction.channel.id)

                    const hhhh = produtos.get(`${yy.infos.produto}.Campos`)
                    const gggaaa = hhhh.find(campo22 => campo22.Nome === yy.infos.campo)


                    let valor = 0

                    if (yy.cupomadicionado !== undefined) {
                        const valor2 = gggaaa.valor * yy.quantidadeselecionada

                        const hhhh2 = produtos.get(`${yy.infos.produto}.Cupom`)
                        const gggaaaawdwadwa = hhhh2.find(campo22 => campo22.Nome === yy.cupomadicionado)
                        valor = valor2 * (1 - gggaaaawdwadwa.desconto / 100);
                    } else {
                        valor = gggaaa.valor * yy.quantidadeselecionada
                    }

                    const { QrCodePix } = require('qrcode-pix')

                    const valor2 = Number(valor.toFixed(2))
                    const qrCodePix = QrCodePix({
                        version: '01',
                        key: pagamento.pix, //or any PIX key
                        name: pagamento.pix,
                        city: 'BRASILIA',
                        cep: '28360000',
                        value: valor2,
                    });

                    const chavealeatorio = qrCodePix.payload()

                    const qrcode = await qr.generate(chavealeatorio)


                    const buffer = Buffer.from(qrcode.response, "base64");
                    const attachment = new Discord.AttachmentBuilder(buffer, { name: "payment.png" });

                    const embed = new EmbedBuilder()
                        .setColor('#ffa200')
                        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })

                        .setTitle(`Pagamento via PIX criado`)
                        .addFields(
                            { name: `Código copia e cola`, value: `\`\`\`Chave PIX: ${pagamento.pix}\n\nValor: ${Number(valor).toFixed(2)}\`\`\`` }
                        )



                    const row3 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("codigocopiaecolaadwdawd")
                                .setLabel('Código copia e cola')
                                .setEmoji(`1309889619730370560`)
                                .setStyle(2),

                            new ButtonBuilder()
                                .setCustomId("confirmarpagamentomanual")
                                .setEmoji('1292614563774074931')
                                .setStyle(3),
                            new ButtonBuilder()
                                .setCustomId("deletchannel")
                                .setEmoji('1309889262480658563')
                                .setStyle(4),

                        )

                    embed.setImage('attachment://payment.png')

                    await interaction.message.edit({ content: ``, embeds: [embed], components: [row3], files: [attachment] })
                    await interaction.channel.send({ content: `||${interaction.user}|| ${pagamento.msg}` })

                    interaction.channel.setName(`💱・${interaction.user.username}・${interaction.user.id}`)

                } else {
                    DentroCarrinho2(interaction)
                }

            }

            if (interaction.customId == 'confirmarpagamentomanual') {

                const perm = await getPermissions(client.user.id)
                if (perm === null || !perm.includes(interaction.user.id)) {
                    CSG interaction.reply({ content: `${Emojis.get('negative')} Você não possui permissão para usar esse comando.`, ephemeral: true });
                }

                if (carrinhos.has(interaction.channel.id) == false) CSG interaction.reply({ content: `${Emojis.get('negative')} Não há um carrinho aberto neste canal.`, ephemeral: true })

                interaction.message.delete()

                const yy = await carrinhos.get(interaction.channel.id)

                const hhhh = produtos.get(`${yy.infos.produto}.Campos`)
                const gggaaa = hhhh.find(campo22 => campo22.Nome === yy.infos.campo)


                let valor = 0

                if (yy.cupomadicionado !== undefined) {
                    const valor2 = gggaaa.valor * yy.quantidadeselecionada

                    const hhhh2 = produtos.get(`${yy.infos.produto}.Cupom`)
                    const gggaaaawdwadwa = hhhh2.find(campo22 => campo22.Nome === yy.cupomadicionado)
                    valor = valor2 * (1 - gggaaaawdwadwa.desconto / 100);
                } else {
                    valor = gggaaa.valor * yy.quantidadeselecionada
                }




                const mandanopvdocara = new EmbedBuilder()
                .setColor(`#fcba03`)
                .setAuthor({ name: `Pedido Solicitado`, iconURL: `https://cdn.discordapp.com/emojis/1292614588960866315.webp?size=96` })
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTimestamp()
                .setDescription('Seu pedido foi criado e agora está aguardando a confirmação do pagamento')
                .addFields({ name: '**Detalhes**', value: `\`${yy.quantidadeselecionada}x ${yy.infos.produto} - R$ ${Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`` });

                try {
                    await interaction.user.send({ embeds: [mandanopvdocara] })
                } catch (error) {

                }



                const dsfjmsdfjnsdfj = new EmbedBuilder()
                .setColor(`#fcba03`)
                    .setAuthor({ name: `Pedido #Aprovado Manualmente` })
                    .setTitle(`🛍️ Pedido solicitado`)
                    .setDescription(`Usuário ${interaction.user} solicitou um pedido`)
                    .addFields(
                        { name: `**Detalhes**`, value: `\`${yy.quantidadeselecionada}x ${yy.infos.produto} - ${yy.infos.campo} | R$ ${Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`` },
                        { name: `**Forma de pagamento**`, value: `Manualmente` }
                    )
                    .setFooter(
                        { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
                    )
                    .setTimestamp()





                try {
                    const channela = await client.channels.fetch(configuracao.get(`ConfigChannels.logpedidos`));
                    await channela.send({ embeds: [dsfjmsdfjnsdfj] }).then(yyyyy => {
                        carrinhos.set(`${interaction.channel.id}.replys`, { channelid: yyyyy.channel.id, idmsg: yyyyy.id })
                    })
                } catch (error) {

                }

                pagamentos.set(`${interaction.channel.id}`, { pagamentos: { id: `Aprovado Manualmente`, method: `pix`, data: Date.now() } })
                interaction.reply({ content: `${Emojis.get('checker')} Pagamento aprovado manualmente. Aguarde..`, ephemeral: true })

            }

            if (interaction.customId == 'codigocopiaecolaadwdawd') {
                const pagamento = configuracao.get(`pagamentos.SemiAutomatico`)
                interaction.reply({ content: `> - **Chave pix:** \`\`\`${pagamento.pix}\`\`\``, ephemeral: true })
            }

            if (interaction.customId == 'deletchannel') {
                interaction.channel.delete()
            }


            if (interaction.customId == 'usarcupom') {


                const modalaAA = new ModalBuilder()
                    .setCustomId('2313awdawdawdawdaw123141')
                    .setTitle(`Aplicar Cupom`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`CUPOM`)
                    .setPlaceholder(`Qual nome do cupom?`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)


                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN)



                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);


            }


            if (interaction.customId == 'editarquantidade') {

                const modalaAA = new ModalBuilder()
                    .setCustomId('2313141')
                    .setTitle(`Alterar Quantidade`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`CÓDIGO`)
                    .setPlaceholder(`Insira a quantia que deseja comprar, exemplo: 3`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)


                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN)



                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }


            if (interaction.customId.startsWith('comprarid_')) {

                const gg = interaction.customId
                const yy = gg.replace('comprarid_', '')
                const partes = yy.split('_');
                const campo = partes[0]
                const produto = partes[1]



                const hhhh = produtos.get(`${produto}.Campos`)
                if (hhhh == null) CSG interaction.reply({ content: `${Emojis.get('negative')} Este produto não existe.`, ephemeral: true }).then(msg => {
                    interaction.message.delete()
                })
                const gggaaa = hhhh.find(campo22 => campo22.Nome === campo)



                infos = {
                    estoque: gggaaa.estoque.length,
                    produto: produto,
                    campo: campo
                }

            }


            if (interaction.customId.startsWith('editestoque_')) {


                const regex = /editestoque_(.*?)_(.*)/;
                const correspondencias = interaction.customId.match(regex);

                const produto = correspondencias[1];
                const campo = correspondencias[2];

                MessageStock(interaction, 1, produto, campo)





            }



            if (interaction.customId.startsWith('foraestoquealarme_')) {


                const regex = /foraestoquealarme_(.*?)_(.*)_(.*)/;
                const correspondencias = interaction.customId.match(regex);


                const produto = correspondencias[1];
                const campo = correspondencias[2];
                const status = correspondencias[3];

                const hhhh = produtos.get(`${produto}.Campos`)
                const gggaaa = hhhh.find(campo22 => campo22.Nome === campo)

                if (gggaaa.avisar !== undefined) {
                    if (!gggaaa.avisar.includes(interaction.user.id)) {
                        gggaaa.avisar.push(interaction.user.id)
                        if (status == 1) {
                            interaction.reply({ content: `${Emojis.get('checker')} Você será notificado assim que for reabastecido o stock (Para desabilitar clique novamente no botão!).`, ephemeral: true })
                        } else {
                            interaction.update({ content: `${Emojis.get('checker')} Você será notificado assim que for reabastecido o stock (Para desabilitar clique novamente no botão!).` })
                        }

                    } else {
                        const indexToRemove = gggaaa.avisar.indexOf(interaction.user.id);

                        if (indexToRemove !== -1) {
                            gggaaa.avisar.splice(indexToRemove, 1);
                        }
                        if (status == 1) {
                            interaction.reply({ content: `${Emojis.get('infus')} Você já estava salvo para ser notificado, portanto foi retirado (Caso queira basta clicar novamente no botão!).`, ephemeral: true })
                        } else {
                            interaction.update({ content: `${Emojis.get('infus')} Você já estava salvo para ser notificado, portanto foi retirado (Caso queira basta clicar novamente no botão!).` })
                        }

                    }
                } else {
                    gggaaa.avisar = [interaction.user.id]
                    if (status == 1) {
                        interaction.reply({ content: `${Emojis.get('checker')} Você será notificado assim que for reabastecido o stock (Para desabilitar clique novamente no botão!).`, ephemeral: true })
                    } else {
                        interaction.update({ content: `${Emojis.get('checker')} Você será notificado assim que for reabastecido o stock (Para desabilitar clique novamente no botão!).` })
                    }
                }

                await produtos.set(`${produto}.Campos`, hhhh)

            }

        }

        if (interaction.isStringSelectMenu()) {
            if (interaction.customId == 'comprarid') {

                const gg = interaction.values[0]
                const partes = gg.split('_');
                const campo = partes[0]
                const produto = partes[1]

                const hhhh = produtos.get(`${produto}.Campos`)
                const gggaaa = hhhh.find(campo22 => campo22.Nome === campo)

                infos = {
                    estoque: gggaaa.estoque.length,
                    produto: produto,
                    campo: campo
                }

            }
        }


        if (Object.keys(infos).length !== 0) {

            const verify = await VerificaçõesCarrinho(infos)

            if (verify.error == 400) {
                const row3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`foraestoquealarme_${infos.produto}_${infos.campo}_0`)
                            .setLabel('Avisar quando o estoque voltar')
                            .setEmoji(`1178066050076643458`)
                            .setStyle(1),
                    )
                interaction.reply({ content: `${Emojis.get('avisus')} Este item está fora de estoque.`, ephemeral: true, components: [row3] })

                // 

            }
            const hhhh = produtos.get(`${infos.produto}.Campos`)
            const gggaaa = hhhh.find(campo22 => campo22.Nome === infos.campo)

            if (gggaaa.condicao?.idcargo !== undefined) {

                const member = await interaction.guild.members.fetch(interaction.user.id);
                const temCargo = member.roles.cache.has(gggaaa.condicao?.idcargo);
                if (temCargo == false) CSG interaction.reply({ content: `${Emojis.get('negative')} Você não possui permissão para comprar esse produto!`, ephemeral: true })
            }

            if (verify.status == 202) {



                CreateCarrinho(interaction, infos)




            }
        }

    }
}