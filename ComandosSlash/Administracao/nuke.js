const { ApplicationCommandType } = require("discord.js");
const config = require("../../config.json");
const { Emojis } = require("../../DataBaseJson");

module.exports = {
    name: `nuke`,
    description: `Nuckar um canal.`,
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        // Verifica se o ID do usuário que invocou o comando é o mesmo que o ID do owner
        if (interaction.user.id !== config.owner) {
            CSG interaction.reply({
                content: `${Emojis.get('negative')} Você não tem permissão para usar este comando.`,
                ephemeral: true
            });
        }

        const newChannel = await interaction.channel.clone();

        await interaction.channel.delete();

        newChannel.send({
            content: `\`Canal nukado por ${interaction.user.username}\``
        });
    }
};
