const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js")
const { General, BList, Tickesettings, tickets, announce } = require("../Database/index");
const startTime = Date.now();

async function Reiniciarapp(client){
    if (General.get('logsGerais') == null) return;
    if (General.get('admrole') == null) return;

    const embed = new EmbedBuilder()
    .setAuthor({name:`Aplicação Reiniciada`, iconURL:"https://cdn.discordapp.com/emojis/1267381920333955112.webp?size=96&quality=lossless"})
        .setColor('#FF8201')
        .addFields(
            { name: "**Current Version**", value: `\`2.0.0\``, inline: true },
            { name: `**Reiniciado há**`, value: `<t:${Math.ceil(startTime / 1000)}:R>`, inline: true }
        )
        .setFooter({text:`Vexy Type | Aplicações`})
        .setTimestamp();

        const rowSystemauto = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('kadfbhsdbfksjdf')
                .setLabel('Mensagem do Sistema')
                .setStyle(2)
                .setDisabled(true)
        );

    const admROle = General.get('admrole')

    const channel = await client.channels.fetch(General.get('logsGerais'));
    await channel.send({content:`<@&${admROle}>`, embeds: [embed], components:[rowSystemauto]});
}


module.exports = {
    Reiniciarapp
}