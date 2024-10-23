const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js")
const { General, BList, Tickesettings, tickets, announce } = require("../Database/index");

async function anunciar(client, interaction){

    const embed = new EmbedBuilder()
    .setAuthor({ name:`Painel de Anuncios`, iconURL: "https://cdn.discordapp.com/emojis/1268319758013436046.webp?size=96&quality=lossless" })
    .setColor(General.get("oficecolor.main"))
    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})
    .setTimestamp()

    if (announce.get(`anunciar.aparencia.title`) !== null) {
        embed.setTitle(announce.get(`anunciar.aparencia.title`))
    }
    if (announce.get(`anunciar.aparencia.description`) !== null) {
        embed.setDescription(announce.get(`anunciar.aparencia.description`))
    }
    if (announce.get(`anunciar.aparencia.color`) !== null) {
        embed.setColor(announce.get(`anunciar.aparencia.color`))
    }
    if (announce.get(`anunciar.aparencia.banner`) !== null) {
        embed.setImage(announce.get(`anunciar.aparencia.banner`))
    }
    if (announce.get(`anunciar.aparencia.icon`) !== null) {
        embed.setThumbnail(announce.get(`anunciar.aparencia.icon`))
    }
    const announceMSG = announce.get(`anunciar.mensagem`) == null ? `` : `${announce.get(`anunciar.mensagem`)}`

    const row1 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("mensagemAnuncio")
            .setLabel('Personalizar Mensagem')
            .setEmoji(`1264379809845477406`)
            .setStyle(1),
        new ButtonBuilder()
            .setCustomId("limparMensagemAnuncio")
            .setLabel('Redefinir Mensagem')
            .setEmoji(`1267032211455082508`)
            .setStyle(2)
    )
const row2 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("aparenciaAnuncio")
            .setLabel('Personalizar Aparencia')
            .setEmoji(`1268061007436320828`)
            .setStyle(1),
        new ButtonBuilder()
            .setCustomId("limparAparenciaAnuncio")
            .setLabel("Redefinir Aparencia")
            .setStyle(2)
            .setEmoji('1267032211455082508')
    )
    const row3 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("enviarAnuncio")
            .setLabel('Anunciar')
            .setEmoji(`1263220780615991306`)
            .setStyle(3)
    )

    if (interaction.message == undefined) {
        interaction.reply({ content: `${announceMSG}`, components: [row1, row2, row3], embeds: [embed], ephemeral: true })
      } else {
        interaction.update({ content: `${announceMSG}`, components: [row1, row2, row3], embeds: [embed], ephemeral: true })
      }

}

async function createannounce(interaction, channel, client){
    const channel2 = client.channels.cache.get(channel)
    const aparencia = announce.get(`anunciar.aparencia`)


    const embed = new EmbedBuilder()
        .setTitle(`${aparencia.title}`)
        .setDescription(`${aparencia.description}`)
        .setFooter(
            { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
        )
        .setTimestamp()

        if (aparencia.color !== undefined) {
            embed.setColor(announce.get(`anunciar.aparencia.color`))
        } else {
            embed.setColor(General.get("oficecolor.main"))
        }
        if (aparencia.banner !== undefined) {
            embed.setImage(announce.get(`anunciar.aparencia.banner`))
        }
        if (aparencia.icon !== undefined) {
            embed.setThumbnail(announce.get(`anunciar.aparencia.icon`))
        }

    channel2.send({ embeds: [embed] })
}

module.exports = {
    anunciar,
    createannounce
}