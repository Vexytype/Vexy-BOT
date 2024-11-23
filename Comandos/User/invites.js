const Discord = require("discord.js")
const {ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType} = require("discord.js")
const { General } = require("../../Database/index");
const { notifyStock, downloadFile, obterEmoji } = require("../../Functions/definicoes")

module.exports = {
    name: "invites",
    description: "show all invites",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'usuario',
            description: 'analisar invites',
            type: ApplicationCommandOptionType.User,
            required: false,
        }
    ],

    run: async (client, interaction) => {
        let user = interaction.options.getUser('usuario');
        const guild = interaction.guild;
        const EMOJI = await obterEmoji();

        if(user == null) user = interaction.user;

        try {
            const invites = await guild.invites.fetch();

            const userInvites = invites.filter(invite => invite.inviter && invite.inviter.id === user.id);

            if (userInvites.size === 0) {
                return interaction.reply({
                    content: `${user.username} não possui convites no servidor.`,
                    ephemeral: true
                });
            }

            const inviteDetails = userInvites.map(invite => {
                return `${EMOJI.vx4 == null ? `` : `<:${EMOJI.vx4.name}:${EMOJI.vx4.id}>`} Código: \`${invite.code}\` | Usos: ${invite.uses || 0}`;
            }).join('\n');

            await interaction.reply({
                content: `${EMOJI.vx12 == null ? `` : `<a:${EMOJI.vx12.name}:${EMOJI.vx12.id}>`} Convites criados por ${user.username}:\n${inviteDetails}`
            });

        } catch (error) {
            console.error('Erro ao buscar convites:', error);
            await interaction.reply({
                content: 'Ocorreu um erro ao tentar buscar os convites.',
                ephemeral: true
            });
        }
    },
};