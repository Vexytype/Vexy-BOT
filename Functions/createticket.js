const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const { tickets, General } = require("../Database/index")

function CreateMessageTicket(interaction, channel, client){
    const ggg = tickets.get(`tickets.funcoes`)
    const aparencia = tickets.get(`tickets.aparencia`)

    const arrayDeValores = Object.values(ggg)
    const button = new ButtonBuilder()
        .setCustomId(`AbrirTicket_${arrayDeValores[0].nome}`)
        .setLabel(arrayDeValores[0].nome)
        .setStyle(2)

    if (arrayDeValores[0].emoji !== undefined) {
        button.setEmoji(arrayDeValores[0].emoji)
    } else {
        button.setEmoji('1251441496104636496')
    }

    const buttonrow = new ActionRowBuilder().addComponents(button)

    const selectMenuBuilder = new StringSelectMenuBuilder()
        .setCustomId('abrirticket')
        .setPlaceholder('Clique aqui para ver as opções');


    for (const element in ggg) {
        const item = ggg[element];

        const option = {
            label: `${item.nome}`,
            description: `${item.descricao == undefined ? item.predescricao : item.descricao}`,
            value: `${element}`,
            emoji: item.emoji == undefined ? '1251441496104636496' : item.emoji
        }

        selectMenuBuilder.addOptions(option);
    }

    const style2row = new ActionRowBuilder().addComponents(selectMenuBuilder);


    const embed = new EmbedBuilder()
        .setTitle(`${aparencia.title}`)
        .setDescription(`${aparencia.description}`)
        .setFooter(
            { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
        )
        .setTimestamp()

    if (aparencia.color !== undefined) {
        embed.setColor(`${aparencia.color}`)
    } else {
        embed.setColor(General.get("oficecolor.main"))
    }

    if (aparencia.banner !== undefined) {
        embed.setImage(`${aparencia.banner}`)
    }

    const channel2 = client.channels.cache.get(channel)

    if (Object.keys(ggg).length == 1) {
        channel2.send({ components: [buttonrow], embeds: [embed] }).then(msg => {
            tickets.push(`tickets.messageid`, { msgid: msg.id, channelid: msg.channel.id, guildid: msg.guild.id })
        }).catch((error) => {
            console.log(error)
        })
    } else {
        channel2.send({ components: [style2row], embeds: [embed] }).then(msg => {
            tickets.push(`tickets.messageid`, { msgid: msg.id, channelid: msg.channel.id, guildid: msg.guild.id })
        }).catch((error) => {
            console.log(error)
        })
    }
}

async function Checkarmensagensticket(client) {
    const ggg = tickets.get(`tickets.funcoes`)

    const aparencia = tickets.get(`tickets.aparencia`)
    const item = tickets.get(`tickets.messageid`)
    const guild = client.guilds.cache.get(item[0].guildid)

    const arrayDeValores = Object.values(ggg)
    const button = new ButtonBuilder()
        .setCustomId(`AbrirTicket_${arrayDeValores[0].nome}`)
        .setLabel(arrayDeValores[0].nome)
        .setStyle(2)
        

    if (arrayDeValores[0].emoji !== undefined) {
        button.setEmoji(arrayDeValores[0].emoji)
    }

    const buttonrow = new ActionRowBuilder().addComponents(button)

    const selectMenuBuilder = new StringSelectMenuBuilder()
        .setCustomId('abrirticket')
        .setPlaceholder('Clique aqui para ver as opções');


    for (const element in ggg) {
        const item = ggg[element];

        const option = {
            label: `${item.nome}`,
            description: `${item.predescricao == undefined ? item.predescricao : item.predescricao}`,
            value: `${element}`,
            emoji: item.emoji == undefined ? '1251441496104636496' : item.emoji
        }

        selectMenuBuilder.addOptions(option);
    }

    const style2row = new ActionRowBuilder().addComponents(selectMenuBuilder);

    const embed = new EmbedBuilder()
        .setTitle(`${aparencia.title}`)
        .setDescription(`${aparencia.description}`)
        .setFooter(
            { text: guild.name, iconURL: guild.iconURL({ dynamic: true }) }
        )
        .setTimestamp()

    if (aparencia.color !== undefined) {
        embed.setColor(`${aparencia.color}`)
    } else {
        embed.setColor(General.get("oficecolor.main"))
    }

    if (aparencia.banner !== undefined) {
        embed.setImage(`${aparencia.banner}`)
    }

    for (const iterator in item) {
        const element = item[iterator];
        const channel = await client.channels.cache.get(element.channelid)
        if(channel) continue;
        const msg = await channel.messages.fetch(element.msgid)
        if(msg) continue;

        try {
            if (Object.keys(ggg).length == 1) {
                msg.edit({ components: [buttonrow], embeds: [embed] })
            } else {
                msg.edit({ components: [style2row], embeds: [embed] })
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = {
    CreateMessageTicket,
    Checkarmensagensticket
}