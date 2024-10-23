const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js")
const { General, BList, Tickesettings, tickets } = require("../Database/index");
const { SquareCloudAPI } = require('@squarecloud/api')

async function extrasFunction(client, interaction) {
    interaction.update({
        content:``,
        embeds: [
            new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: "https://cdn.discordapp.com/emojis/1265111276237881454.webp?size=96&quality=lossless" })
                .setTitle(`**Funções Extras**`)
                .setDescription(`- Selecione oque deseja utilizar através das opções abaixo.`)
                .setColor(General.get("oficecolor.main"))
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                .setTimestamp()
        ],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('checkLinkMensal')
                        .setLabel('Checkar Links Nitro')
                        .setStyle(1)
                        .setEmoji('1276927587083358321'),
                    new ButtonBuilder()
                        .setCustomId('controlarBothost')
                        .setLabel('Controle Geral')
                        .setStyle(1)
                        .setEmoji('1286148925803200565'),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('voltar1')
                        .setLabel('Volta')
                        .setStyle(2)
                        .setEmoji('1265111710063132732')
                )
        ],
        ephemeral: true
    });
}

async function gerenciarAPP(appV, interaction, client) {
    const userID = interaction.user.id
    const api1 = new SquareCloudAPI(General.get(`APIsquare`));
    const applicationID = await General.get(`idBotSquare`);
    const applicatiON = await api1.applications.get(applicationID);

    const status = await applicatiON.getStatus();

    const embed = new EmbedBuilder()
        .setAuthor({ name: `Status em Tempo Real`, iconURL: "https://cdn.discordapp.com/emojis/1240432062528225410.webp?size=96&quality=lossless" })
        .addFields(
            {
                name: "<:vt6:1286148932136730685> | Cpu",
                value: `\`${status.usage.cpu}\``,
                inline: false
            },
            {
                name: "<:db:1262641758576050317> | Ram",
                value: `\`${status.usage.ram}\``,
                inline: false
            },
            {
                name: "<:vt7:1286148934812565576>  | SSD",
                value: `\`${status.usage.storage}\``,
                inline: false
            },
            {
                name: "<:vt8:1286150111134613504> | Network",
                value: `\`${status.usage.network.now}\``,
                inline: false
            },
            {
                name: "<:vt4:1286148928835948574> | Requests",
                value: `\`${status.requests}\``,
                inline: false
            },
            {
                name: `${status.status === "running" ? "<:vt6:1286148932136730685> | Status" : "<:vt6:1286148932136730685> | Status"}`,
                value: `${status.status === "running" ? "\`Em execução\`" : "\`Desligado\`"}`,
                inline: false
            },
            {
                name: "<:eutambmtenho30:1264379813049663489> | Uptime",
                value: `${status.uptimeTimestamp === undefined ? "Aplicação Desligada" : `<t:${Math.floor(status.uptimeTimestamp / 1000)}:R>`}`,
                inline: true
            }
        )
        .setColor(General.get('oficecolor.main') || '#FF8201')
        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
        .setTimestamp()

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`onOFFbot_${appV}`)
            .setLabel(`${onOFF === true ? "Desligar Aplicação" : "Ligar Aplicação"}`)
            .setStyle(`${onOFF === true ? 4 : 3}`)
            .setEmoji('1262641839383515157'),
        new ButtonBuilder()
            .setCustomId(`reiniciarapp_${appV}`)
            .setLabel(`Reiniciar Aplicação`)
            .setStyle(2)
            .setEmoji('1262641711834861599')
    )
    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`LLogsapp_${appV}`)
            .setLabel(`Logs da Aplicação`)
            .setStyle(1)
            .setEmoji('1276927585544044598'),
        new ButtonBuilder()
            .setCustomId(`attChangeAPp${appV}`)
            .setLabel(`Instalar Atualizações`)
            .setStyle(1)
            .setDisabled(true)
            .setEmoji('1286148928835948574'),
        new ButtonBuilder()
            .setCustomId(`renovarAPP${appV}`)
            .setLabel(`Renovar Plano`)
            .setStyle(3)
            .setEmoji('1276564807335809156'),
    )
    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`attStatsAPP_${appV}`)
            .setLabel(`Atualizar Status`)
            .setStyle(2)
            .setEmoji('1263621210214760489'),
        new ButtonBuilder()
            .setCustomId(`DevOpt_${appV}`)
            .setLabel(`Developers`)
            .setStyle(2)
            .setEmoji('1286148925803200565')
    )
    const row4 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`voltarAPPs_${appV}`)
            .setLabel(`Voltar`)
            .setStyle(2)
            .setEmoji('1265111710063132732')
    )

    await interaction.update({ embeds: [embed], components: [row1, row2, row3, row4] })

}

module.exports = {
    extrasFunction
}