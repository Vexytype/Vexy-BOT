const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { General } = require("../Database/index");

async function personalizaar(client, interaction) {
    interaction.update({
        content:``,
        embeds: [
            new EmbedBuilder()
                .setAuthor({ name: `Painel de Personalização`, iconURL: 'https://cdn.discordapp.com/emojis/1265111274132344883.webp?size=96&quality=lossless' })
                .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n **Personalize sua aplicação atráves das opções abaixo.** \n\n`)
                .setColor(General.get("oficecolor.main"))
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                .setTimestamp()
        ],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('setnameapp')
                        .setLabel('Nome')
                        .setStyle(1)
                        .setEmoji('1251441839404220417'),
                    new ButtonBuilder()
                        .setCustomId("setstatusapp")
                        .setLabel('Atividade')
                        .setStyle(1)
                        .setEmoji('1251441839404220417'),
                    new ButtonBuilder()
                        .setCustomId("setDeescapp")
                        .setLabel('Descrição')
                        .setStyle(1)
                        .setEmoji('1251441839404220417'),
                ),
                new ActionRowBuilder()
                .addComponents(
                new ButtonBuilder()
                    .setCustomId("setbannerapp")
                    .setLabel('Banner')
                    .setStyle(1)
                    .setEmoji('1268061007436320828'),
                new ButtonBuilder()
                    .setCustomId("setavatarapp")
                    .setLabel('Avatar')
                    .setStyle(1)
                    .setEmoji('1268061007436320828'),
                new ButtonBuilder()
                    .setCustomId("setcolormain")
                    .setLabel("Cor Principal")
                    .setStyle(1)
                    .setEmoji('1263226754739343531')
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
    personalizaar
}