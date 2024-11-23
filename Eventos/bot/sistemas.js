const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, Guild } = require("discord.js");
const { General, BList, BlPerma, welcomis } = require("../../Database/index");
const {  obterEmoji } = require("../../Functions/definicoes")

module.exports = {
    name: 'messageCreate',
    run: async (message, client) =>{
        if(message.author.bot) return;

        const reactssCanal = await General.get(`VendasFeedback`) || null;
        if(reactssCanal == null) return;
        if (message.channel.id !== reactssCanal) return;

        try {
            const EMOJI = await obterEmoji();
            await message.react(`${EMOJI.vx13 == null ? `1298052539438202981` : `<:${EMOJI.vx13.name}:${EMOJI.vx13.id}>`}`);
          } catch (error) {
            console.error('Erro ao reagir', error);
        }

    }
}