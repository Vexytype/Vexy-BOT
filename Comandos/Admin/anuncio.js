const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { General } = require("../../Database/index");
const { anunciar } = require('../../Functions/anunciar')

module.exports = {
    name:"announce",
    description:"[STAFF] Make an announcement",
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => {

        if (interaction.user.id !== General.get('owner') && !interaction.member.roles.cache.has(General.get("admrole"))) {
            interaction.reply({
                content: `Espere! Você não tem permissão para usar este comando`, ephemeral: true
            });
            return;
        }

        anunciar(client, interaction)

    }
}