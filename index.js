const {
    Client,
    GatewayIntentBits,
    Collection,
    Partials,
  } = require('discord.js'),
  fs = require('fs')
console.clear()
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.AutoModerationExecution,
  ],
  partials: [Partials.Message, Partials.Channel],
})
module.exports = client
client.slashCommands = new Collection()
const { token } = require('./token.json')
client.login(token)
const evento = require('./handler/Events')
evento.run(client)
require('./handler/index')(client)
const axios = require('axios'),
  url = 'https://discord.com/api/v10/applications/@me',
  data = {
    description:
      '<:ed53:1276564802281672865> **Vexy Type**\nFeito em <:js:1253899725065945168>\nAtualizações: https://github.com/Vexytype/Vexy-BOT',
  }
axios.patch(url, data, {
  headers: {
    Authorization: 'Bot ' + token,
    'Content-Type': 'application/json',
  },
})
process.on('unhandRejection', (_0x195592, _0x1b6c04) => {
  console.log('Erro Detectado:\n\n' + _0x195592, _0x1b6c04)
})
process.on('uncaughtException', (_0xeb4b9f, _0x268218) => {
  console.log('Erro Detectado:\n\n' + _0xeb4b9f, _0x268218)
})
