const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { General, BList, Tickesettings } = require("../Database/index");
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

async function panel(client, interaction) {
    interaction.update({
        content: ``,
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
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
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

async function AutoAction(client, interaction) {
    interaction.update({
        content: `Selecione a opção que deseja.`,
        embeds:[],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('autolockSettings')
                        .setLabel('Channel Auto-Lock')
                        .setStyle(1)
                        .setEmoji('1262641752314089513'),
                    new ButtonBuilder()
                        .setCustomId('autoMsgs')
                        .setLabel('Mensagens Automáticas')
                        .setStyle(1)
                        .setEmoji('1262641752314089513'),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('repostSellAuto')
                        .setLabel('Repostagem Automática de Anúncios')
                        .setStyle(1)
                        .setEmoji('1262641752314089513'),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("voltar1")
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji('1265111272312016906')
                ),
        ],
        ephemeral: true
    });
}


module.exports = {
    panel,
    AutoAction
};
