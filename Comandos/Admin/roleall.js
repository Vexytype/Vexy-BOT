const {ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType} = require("discord.js")
const { General } = require("../../Database/index");
const { notifyStock, downloadFile, obterEmoji } = require("../../Functions/definicoes")

module.exports = {
    name: 'role_all',
    description: '[STAFF] Give a role to all members.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'cargo',
            description: 'O cargo a ser atribuído a todos os membros',
            type: ApplicationCommandOptionType.Role,
            required: true
        }
    ],

    run: async (client, interaction) => {
        const EMOJI = await obterEmoji();

        const role = interaction.options.getRole('cargo');

        if (interaction.user.id !== General.get('owner') && !interaction.member.roles.cache.has(General.get("admrole"))) {
            interaction.reply({
                content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} Espere! Você não tem permissão para usar este comando`, ephemeral: true
            });
            return;
        }

        const members = await interaction.guild.members.fetch();
        const membersWithoutRole = members.filter(member => !member.roles.cache.has(role.id) && !member.user.bot);

        if (membersWithoutRole.size === 0) {
            return interaction.reply({content:``,ephemeral:true});
        }

        await interaction.reply({content:`${EMOJI.vx2 == null ? `` : `<a:${EMOJI.vx2.name}:${EMOJI.vx2.id}>`} Atribuindo o cargo ${role.name} a ${membersWithoutRole.size} membros, esta ação pode demorar um pouco..`, ephemeral:true});

        for (const member of membersWithoutRole.values()) {
            await member.roles.add(role).catch(console.error);
        }

        interaction.editReply({content:`${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} O cargo <@&${role.id}> foi atribuído a todos os membros elegíveis.`, ephemeral:true});
    },
};
