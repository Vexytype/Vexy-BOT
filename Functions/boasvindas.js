const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { General, welcomis } = require("../Database/index");

async function welcome(client, interaction) {
    interaction.update({
        content:``,
        embeds: [
            new EmbedBuilder()
                .setAuthor({ name: `Definições de Boas-vindas`, iconURL: "https://cdn.discordapp.com/emojis/1265508950858793001.webp?size=96&quality=lossless" })
                .setDescription(`Olá, Sr(a) **${interaction.user.username}**\n \n- **Selecione abaixo a opção deseja configurar.** \n
**Canal de Boas vindas:** ${welcomis.get(`welcomeMSG.chatentrada`) == null ? `\`Não definido\`` : `<#${welcomis.get(`welcomeMSG.chatentrada`)}>`}`)
                .setColor(General.get("oficecolor.main"))
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                .setTimestamp()
        ],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("canallentrada")
                        .setLabel("Canal de Boas vindas")
                        .setStyle(1)
                        .setEmoji('1261427087542059058'),
                    new ButtonBuilder()
                        .setCustomId('Msgwelcome')
                        .setLabel('Mensagem de Boas vindas')
                        .setStyle(1)
                        .setEmoji('1261435708560773200')
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('verMSGG')
                    .setLabel('Ver Mensagem')
                    .setStyle(1)
                    .setEmoji('1262641763193978930'),
                    new ButtonBuilder()
                    .setCustomId("redefinirBoasvindas")
                    .setLabel("Redefinir Mensagem")
                    .setStyle(2)
                    .setEmoji('1267032211455082508')
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("voltar1")
                    .setLabel("Voltar")
                    .setStyle(2)
                    .setEmoji('1265111272312016906')
                )
        ],
        ephemeral: true
    });
}

module.exports = {
    welcome
}