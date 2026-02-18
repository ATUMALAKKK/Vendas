const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } = require("discord.js");
const { configuracao } = require("../DataBaseJson");


async function ConfigChannels(interaction, client) {

    const row1 = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
        .setCustomId(`selectChannelC`)
        .addOptions(
            {
                value: `logpedidos`,
                label: `Canal de logs pedidos`,
                emoji: `1246953187529855037`
            },
            {
                value: `eventbuy`,
                label: `Canal de entregar`,
                emoji: `1246953442283618334`
            },
            {
                value: `boasvindascoole`,
                label: `Canal de boas vindas`,
                emoji: `1246955057879187508`
            },
            {
                value: `systemlogs`,
                label: `Canal de logs sistema`,
                emoji: `1246954960218886146`
            },
            {
                value: `logentrada`,
                label: `Canal de logs entradas`,
                emoji: `1246955020050759740`
            },
            {
                value: `logsaida`,
                label: `Canal de logs saídas`,
                emoji: `1246955006242983936`
            },
            {
                value: `logmensagem`,
                label: `Canal de logs mensagens`,
                emoji: `1246953149009367173`
            },
            {
                value: `trafegocall`,
                label: `Canal de logs Call`,
                emoji: `1246954972155875328`
            },
            {
                value: `feedback`,
                label: `Canal de logs feedback`,
                emoji: `1246955036433453259`
            }
        )
        .setPlaceholder(`Clique aqui para redefinir algum canal`)
        .setMaxValues(1)
    )
    const row2 = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId("voltar2")
                .setLabel('Voltar')
                .setEmoji(`1178068047202893869`)
                .setStyle(2)
        )



    const embed = new EmbedBuilder()

        .setTitle('Configurar Canais')
        .setColor(`${configuracao.get(`Cores.Principal`) == null ? '0cd4cc' : configuracao.get('Cores.Principal')}`) //0cd4cc
        .setDescription(`
**Canal de log de pedidos:** ${configuracao.get(`ConfigChannels.logpedidos`) == null ? `Não definido` : `<#${configuracao.get(`ConfigChannels.logpedidos`)}>`}
**Canal de evento de compras:** ${configuracao.get(`ConfigChannels.eventbuy`) == null ? `Não definido` : `<#${configuracao.get(`ConfigChannels.eventbuy`)}>`}
**Canal de boas vindas:** ${configuracao.get(`ConfigChannels.boasvindascoole`) == null ? `Não definido` : `<#${configuracao.get(`ConfigChannels.boasvindascoole`)}>`}
**Canal de logs do sistema:** ${configuracao.get(`ConfigChannels.systemlogs`) == null ? `Não definido` : `<#${configuracao.get(`ConfigChannels.systemlogs`)}>`}
**Canal de logs de entradas:** ${configuracao.get(`ConfigChannels.entradas`) == null ? `Não definido` : `<#${configuracao.get(`ConfigChannels.entradas`)}>`}
**Canal de logs de saídas:** ${configuracao.get(`ConfigChannels.saídas`) == null ? `Não definido` : `<#${configuracao.get(`ConfigChannels.saídas`)}>`}
**Canal de logs de mensagens:** ${configuracao.get(`ConfigChannels.mensagens`) == null ? `Não definido` : `<#${configuracao.get(`ConfigChannels.mensagens`)}>`}
**Canal de logs de tráfego em call:** ${configuracao.get(`ConfigChannels.tráfego`) == null ? `Não definido` : `<#${configuracao.get(`ConfigChannels.tráfego`)}>`}
**Canal de feedback:** ${configuracao.get(`ConfigChannels.feedback`) == null ? `Não definido` : `<#${configuracao.get(`ConfigChannels.feedback`)}>`}
`)
        .setFooter(
            { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
        )
        .setTimestamp()

    interaction.update({ content: ``, embeds: [embed], components: [row1, row2] })

}


async function ConfigRoles(interaction, client) {

    const row1 = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
        .setCustomId(`selectCargoC`)
        .addOptions(
            {
                value: `definircargoadm`,
                label: `Cargo de Administrador`,
                emoji: `1246954960218886146`
            },
            {
                value: `definircargosup`,
                label: `Crgo de Suporte`,
                emoji: `1246955036433453259`
            },
            {
                value: `roleclienteease`,
                label: `Cargo de Cliente`,
                emoji: `1256806658101870684`
            },
            {
                value: `rolememberok`,
                label: `Cargo de Membro`,
                emoji: `1246955106944028774`
            }
        )
        .setPlaceholder(`Clique aqui para redefinir algum cargo`)
        .setMaxValues(1)
    )

    const row2 = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId("voltar2")
                .setLabel('Voltar')
                .setEmoji(`1178068047202893869`)
                .setStyle(2)
        )


    const embed = new EmbedBuilder()

        .setTitle('Configurar cargos')
        .setColor(`${configuracao.get(`Cores.Principal`) == null ? '0cd4cc' : configuracao.get('Cores.Principal')}`)
        .setDescription(`
**Cargo de Administrador:** ${configuracao.get(`ConfigRoles.cargoadm`) == null ? `Não definido` : `<@&${configuracao.get(`ConfigRoles.cargoadm`)}>`}
**Cargo de Suporte:** ${configuracao.get(`ConfigRoles.cargosup`) == null ? `Não definido` : `<@&${configuracao.get(`ConfigRoles.cargosup`)}>`}
**Cargo de Cliente:** ${configuracao.get(`ConfigRoles.cargoCliente`) == null ? `Não definido` : `<@&${configuracao.get(`ConfigRoles.cargoCliente`)}>`}
**Cargo de Membro:** ${configuracao.get(`ConfigRoles.cargomembro`) == null ? `Não definido` : `<@&${configuracao.get(`ConfigRoles.cargomembro`)}>`}
    `)
        .setFooter(
            { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
        )
        .setTimestamp()

    interaction.update({ content: ``, embeds: [embed], components: [row1, row2] })

}


module.exports = {
    ConfigRoles,
    ConfigChannels
}
