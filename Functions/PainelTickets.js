const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const { tickets } = require("../DataBaseJson");

async function painelTicket(interaction) {
    const aparencia = tickets.get('tickets.aparencia') || {};
    const { title, description, color, banner } = aparencia;
    const embed = new EmbedBuilder()
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp()
        .setTitle(title || '')
        .setDescription(description || '')
        .setColor(color || '0cd4cc')
        .setImage(banner || '');

    const funcoes = tickets.get('tickets.funcoes') || {};
    const maxItems = 4;
    let count = 0;

    for (const [key, { nome, predescricao, descricao, emoji }] of Object.entries(funcoes)) {
        if (count++ >= maxItems) break;
        embed.addFields({
            name: `**${nome || 'Função'}**`,
            value: `**Pré descrição:** \`${predescricao || 'Não definido'}\`\n**Emoji:** ${emoji || 'Não definido'}\n**Descrição:**\n${descricao || 'Não definido, será enviado o principal.'}\n\n`
        });
    }

    if (Object.keys(funcoes).length > maxItems) {
        const restante = Object.keys(funcoes).length - maxItems;
        embed.addFields({ name: '\u200B', value: `Mais ${restante} item${restante > 1 ? 's' : ''}...` });
    }

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("definiraparencia").setLabel('Painel ticket').setEmoji('1324734205334388746').setStyle(1)
    );

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("addfuncaoticket").setLabel('Criar Função').setEmoji('1324734337978990683').setStyle(3),
        new ButtonBuilder().setCustomId("editfuncaoticket").setLabel('Editar função').setEmoji('1324824700957753344').setStyle(2),
        new ButtonBuilder().setCustomId("remfuncaoticket").setLabel('Remover função').setEmoji('1324734604275482717').setStyle(4)
    );

    const row4 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("postarticket").setLabel('Enviar Ticket').setEmoji('1324732706566701077').setStyle(1),
        new ButtonBuilder().setCustomId("sincronizarticket").setLabel('Atualizar').setEmoji('1324732222053552302').setStyle(1),
        new ButtonBuilder().setCustomId("voltar1").setLabel('Voltar').setEmoji('1178068047202893869').setStyle(2)
    );

    await interaction.update({ embeds: [embed], components: [row2, row3, row4], content: '' });
}

module.exports = {
    painelTicket
};