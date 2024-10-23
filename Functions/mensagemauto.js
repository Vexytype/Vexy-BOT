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

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setURL('https://discord.com/channels/1241439060992589925/1241439061424734265')
                .setLabel('Updates')
                .setStyle(5),
            new ButtonBuilder()
                .setURL('https://discord.gg/dKtPK6Ed')
                .setLabel('Mano da o reconhecimento pro @rAyn')
                .setEmoji('1265035825419386911')
                .setStyle(5)
        );
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