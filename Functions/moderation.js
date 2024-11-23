const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { General, BList, Tickesettings } = require("../Database/index");

async function moderation(client, interaction) {
    const protectSystem = await General.get(`SystemProtect`);

    interaction.update({
        embeds: [
            new EmbedBuilder()
                .setAuthor({ name: `Sistema de Moderação`, iconURL: "https://cdn.discordapp.com/emojis/1265528442133418077.png?size=2048" })
                .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n- **Selecione abaixo a opção que deseja configurar.** \n
                    **Cargo Automático:** ${General.get(`automod.autorole`) == null ? `\`Não definido\`` : `<@&${General.get(`automod.autorole`)}>`}\n
                    **Sistema de Segurança:** Inclui proteção para anti-raid no servidor, identificando movimentações suspeitas, e agindo de maneira eficiente com um Captcha para cada usuario.
                    `)
                .setColor(General.get("oficecolor.main"))
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTimestamp()
        ],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('autoModapp')
                        .setLabel('Automod')
                        .setStyle(1)
                        .setEmoji('1262641708777213974'),
                    new ButtonBuilder()
                        .setCustomId('protecaoSystem')
                        .setLabel(protectSystem == false ? 'Ligar Sistema de Segurança' : 'Desligar Sistema de Segurança')
                        .setStyle(protectSystem == false ? 3 : 4)
                        .setEmoji('1262641839383515157')
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('cargoaoEntrar')
                        .setLabel("Cargo Automático")
                        .setStyle(1)
                        .setEmoji('1262641756915109989'),
                    new ButtonBuilder()
                        .setCustomId("blackLList")
                        .setLabel('Blacklist')
                        .setStyle(2)
                        .setEmoji('1261440228673978368')
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

async function automoderation(client, interaction) {

    interaction.update({
        embeds: [
            new EmbedBuilder()
                .setAuthor({ name: `Auto-Moderação`, iconURL: "https://cdn.discordapp.com/emojis/1265528442133418077.png?size=2048" })
                .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n- **Selecione abaixo a opção que deseja configurar.**
                    \n- **Mensagens Proibidas**\n - **Palavras Leves:** Receberá Timeout pelo tempo que você determinou.\n - **Palavras Ofensivas:** O usuário será expulso.
                    `)
                .setColor(General.get("oficecolor.main"))
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTimestamp()
        ],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('nomisprohibited')
                        .setLabel('Nomes Proibidos')
                        .setStyle(1)
                        .setEmoji('1261435257266372668'),
                    new ButtonBuilder()
                        .setCustomId('proibidoStattus')
                        .setLabel("Status Proibidos")
                        .setStyle(1)
                        .setEmoji('1261435257266372668')
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("MsssgggBloq")
                        .setLabel("Mensagens Proibidas")
                        .setStyle(1)
                        .setEmoji('1262641752314089513'),
                    new ButtonBuilder()
                        .setCustomId("diassminin")
                        .setLabel('Dias Minimos')
                        .setStyle(1)
                        .setEmoji('1261453399090794557')
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
    moderation,
    automoderation
}