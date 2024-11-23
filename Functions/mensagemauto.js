const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js")
const { General, BList, Tickesettings, tickets, announce, carrinhos, lojaInfo } = require("../Database/index");
const axios = require('axios');
const { notifyStock, downloadFile, obterEmoji } = require("./definicoes")
const startTime = Date.now();

async function Reiniciarapp(client) {
    if (General.get('logsGerais') == null) return;
    if (General.get('admrole') == null) return;

    const embed = new EmbedBuilder()
        .setAuthor({ name: `Aplicação Reiniciada`, iconURL: "https://cdn.discordapp.com/emojis/1267381920333955112.webp?size=96&quality=lossless" })
        .setColor('#FF8201')
        .addFields(
            { name: "**Current Version**", value: `\`2.0.0\``, inline: true },
            { name: `**Reiniciado há**`, value: `<t:${Math.ceil(startTime / 1000)}:R>`, inline: true }
        )
        .setFooter({ text: `Vexy Type | Aplicações` })
        .setTimestamp();

    const rowSystemauto = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('kadfbhsdbfksjdf')
                .setLabel('Mensagem do Sistema')
                .setStyle(2)
                .setDisabled(true)
        );
    const rowSystem = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setURL('https://github.com/Vexytype')
                .setLabel('Github')
                .setStyle(5)
                .setEmoji('1298662377473966087'),
            new ButtonBuilder()
                .setURL('https://vexyapiv1.squareweb.app/v1/convite')
                .setLabel("Atualizações")
                .setStyle(5)
                .setEmoji('1286148925803200565'),
        );


    const channel = await client.channels.fetch(General.get('logsGerais'));
    await channel.send({ embeds: [embed], components: [rowSystem, rowSystemauto] });
}

async function Antifraude(client) {
    const guildIID = await General.get('guildID')
    if (!guildIID) return;
    const guild = await client.guilds.fetch(guildIID);
    if (!guild) return;
    const admRole = await General.get('admrole')
    if (!admRole) return;

    const systemLogsChannelId = await General.get('logsGerais');
    const acesstoken = await General.get('TokenMP');

    if (!systemLogsChannelId || !acesstoken) {
        return;
    }

    const systemLogsChannel = await client.channels.fetch(systemLogsChannelId);
    if (!systemLogsChannel) {
        console.error('Canal de logs do sistema não encontrado.');
        return;
    }

    const EMOJI = await obterEmoji();

    const embedAntiFraude = new EmbedBuilder()
        .setColor(General.get('oficecolor.main'))
        .setTitle(`Sistema Anti-Fraude`)
        .setDescription(`${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`} Fiscalização de pagamentos realizada.\ntodos os pagamentos realizados para esta loja foram verificados para analisar pedidos com suspeita de fraude.\n${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Nenhum pagamento fraudulento foi encontrado.`)
        .setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
        .setTimestamp()

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('kadfbhsdbfksjdf')
            .setLabel('Mensagem do Sistema')
            .setStyle(2)
            .setDisabled(true)
    )

    try {
        const refundResponse = await axios.get('https://api.mercadopago.com/v1/payments/search', {
            params: {
                'access_token': acesstoken,
                'status': 'refunded'
            }
        });

        const refundData = refundResponse.data.results;
        let reembolsoDetectado = false;

        if (refundData.length > 0) {
            const usuarios = carrinhos.all();

            for (const element of refundData) {
                for (const { ID: userID, data: carrinhosDoUsuario } of usuarios) {
                    for (const cartID in carrinhosDoUsuario) {
                        const carrinho = carrinhosDoUsuario[cartID];

                        if (carrinho.StatusBuy === 'approved' && carrinho.idPay === element.id && element.status === `refunded`) {
                            reembolsoDetectado = true;
                            await carrinhos.set(`${userID}.${cartID}.StatusBuy`, 'refound_force');
                            const embedReembolso = new EmbedBuilder()
                                .setColor(General.get('oficecolor.main'))
                                .setTitle(`Fraude Detectada`)
                                .setDescription(`${EMOJI.vx7 == null ? `` : `<:${EMOJI.vx7.name}:${EMOJI.vx7.id}>`} Foi detectado um pedido fraudulento, as informações do pedido estão abaixo.`)
                                .addFields(
                                    { name: `**ID do pedido**`, value: `\`${carrinho.idCart}\``, inline: true },
                                    { name: `**Valor**`, value: `\`R$ ${element.transaction_amount}\``, inline: true },
                                    { name: `**Status**`, value: `\`${element.status}\``, inline: true },
                                    { name: `**Usuário Responsavel**`, value: `<@${carrinho.USERID}>`, inline: true },
                                    { name: `**Instituição Financeira**`, value: `\`${element.point_of_interaction.transaction_data.bank_info.payer.long_name}\``, inline: true },
                                    { name: `**Reembolsado**`, value: `<t:${Math.ceil(new Date(element.date_last_updated).getTime() / 1000)}:R>`, inline: false },
                                )
                                .setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                                .setTimestamp()

                            systemLogsChannel.send({ content: `<@&${admRole}>`, embeds: [embedReembolso], components:[row] });
                            lojaInfo.substr(`rendimentos.pedidosAprovados`, 1);
                            lojaInfo.substr(`rendimentos.prodEntregues`, carrinho.quantidade);
                            lojaInfo.substr(`rendimentos.valortotal`, element.transaction_amount);
                        }
                    }
                }
            }
            if (!reembolsoDetectado) {
                systemLogsChannel.send({ embeds: [embedAntiFraude], components:[row] });
            }
        }
    } catch (error) {
        console.error('Erro ao verificar reembolsos:', error);
    }
}

module.exports = {
    Reiniciarapp,
    Antifraude
}