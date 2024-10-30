const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { General, BList  } = require("../../Database/index");
let timer = {};
const axios = require("axios");
const moment = require("moment");

module.exports = {
    name: 'guildMemberRemove',
    run: async (member, client) => {

        const serveralvo = General.get('guildID')
        if (member.guild.id !== serveralvo) {
            return;
        }
        
        try {
            const getLog = General.get(`logsaidas`);
            const exitLogs = member.guild.channels.cache.get(getLog);
            if (!exitLogs) return 


            let embed = new EmbedBuilder()
                .setColor(`${General.get(`oficecolor.red`)}`)
                .setAuthor({ name: `Registro de Saída`, iconURL: `https://cdn.discordapp.com/emojis/1265528442133418077.webp?size=96&quality=lossless` })
                .setDescription(`O usuário ${member} se retirou do servidor, que pena!.`)
                .setFooter({text:`Data da Saída |`, iconURL:"https://cdn.discordapp.com/emojis/1265111283103961219.webp?size=96&quality=lossless"})
                .setTimestamp();

                exitLogs.send({ embeds: [embed] });
        } catch (error) {
            console.error('Erro:', error);
        }
    }
}