const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { General, BList, Tickesettings } = require("../Database/index");

async function BBlackList(client, interaction) {
    interaction.update({
        content:``,
        embeds: [
            new EmbedBuilder()
                .setAuthor({ name: `Gerenciamento da Blacklist`, iconURL: "https://cdn.discordapp.com/emojis/1265531971962929172.png?size=2048" })
                .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n- **Selecione abaixo a opção que deseja!**`)
                .setColor(General.get("oficecolor.main"))
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTimestamp()
        ],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('addblacklist')
                        .setLabel('Adicionar Usuário')
                        .setStyle(3)
                        .setEmoji('1264379774793420811'),
                    new ButtonBuilder()
                        .setCustomId("removeblacklist")
                        .setLabel("Remover Usuário")
                        .setStyle(4)
                        .setEmoji('1264379758469320761')
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("voltarmoderation")
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji('1265111272312016906')
                )
        ],
        ephemeral: true
    });
}

module.exports = {
    BBlackList
}