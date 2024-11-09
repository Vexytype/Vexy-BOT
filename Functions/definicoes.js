const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { General, BList, tickets, announce, welcomis, products, lojaInfo, EmojIs } = require("../Database/index");
const axios = require("axios");
const fs = require('fs');


async function definicoes1(client, interaction) {

    interaction.update({
        content: ``,
        embeds: [
            new EmbedBuilder()
                .setAuthor({ name: `Definir Cargos`, iconURL: "https://cdn.discordapp.com/emojis/1265528449561526343.webp?size=96&quality=lossless" })
                .setDescription(`Olá, Sr(a) **${interaction.user.username}**\n \n- **Selecione abaixo a opção deseja configurar.** \n
**Cargo de Administrador:** ${General.get(`admrole`) == null ? `\`Não definido\`` : `<@&${General.get(`admrole`)}>`}
**Cargo de Suporte:** ${General.get(`staffrole`) == null ? `\`Não definido\`` : `<@&${General.get(`staffrole`)}>`}
**Cargo de Cliente:** ${General.get(`costumeRrole`) == null ? `\`Não definido\`` : `<@&${General.get(`costumeRrole`)}>`}
**Cargo de Membro:** ${General.get(`rolemember`) == null ? `\`Não definido\`` : `<@&${General.get(`rolemember`)}>`}
                    `)
                .setColor(General.get("oficecolor.main"))
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTimestamp()
        ],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('changecargoadmin')
                        .setLabel('Cargo de Admnistrador')
                        .setStyle(1)
                        .setEmoji('1251441849130946572'),
                    new ButtonBuilder()
                        .setCustomId('changecargostaff')
                        .setLabel('Cargo de Suporte')
                        .setStyle(1)
                        .setEmoji('1241951076434055178'),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("changecargoCostumer")
                        .setLabel("Cargo Cliente")
                        .setStyle(1)
                        .setEmoji('1276564807335809156'),
                    new ButtonBuilder()
                        .setCustomId("changecargomembru")
                        .setLabel('Cargo de Membros')
                        .setStyle(1)
                        .setEmoji('1261435261653483611')
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("voltarDefinitions")
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji('1265111272312016906')
                )
        ],
        ephemeral: true
    });
}

async function definicoes2(client, interaction) {
    interaction.update({
        content: ``,
        embeds: [
            new EmbedBuilder()
                .setAuthor({ name: `Definir Canais de Logs`, iconURL: "https://cdn.discordapp.com/emojis/1265528447418105940.webp?size=96&quality=lossless" })
                .setDescription(`Olá, Sr(a) **${interaction.user.username}**\n \n- **Selecione abaixo a opção deseja configurar.** \n
**Canal de log de Tickets:** ${General.get(`logsticketChannel`) == null ? `\`Não definido\`` : `<#${General.get(`logsticketChannel`)}>`}
**Canal de logs de Entradas:** ${General.get(`logsbemvindu`) == null ? `\`Não definido\`` : `<#${General.get(`logsbemvindu`)}>`}
**Canal de logs de Saidas:** ${General.get(`logsaidas`) == null ? `\`Não definido\`` : `<#${General.get(`logsaidas`)}>`}
**Canal de logs de Bans:** ${General.get(`logsBan`) == null ? `\`Não definido\`` : `<#${General.get(`logsBan`)}>`}
**Canal de logs de Castigos:** ${General.get(`logsCastigo`) == null ? `\`Não definido\`` : `<#${General.get(`logsCastigo`)}>`}
**Canal de logs da Blacklist:** ${General.get(`logsBlacklist`) == null ? `\`Não definido\`` : `<#${General.get(`logsBlacklist`)}>`}
**Canal de logs Gerais do Sistema:** ${General.get(`logsGerais`) == null ? `\`Não definido\`` : `<#${General.get(`logsGerais`)}>`}
**Canal de logs Vendas Admin:** ${General.get(`logsVendasADM`) == null ? `\`Não definido\`` : `<#${General.get(`logsVendasADM`)}>`}
**Canal de logs Vendas Public:** ${General.get(`logsVendasPUB`) == null ? `\`Não definido\`` : `<#${General.get(`logsVendasPUB`)}>`}
**Canal de Feedbacks:** ${General.get(`VendasFeedback`) == null ? `\`Não definido\`` : `<#${General.get(`VendasFeedback`)}>`}
                    `)
                .setColor(General.get("oficecolor.main"))
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTimestamp()
        ],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("logTicketsss")
                        .setLabel('Logs de Ticket')
                        .setStyle(1)
                        .setEmoji('1267032211455082508'),
                    new ButtonBuilder()
                        .setCustomId("logsEntradass")
                        .setLabel('Logs de Entradas')
                        .setStyle(1)
                        .setEmoji('1267032211455082508'),
                    new ButtonBuilder()
                        .setCustomId("saidalogs")
                        .setLabel('Logs de Saidas')
                        .setStyle(1)
                        .setEmoji('1267032211455082508')
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("loogsBan")
                        .setLabel("Logs de Bans")
                        .setStyle(1)
                        .setEmoji('1267032211455082508'),
                    new ButtonBuilder()
                        .setCustomId("loogscastigu")
                        .setLabel("logs de Castigo")
                        .setStyle(1)
                        .setEmoji('1267032211455082508'),
                    new ButtonBuilder()
                        .setCustomId("logsBlackliist")
                        .setLabel('Logs Blacklist')
                        .setEmoji('1267032211455082508')
                        .setStyle(1)
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("logissGerais")
                        .setLabel("Logs Gerais")
                        .setStyle(1)
                        .setEmoji('1267032211455082508'),
                    new ButtonBuilder()
                        .setCustomId("logissVendaADeM")
                        .setLabel("Logs de Vendas")
                        .setStyle(1)
                        .setEmoji('1267032211455082508'),
                    new ButtonBuilder()
                        .setCustomId("logissVendaPublic")
                        .setLabel("Logs Entregas")
                        .setStyle(1)
                        .setEmoji('1267032211455082508'),
                    new ButtonBuilder()
                        .setCustomId("fidibackChannelset")
                        .setLabel("Canal de Feedbacks")
                        .setStyle(1)
                        .setEmoji('1267032211455082508'),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("voltarDefinitions")
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji('1265111272312016906')
                )
        ],
        ephemeral: true
    });
}

async function definitions(client, interaction) {
    const emojiData = await EmojIs.get(`Emojis`) || null;

    if(emojiData !== null){
        interaction.update({
            content: ``,
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `Definições Gerais`, iconURL: "https://cdn.discordapp.com/emojis/1265528445123694593.webp?size=96&quality=lossless" })
                    .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n- **Selecione abaixo a opção que deseja configurar.** \n`)
                    .setColor(General.get("oficecolor.main"))
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('config_cargos')
                            .setLabel('Gerenciar Cargos')
                            .setStyle(1)
                            .setEmoji('1271659788614373399'),
                        new ButtonBuilder()
                            .setCustomId("config_logs")
                            .setLabel("Gerenciar Logs")
                            .setStyle(1)
                            .setEmoji('1271659788614373399'),
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`configPayments`)
                            .setLabel("Pagamentos")
                            .setStyle(1)
                            .setEmoji('1273049581667745864'),
                        new ButtonBuilder()
                            .setCustomId("deleteEmojis")
                            .setLabel("Excluir Emojis")
                            .setStyle(4)
                            .setEmoji('1276716466959417444')
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("voltar1")
                            .setLabel("Voltar")
                            .setStyle(2)
                            .setEmoji('1265111272312016906')
                    ),
            ],
            ephemeral: true
        });
    } else {
        interaction.update({
            content: ``,
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `Definições Gerais`, iconURL: "https://cdn.discordapp.com/emojis/1265528445123694593.webp?size=96&quality=lossless" })
                    .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n- **Selecione abaixo a opção que deseja configurar.** \n`)
                    .setColor(General.get("oficecolor.main"))
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('config_cargos')
                            .setLabel('Gerenciar Cargos')
                            .setStyle(1)
                            .setEmoji('1271659788614373399'),
                        new ButtonBuilder()
                            .setCustomId("config_logs")
                            .setLabel("Gerenciar Logs")
                            .setStyle(1)
                            .setEmoji('1271659788614373399'),
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`configPayments`)
                            .setLabel("Pagamentos")
                            .setStyle(1)
                            .setEmoji('1273049581667745864'),
                        new ButtonBuilder()
                            .setCustomId("installEmojis")
                            .setLabel("Instalar Emojis")
                            .setStyle(2)
                            .setEmoji('1286148928835948574')
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("voltar1")
                            .setLabel("Voltar")
                            .setStyle(2)
                            .setEmoji('1265111272312016906')
                    ),
            ],
            ephemeral: true
        });
    }


}

async function configgggSales(client, interaction) {

    const embed = new EmbedBuilder()
        .setAuthor({ name: `Definições de Pagamentos`, iconURL: "https://cdn.discordapp.com/emojis/1265528455072841831.webp?size=96&quality=lossless" })
        .addFields(
            { name: `Metodo Disponivel`, value: `- \`Pix\`: Checkout Transparente Mercado Pago` }
        )
        .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n- Selecione a opção que deseja configurar.\n
**Acess Token:** ${General.get(`TokenMP`) == null ? `\`\`\`Não definido\`\`\`` : `||\`\`\`${General.get(`TokenMP`)}\`\`\`||`}
`)
        .setColor(General.get("oficecolor.main"))
        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp()

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("seTokenMP")
                .setLabel("Definir Acess Token")
                .setStyle(1)
                .setEmoji('1273106836790444147')
        )
    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("voltarDefinitions")
                .setLabel("Voltar")
                .setStyle(2)
                .setEmoji('1265111272312016906')
        )

    interaction.update({ content: ``, embeds: [embed], components: [row, row3] });
}

async function panelSales(client, interaction) {
    const EMOJI = await obterEmoji();

    const prodsS = await products.get(`proodutos`) || {};
    const rendInfo1 = await lojaInfo.get(`rendimentos.pedidosAprovados`);
    const rendInfo2 = await lojaInfo.get(`rendimentos.prodEntregues`);
    const rendInfo3 = await lojaInfo.get(`rendimentos.valortotal`);


    const embedSales = new EmbedBuilder()
        .setAuthor({ name: `Gerenciar Loja`, iconURL: "https://cdn.discordapp.com/emojis/1291805653412872235.webp?size=96&quality=lossless" })
        .addFields(
            {
                name: `${EMOJI.vx15 == null ? `` : `<:${EMOJI.vx15.name}:${EMOJI.vx15.id}>`} Produtos Existentes`, value: `\`${Object.keys(prodsS).length}\``, inline: false
            },
            {
                name: `${EMOJI.vx9 == null ? `` : `<:${EMOJI.vx9.name}:${EMOJI.vx9.id}>`} Pedidos Aprovados`, value: `\`${rendInfo1}\``, inline: false
            },
            {
                name: `${EMOJI.vx9 == null ? `` : `<:${EMOJI.vx9.name}:${EMOJI.vx9.id}>`} Produtos Entregues`, value: `\`${rendInfo2}\``, inline: false
            },
            {
                name: `${EMOJI.vx10 == null ? `` : `<:${EMOJI.vx10.name}:${EMOJI.vx10.id}>`} Total Recebido`, value: `\`R$ ${Number(rendInfo3).toFixed(2)}\``, inline: false
            },
        )
        .setColor(General.get("oficecolor.main"))
        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp();


    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`criarPProdct`)
                .setLabel('Criar Produto')
                .setEmoji('1264379774793420811')
                .setStyle(3),
            new ButtonBuilder()
                .setCustomId(`gerenciarProds`)
                .setLabel('Gerenciar Produto')
                .setEmoji('1267032211455082508')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId(`delletePProdct`)
                .setLabel('Deletar Produto')
                .setEmoji('1251441411266711573')
                .setStyle(4)
        )
    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("voltar1")
                .setLabel("Voltar")
                .setStyle(2)
                .setEmoji('1265111272312016906')
        )

    interaction.update({ content: ``, embeds: [embedSales], components: [row1, row3] });
}

async function GerenciarProduto(produtin, interaction, client) {

    let prodName = products.get(`proodutos.${produtin}.Config.name`)
    let prodDesc = products.get(`proodutos.${produtin}.Config.desc`)
    let prodIcon = products.get(`proodutos.${produtin}.Config.icon`) || ""
    let prodBanner = products.get(`proodutos.${produtin}.Config.banner`) || ""
    let prodCampos = products.get(`proodutos.${produtin}.Campos`)

    const embedSales = new EmbedBuilder()
        .setAuthor({ name: `Gerenciar Produto`, iconURL: "https://cdn.discordapp.com/emojis/1291805653412872235.webp?size=96&quality=lossless" })
        .addFields(
            {
                name: `Produto`, value: `${prodName}`, inline: false
            },
            {
                name: `Total de Campos`, value: `\`${Object.keys(prodCampos).length}\``, inline: false
            }
        )
        .setDescription(`**Descrição:** \`\`\`${prodDesc}\`\`\``)
        .setColor(General.get("oficecolor.main"))
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp();


    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`personalizarPRood_${produtin}`)
                .setLabel('Customizar Produto')
                .setEmoji('1273127418386976788')
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId(`configCampoProd_${produtin}`)
                .setLabel("Gerenciar Campos")
                .setStyle(1)
                .setEmoji('1267032211455082508')
        )
    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`addCampoProd_${produtin}`)
                .setLabel(`Adicionar Campo`)
                .setStyle(3)
                .setEmoji('1264379774793420811'),
            new ButtonBuilder()
                .setCustomId(`removeCampoProd_${produtin}`)
                .setLabel("Remover Campo")
                .setStyle(4)
                .setEmoji('1264379758469320761')
        )
    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`postarPRodd_${produtin}`)
                .setLabel("Postar Produto")
                .setStyle(1)
                .setEmoji('1263220780615991306'),
            new ButtonBuilder()
                .setCustomId(`sincronizarPRodd_${produtin}`)
                .setLabel("Atualizar Produto")
                .setStyle(2)
                .setEmoji('1263621210214760489')
        )
    const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("voltarcfgVendas")
                .setLabel("Voltar")
                .setStyle(2)
                .setEmoji('1265111272312016906')
        )

    interaction.update({ content: ``, embeds: [embedSales], components: [row1, row2, row3, row4] });
}

async function GerenciarCampoProd(produtin, CampoSelect, interaction, client) {
    const Valor = await products.get(`proodutos.${produtin}`);
    const Valor3 = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}`);
    const Valor2 = Valor.Config

    const nameProd = Valor2.name
    const descProd = Valor2.desc
    const iconProd = Valor2.icon || null
    const bannerProd = Valor2.banner || null
    const nameProdCampo = Valor3.name
    const descProdCampo = Valor3.desc
    const priceProdCampo = Valor3.price
    const EstqCampoO = Valor3.stock || [];
    const EstoqueCampoOQTY = EstqCampoO.length
    const estatisticas1 = Valor3.estatisticas.vendas
    const estatisticas2 = Valor3.estatisticas.vendidos
    const estatisticas3 = Valor3.estatisticas.rendeu

    const embed = new EmbedBuilder()
        .setAuthor({ name: `Gerenciar Campo`, iconURL: "https://cdn.discordapp.com/emojis/1291805653412872235.webp?size=96&quality=lossless" })
        .setTitle(`${nameProd}`)
        .setDescription(`- **Campo**: ${nameProdCampo}\n- **Valor**: R$ \`${Number(priceProdCampo).toFixed(2)}\`\n- **Estoque**: \`${EstoqueCampoOQTY}\`\n
        - **Estatisticas**:\n - Total de Vendas: \`${estatisticas1}\`\n - Produtos Entregues: \`${estatisticas2}\`\n - Rendeu: \`R$ ${Number(estatisticas3).toFixed(2)}\``)
        .setColor(General.get("oficecolor.main"))
        .setFooter(
            { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
        )
        .setTimestamp();

    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`EditarCampoProd_${produtin}_${CampoSelect}`)
                .setLabel('Editar Campo')
                .setEmoji('1264379809845477406')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId(`cupomCampoProd_${produtin}_${CampoSelect}`)
                .setLabel("Cupons")
                .setStyle(2)
                .setEmoji('1251441496104636496'),
        )
    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`EstoqueCampo_${produtin}_${CampoSelect}`)
                .setLabel(`Estoque`)
                .setStyle(1)
                .setEmoji('1290144734529982474'),
            new ButtonBuilder()
                .setCustomId(`ClearStockCampo_${produtin}_${CampoSelect}`)
                .setLabel("Limpar Estoque")
                .setStyle(4)
                .setEmoji('1276716466959417444'),
        )
    const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`voltarcfgProds_${produtin}`)
                .setLabel("Voltar")
                .setStyle(2)
                .setEmoji('1265111272312016906')
        )

    interaction.update({ content: ``, embeds: [embed], components: [row1, row2, row4], ephemeral: true })
}

async function notifyStock(quanti, produtin, CampoSelect, interaction) {
    const EMOJI = await obterEmoji();
    const prod = await products.get(`proodutos.${produtin}`);
    const prod2 = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}`);
    const Valor2 = prod.messageid
    const primeiraChave = Object.keys(Valor2)[0];
    const Valor3 = Valor2[primeiraChave];
    const channel = interaction.client.channels.cache.get(`${Valor3.channelid}`);

    let count = 0;
    for (const a of prod2.espera) {
        const user = interaction.guild.members.cache.get(a);
        if (user) {
            const userName = user.user.username;
            try {
                await user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: `Notificações`, iconURL: "https://cdn.discordapp.com/emojis/1268319758013436046.webp?size=96&quality=lossless" })
                            .setTitle(`Olá ${userName}`)
                            .setDescription(`Notamos que estava aguardando estoque do produto **${prod2.name}**.\nO estoque do produto **${prod2.name}**, foi abastecido com \`${quanti}\` novos itens.\n`)
                            .setColor(General.get('oficecolor.main'))
                            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setURL(`https://discord.com/channels/${interaction.guild.id}/${Valor3.channelid}`)
                                .setLabel('Comprar')
                                .setEmoji('1252477800145883159')
                                .setStyle(5)
                        )
                    ]
                });
                count++;
            } catch (error) {
                console.log(`Erro ao notificar ${userName}:`, error);
            }
        }
    }
    await products.set(`proodutos.${produtin}.Campos.${CampoSelect}.espera`, []);

    if (count > 0) {
        interaction.followUp({
            content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} \`${count}\` usuário(s) foram notificados sobre o reabastecimento de estoque.`,
            ephemeral: true
        });
    }

}

async function downloadFile(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary').toString('utf-8');
    } catch (error) {
        console.error('Erro ao baixar o arquivo:', error.message);
        throw error;
    }
}

async function obterEmoji() {
    const vx1 = await EmojIs.get(`Emojis.vx1`) || null;
    const vx2 = await EmojIs.get(`Emojis.vx2`) || null;
    const vx3 = await EmojIs.get(`Emojis.vx3`) || null;
    const vx4 = await EmojIs.get(`Emojis.vx4`) || null;
    const vx5 = await EmojIs.get(`Emojis.vx5`) || null;
    const vx6 = await EmojIs.get(`Emojis.vx6`) || null;
    const vx7 = await EmojIs.get(`Emojis.vx7`) || null;
    const vx8 = await EmojIs.get(`Emojis.vx8`) || null;
    const vx9 = await EmojIs.get(`Emojis.vx9`) || null;
    const vx10 = await EmojIs.get(`Emojis.vx10`) || null;
    const vx11 = await EmojIs.get(`Emojis.vx11`) || null;
    const vx12 = await EmojIs.get(`Emojis.vx12`) || null;
    const vx13 = await EmojIs.get(`Emojis.vx13`) || null;
    const vx14 = await EmojIs.get(`Emojis.vx14`) || null;
    const vx15 = await EmojIs.get(`Emojis.vx15`) || null;
    const vx16 = await EmojIs.get(`Emojis.vx16`) || null;
    const vx17 = await EmojIs.get(`Emojis.vx17`) || null;

    return { vx1, vx2, vx3, vx4, vx5, vx6, vx7, vx8, vx9, vx10, vx11, vx12, vx13, vx14, vx15, vx16, vx17 }
}

async function configCoupons(produtin, CampoSelect, interaction, client) {3

    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`criarCoupons_${produtin}_${CampoSelect}`)
                .setLabel('Criar Cupom')
                .setEmoji('1264379774793420811')
                .setStyle(3),
            new ButtonBuilder()
                .setCustomId(`deleteCoupons_${produtin}_${CampoSelect}`)
                .setLabel("Excluir Cupom")
                .setStyle(2)
                .setEmoji('1276716466959417444'),
        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`VoltarCampoConfig_${produtin}_${CampoSelect}`)
                .setLabel('Voltar')
                .setEmoji(`1265111710063132732`)
                .setStyle(2)
        )

        interaction.update({content:`Selecione a opção que deseja`,embeds:[], components:[row1, row2], ephemeral:true});
}

async function infoAPP(client, interaction) {

    interaction.update({
        content: ``,
        embeds: [
            new EmbedBuilder()
                .setAuthor({ name: `Informações da Aplicação`, iconURL: "https://cdn.discordapp.com/emojis/1267381920333955112.webp?size=96&quality=lossless" })
                .setDescription(`
                    - Os botões abaixo contém o link do diretorio do Github com o arquivo do bot e o convite do servidor oficial do bot, onde receberemos sugestões de melhorias e iremos anunciar atualizações futuras do bot.
                    \n- Gostou do bot? então nos de uma força para continuar, dê uma estrela no diretorio do github e acesse o servidor oficial`)
                .setColor(General.get("oficecolor.main"))
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTimestamp()
        ],
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setURL('https://github.com/Vexytype')
                        .setLabel('Github')
                        .setStyle(5)
                        .setEmoji('1298662377473966087'),
                    new ButtonBuilder()
                        .setURL('https://vexyapiv1.squareweb.app/v1/convite')
                        .setLabel("Vexy Community")
                        .setStyle(5)
                        .setEmoji('1286148925803200565'),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("voltar1")
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji('1265111272312016906')
                ),
        ],
        ephemeral: true
    });
}

function loadEmojiData() {
    try {
        const data = fs.readFileSync('Database/emojis.json', 'utf-8');
        return JSON.parse(data).Emojis;
    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
        return null;
    }
}

async function deleteVexyEmojis(client) {
    const guildIID = await General.get('guildID');
    if (!guildIID) return;

    const guild = await client.guilds.fetch(guildIID);
    if (!guild) return;

    const emojiData = loadEmojiData();
    if (!emojiData) {
        return console.error('Erro: não foi possível carregar os dados dos emojis.');
    }

    
    try {
        const emojis = await guild.emojis.fetch();

        const deletePromises = Object.entries(emojiData).map(async ([key, { id, name }]) => {
            const emoji = emojis.get(id);
            if (emoji) {
                await emoji.delete();
                EmojIs.delete(`Emojis.${name}`);
            } else {
                console.log(`Emoji não encontrado no servidor: ${name} (ID: ${id})`);
                EmojIs.delete(`Emojis.${name}`);
            }
        });

        await Promise.all(deletePromises);
        const EmojisRemain = await EmojIs.get(`Emojis`);
        if(Object.keys(EmojisRemain).length === 0) return EmojIs.delete('Emojis')
    } catch (error) {
        console.error('Erro ao deletar os emojis:', error);
    }
}

module.exports = {
    definitions,
    definicoes1,
    definicoes2,
    configgggSales,
    panelSales,
    GerenciarProduto,
    GerenciarCampoProd,
    notifyStock,
    downloadFile,
    obterEmoji,
    configCoupons,
    infoAPP,
    deleteVexyEmojis
}