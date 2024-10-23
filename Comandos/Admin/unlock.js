const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { General } = require("../../Database/index");

module.exports = {
    name:"unlock",
    description:"[STAFF] Destrancar canal",
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => {

        if (interaction.user.id !== General.get('owner') && !interaction.member.roles.cache.has(General.get("admrole"))) {
            interaction.reply({
                content: `Espere! Você não tem permissão para usar este comando`, ephemeral: true
            });
            return;
        }

        const guild = interaction.guild.id
        const channel = interaction.channel

        channel.permissionOverwrites.edit(guild, { SendMessages: true })
        .catch(error => {
          console.error(error);
          interaction.reply({ content: 'Erro ao destrancar o canal. Verifique as permissões do bot.' });
        });

        interaction.reply({content:`${interaction.user} Destrancou este canal`});

    }
}