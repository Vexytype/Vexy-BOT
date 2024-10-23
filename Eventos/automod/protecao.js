const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, Guild } = require("discord.js");
const { General, BList, welcomis } = require("../../Database/index");
const axios = require('axios');
const { CaptchaGenerator } = require("captcha-canvas");


module.exports = {
    name: "guildMemberAdd",
    run: async (member, client) => {

        const serveralvo = General.get('guildID')
        if (member.guild.id !== serveralvo) {
            return;
        }

        const protectSystem = await General.get(`SystemProtect`);

        if (protectSystem == false) return;

        let joinTimes = [];

        const currentTime = Date.now();
        joinTimes.push(currentTime);

        joinTimes = joinTimes.filter(time => currentTime - time < 300000);

        if (joinTimes.length >= 30) {
            member.guild.setVerificationLevel(5); 
            
            const captcha = new CaptchaGenerator()
                .setDimension(150, 450)
                .setCaptcha({ color: "black", backgroundColor: "white" });
            const buffer = captcha.generateSync();
            const attachment = new Discord.AttachmentBuilder(buffer, { name: 'captcha.png' });

            const captchaMsg = await member.send({
                content: "Por favor, resolva o captcha em até 30 segundos para confirmar que você não é um bot.",
                files: [attachment]
            });

            const filter = (response) => {
                return response.author.id === member.id && response.content === captcha.text;
            };

            try {
                await captchaMsg.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
                await member.roles.add(General.get('rolemember')); 
            } catch (err) {
                await member.kick('Falhou ao resolver o captcha');
            }
        }
    }
}