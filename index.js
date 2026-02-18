const { GatewayIntentBits, Client, Collection, ChannelType, EmbedBuilder, Partials } = require("discord.js")
const { AtivarIntents } = require("./Functions/StartIntents");
const express = require("express");
const app = express();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
        Object.keys(GatewayIntentBits),
    ],
    partials: [Object.keys(Partials)]
});

client.setMaxListeners(20);

const estatisticasStormInstance = require("./Functions/VariaveisEstatisticas");
const EstatisticasStorm = new estatisticasStormInstance();
module.exports = { EstatisticasStorm }

AtivarIntents()

const config = require("./config.json");
const events = require('./Handler/events')
const slash = require('./Handler/slash');

slash.run(client)
events.run(client)

client.slashCommands = new Collection();

client.on('guildCreate', guild => {


    if (client.guilds.cache.size > 1) {
        guild.leave()
    }

})

process.on('unhandRejection', (reason, promise) => {
    console.log(`🚫 Erro Detectado:\n\n` + reason, promise);
});

process.on('uncaughtException', (error, origin) => {
    console.log(`🚫 Erro Detectado:\n\n` + error, origin);
});

client.login(config.token);