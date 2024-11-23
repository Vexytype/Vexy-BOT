const { ApplicationCommandType, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const { General, BList, Tickesettings } = require("../../Database/index");
const startTime = Date.now();

function cumprimento() {
    const horabrasil = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
    const hora = new Date(horabrasil).getHours();

    if (hora >= 0 && hora < 6) {
        return 'Boa madrugada';
    } else if (hora < 12) {
        return 'Bom dia';
    } else if (hora < 18) {
        return 'Boa tarde';
    } else {
        return 'Boa noite';
    }
}

module.exports = {
    name: "recursos",
    description: "[STAFF] Click by to use my features",
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (interaction.user.id !== General.get('owner') && !interaction.member.roles.cache.has(General.get("admrole"))) {
            interaction.reply({
                content: `Espere! Você não tem permissão para usar este comando`, ephemeral: true
            });
            return;
        }

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: "https://cdn.discordapp.com/emojis/1265111276237881454.webp?size=96&quality=lossless" })
                    .setTitle(`**Painel Geral**`)
                    .setDescription(`${cumprimento()}, Sr(a) **${interaction.user.username}**.\n\n- Nosso sistema é completamente personalizavel,\n customize-o da maneira que preferir.`)
                    .addFields(
                        { name: "**Current Version**", value: `\`2.0.0\``, inline: true },
                        { name: "**Ping**", value: `\`${client.ws.ping} ms\``, inline: true },
                        { name: `**Uptime**`, value: `<t:${Math.ceil(startTime / 1000)}:R>`, inline: true }
                    )
                    .setColor(General.get("oficecolor.main"))
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('gerenciarerVEndaa')
                            .setLabel('Gerenciar Loja')
                            .setStyle(1)
                            .setEmoji('1289309663183114270'),
                        new ButtonBuilder()
                            .setCustomId('gerenciarerTicket')
                            .setLabel('Painel Ticket')
                            .setStyle(1)
                            .setEmoji('1263226742399832160'),
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('moderationn')
                            .setLabel('Sistema de Moderação')
                            .setStyle(1)
                            .setEmoji('1276564802281672865'),
                        new ButtonBuilder()
                            .setCustomId('bemvindou')
                            .setLabel('Boas-vindas')
                            .setStyle(1)
                            .setEmoji('1261427087542059058'),
                        new ButtonBuilder()
                            .setCustomId('personalizarapp')
                            .setLabel('Customizar')
                            .setStyle(1)
                            .setEmoji('1251441839404220417'),
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('automaticosOption')
                            .setLabel('Ações Automáticas')
                            .setStyle(2)
                            .setEmoji('1262641711834861599'),
                        new ButtonBuilder()
                            .setCustomId('definiicao')
                            .setLabel('Definições do Bot')
                            .setStyle(2)
                            .setEmoji('1271659788614373399'),
                        new ButtonBuilder()
                            .setCustomId('infoBOOT')
                            .setStyle(2)
                            .setEmoji('1262641761692549204'),
                    )
            ],
            ephemeral: true
        });
    }
};
