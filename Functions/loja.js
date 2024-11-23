const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, AttachmentBuilder, StringSelectMenuBuilder } = require("discord.js");
const { General, BList, tickets, announce, welcomis, products, carrinhos, lojaInfo } = require("../Database/index");
const { notifyStock, downloadFile, obterEmoji } = require("./definicoes")
const Discord = require("discord.js")
const { default: MercadoPagoConfig, Payment, Preference } = require("mercadopago");
const acesstoken = General.get('TokenMP')
const axios = require('axios');
const fs = require('fs');
const moment1 = require('moment-timezone');

async function generatePayment(price, user, product) {
  
    const Clientes = new MercadoPagoConfig({ accessToken: acesstoken });
    const payments = new Payment(Clientes);

    const min1 = moment1().tz("America/Argentina/Buenos_Aires").add(Number(10), 'minutes').toISOString();

    const payment_data = {
        transaction_amount: Number(price),
        description: `Comprador: ${user}\nProduto: ${product}`,
        payment_method_id: 'pix',
        payer: {
            email: `Vexy@gmail.com`,
            first_name: 'Vexy',
            last_name: 'Type',
            identification: {
                type: 'CPF',
                number: '07944777984'
            },
            address: {
                zip_code: '06233200',
                street_name: 'Av. das Nações Unidas',
                street_number: '3003',
                neighborhood: 'Bonfim',
                city: 'Osasco',
                federal_unit: 'SP'
            }
        },
        date_of_expiration: min1
    };

    const pay = await payments.create({ body: payment_data });
    return pay;
}

async function verifyPayment(id) {
    try {
        const response = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
            headers: {
                'Authorization': `Bearer ${acesstoken}`
            }
        });
        return response.data;

    } catch (error) {
        return false;
    }
}

async function refund(id) {
    try {

        await axios.post(`https://api.mercadopago.com/v1/payments/${id}/refunds`, {}, {
            headers: {
                Authorization: `Bearer ${acesstoken}`
            }
        });

    } catch (error) {
        console.log(error)
    }

}

async function estoqueCampos(CampoSelect, produtin, interaction, client) {

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`addestoqueLine_${produtin}_${CampoSelect}`)
                .setLabel('Estoque por linha')
                .setEmoji(`1264379774793420811`)
                .setStyle(3),

            new ButtonBuilder()
                .setCustomId(`estoqueArquivo_${produtin}_${CampoSelect}`)
                .setLabel('Estoque em arquivo')
                .setEmoji(`1276927584214716538`)
                .setStyle(1),
        )

    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`estoquefantasma_${produtin}_${CampoSelect}`)
                .setLabel('Estoque fantasma')
                .setEmoji(`1178347870747906131`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId(`downloadStock_${produtin}_${CampoSelect}`)
                .setLabel('Backup Estoque')
                .setEmoji(`1286148928835948574`)
                .setStyle(2),
        )

    const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`VoltarCampoConfig_${produtin}_${CampoSelect}`)
                .setLabel('Voltar')
                .setEmoji(`1265111710063132732`)
                .setStyle(2)
        )

    await interaction.update({ embeds: [], content: `Selecione o método`, components: [row2, row3, row4], ephemeral: true });
}

async function CreateSale(channel, produtin, interaction, client) {
    const Valor = products.get(`proodutos.${produtin}`)
    const allSelectMenus = [];
    const Valor2 = products.get(`proodutos.${produtin}.Campos`)
    const EMOJI = await obterEmoji();

    const msgID = await products.get(`proodutos.${produtin}.messageid`) || null;

    const CampoQn = Object.keys(Valor2).length
    const CampoQnty = Number(CampoQn)
    let nameProd = Valor.Config.name
    let descProd = Valor.Config.desc
    let bannerProd = Valor.Config.banner || null;
    let iconProd = Valor.Config.icon || null;

    const channel2 = client.channels.cache.get(channel)
    if (!channel2) {
        console.error("Canal não encontrado ou bot não tem acesso ao canal.");
        return;
    }
    if (CampoQnty === 0) { return interaction.editReply({ content: `O produto não possui campos para vendas.`, ephemeral: true }) };

    if (CampoQnty == 1) {
        const primeiraChave = Object.keys(Valor2)[0];
        const CampoSelect = Valor2[primeiraChave];
        let nameCampo = CampoSelect.name
        let descCampo = CampoSelect.desc
        let priceCampo = CampoSelect.price
        let estoqueProd = CampoSelect.stock || [];
        let estoqueCount = estoqueProd.length

        const embed = new EmbedBuilder()
            .setTitle(`${nameProd}`)
            .setDescription(`${descProd}`)
            .addFields(
                {
                    name: `${EMOJI.vx12 == null ? `` : `<a:${EMOJI.vx12.name}:${EMOJI.vx12.id}>`}Produto`, value: `${nameCampo}`, inline: false
                },
                {
                    name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`}Valor`, value: `\`R$ ${Number(priceCampo).toFixed(2)}\``, inline: true
                },
                {
                    name: `${EMOJI.vx9 == null ? `` : `<:${EMOJI.vx9.name}:${EMOJI.vx9.id}>`}Estoque`, value: `\`${estoqueCount}\``, inline: true
                },
            )
            .setFooter(
                { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
            )

        if (bannerProd !== null) {
            embed.setImage(`${bannerProd}`)
        }
        if (iconProd !== null) {
            embed.setThumbnail(`${iconProd}`)
        }
        if (General.get("oficecolor.main") !== null) {
            embed.setColor(General.get("oficecolor.main"))
        } else {
            embed.setColor('#FF8201')
        }
        const button = new ButtonBuilder()
            .setCustomId(`AdquirirProd_${produtin}`)
            .setLabel(`Comprar`)
            .setStyle(3)
            .setEmoji('1252477800145883159')


        const buttonrow = new ActionRowBuilder().addComponents(button)

        if (msgID !== null) {
            try {
                const zack = msgID[0]
                const channelCheck = await client.channels.cache.get(zack.channelid)
                const msg = await channelCheck.messages.fetch(zack.msgid)
                await msg.delete();
                products.delete(`proodutos.${produtin}.messageid`)
            } catch (error) {
                products.delete(`proodutos.${produtin}.messageid`)
            }
        }

        channel2.send({ components: [buttonrow], embeds: [embed] }).then(msg => {
            products.push(`proodutos.${produtin}.messageid`, { msgid: msg.id, channelid: msg.channel.id, guildid: msg.guild.id });

            const button13 = new ButtonBuilder()
                .setURL(`${msg.url}`)
                .setLabel(`Ir até Anuncio`)
                .setStyle(5)
                .setEmoji('1252477800145883159')

            const row13 = new ActionRowBuilder().addComponents(button13);
            interaction.editReply({ content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Anuncio criado com sucesso!`, components: [row13], ephemeral: true });
        }).catch(err => {
            console.error("Erro ao enviar mensagem:", err);
        });
    } else {

        let optionsCount = 0;
        let currentSelectMenuBuilder;
        const menuIndex = Math.floor(optionsCount / 25);

        for (const produto in Valor2) {
            const config = Valor2[produto];
            const nomeProduto = config.name || "Nome não definido";
            let estoqueCampoo0 = config.stock || [];
            let estoqueCount = estoqueCampoo0.length
            let priceCampo = config.price


            const option = {
                label: nomeProduto,
                description: `Valor: R$ ${priceCampo} - Estoque: ${estoqueCount}`,
                value: produto,
                emoji: '1273666043826671638',
            };

            if (optionsCount % 25 === 0) {
                if (currentSelectMenuBuilder) {
                    allSelectMenus.push(currentSelectMenuBuilder);
                }

                currentSelectMenuBuilder = new StringSelectMenuBuilder()
                    .setCustomId(`AdquirirProdSelect_${produtin}_${menuIndex + 1}`)
                    .setPlaceholder(`Clique aqui para selecionar`);
            }

            currentSelectMenuBuilder.addOptions(option);
            optionsCount++;
        }

        if (currentSelectMenuBuilder) {
            allSelectMenus.push(currentSelectMenuBuilder);
        }

        const rows = allSelectMenus.map((selectMenuBuilder) => {
            return new ActionRowBuilder().addComponents(selectMenuBuilder);
        });

        const embed = new EmbedBuilder()
            .setTitle(`${nameProd}`)
            .setDescription(`${descProd}`)
            .setFooter(
                { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
            )

        if (bannerProd !== null) {
            embed.setImage(`${bannerProd}`)
        }
        if (iconProd !== null) {
            embed.setThumbnail(`${iconProd}`)
        }
        if (General.get("oficecolor.main") !== null) {
            embed.setColor(General.get("oficecolor.main"))
        } else {
            embed.setColor('#FF8201')
        }

        if (msgID !== null) {
            try {
                const zack = msgID[0]
                const channelCheck = await client.channels.cache.get(zack.channelid)
                const msg = await channelCheck.messages.fetch(zack.msgid)
                await msg.delete();
                products.delete(`proodutos.${produtin}.messageid`)
            } catch (error) {
                products.delete(`proodutos.${produtin}.messageid`)
            }
        }

        channel2.send({ components: [...rows], embeds: [embed] }).then(msg => {
            products.push(`proodutos.${produtin}.messageid`, { msgid: msg.id, channelid: msg.channel.id, guildid: msg.guild.id });

            const button13 = new ButtonBuilder()
                .setURL(`${msg.url}`)
                .setLabel(`Ir até Anuncio`)
                .setStyle(5)
                .setEmoji('1252477800145883159')

            const row13 = new ActionRowBuilder().addComponents(button13);
            interaction.editReply({ content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Anuncio criado com sucesso!`, components: [row13], ephemeral: true });
        }).catch(err => {
            console.error("Erro ao enviar mensagem:", err);
        });
    }

}

async function UpdateSale(client, produtin, interaction) {

    const Valor = products.get(`proodutos.${produtin}`)
    const allSelectMenus = [];
    const Valor2 = products.get(`proodutos.${produtin}.Campos`)
    const EMOJI = await obterEmoji();

    const CampoQn = Object.keys(Valor2).length
    const CampoQnty = Number(CampoQn)

    let nameProd = Valor.Config.name
    let descProd = Valor.Config.desc
    let bannerProd = Valor.Config.banner || null;
    let iconProd = Valor.Config.icon || null;

    let item = products.get(`proodutos.${produtin}.messageid`)

    if (CampoQnty <= 1) {
        const primeiraChave = Object.keys(Valor2)[0];
        const CampoSelect = Valor2[primeiraChave];
        let nameCampo = CampoSelect.name
        let descCampo = CampoSelect.desc
        let priceCampo = CampoSelect.price
        let estoqueProd = CampoSelect.stock || [];
        let estoqueCount = estoqueProd.length


        const embed = new EmbedBuilder()
            .setTitle(`${nameProd}`)
            .setDescription(`${descProd}`)
            .addFields(
                {
                    name: `${EMOJI.vx12 == null ? `` : `<a:${EMOJI.vx12.name}:${EMOJI.vx12.id}>`}Produto`, value: `${nameCampo}`, inline: false
                },
                {
                    name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`}Valor`, value: `\`R$ ${Number(priceCampo).toFixed(2)}\``, inline: true
                },
                {
                    name: `${EMOJI.vx9 == null ? `` : `<:${EMOJI.vx9.name}:${EMOJI.vx9.id}>`}Estoque`, value: `\`${estoqueCount}\``, inline: true
                },
            )
            .setColor(General.get('oficecolor.main') || '#FF8201')
            .setFooter(
                { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
            )

        if (bannerProd !== null) {
            embed.setImage(`${bannerProd}`)
        }
        if (iconProd !== null) {
            embed.setThumbnail(`${iconProd}`)
        }

        const button = new ButtonBuilder()
            .setCustomId(`AdquirirProd_${produtin}`)
            .setLabel(`Comprar`)
            .setStyle(3)
            .setEmoji('1252477800145883159')


        const buttonrow = new ActionRowBuilder().addComponents(button)

        for (const iterator in item) {
            const element = item[iterator];
            const channel = await client.channels.cache.get(element.channelid);
            if (!channel) continue;
            const msg = await channel.messages.fetch(element.msgid);
            if (!msg) continue;

            const button13 = new ButtonBuilder()
                .setURL(`${msg.url}`)
                .setLabel(`Ir até Anuncio`)
                .setStyle(5)
                .setEmoji('1252477800145883159')

            const row13 = new ActionRowBuilder().addComponents(button13)
            try {
                msg.edit({ components: [buttonrow], embeds: [embed] });
                interaction.editReply({ content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Anuncio atualizado!`, components: [row13], ephemeral: true });
            } catch (error) {
                console.log(`Erro ao atualizar a mensagem: ${error}`);
            }
        }

    } else {

        let optionsCount = 0;
        let currentSelectMenuBuilder;
        const menuIndex = Math.floor(optionsCount / 25);

        for (const produto in Valor2) {
            const CampoSelect = Valor2[produto];
            const nomeProduto = CampoSelect.name || "Nome não definido";
            let estoqueCampoo0 = CampoSelect.stock || [];
            let estoqueCount = estoqueCampoo0.length
            let priceCampo = CampoSelect.price
            let emojiCampo = CampoSelect.emojiCampo


            const option = {
                label: nomeProduto,
                description: `Valor: R$ ${priceCampo} - Estoque: ${estoqueCount}`,
                value: produto,
                emoji: emojiCampo,
            };

            if (optionsCount % 25 === 0) {
                if (currentSelectMenuBuilder) {
                    allSelectMenus.push(currentSelectMenuBuilder);
                }

                currentSelectMenuBuilder = new StringSelectMenuBuilder()
                    .setCustomId(`AdquirirProdSelect_${produtin}_${menuIndex + 1}`)
                    .setPlaceholder(`Clique aqui para selecionar`);
            }

            currentSelectMenuBuilder.addOptions(option);
            optionsCount++;
        }

        if (currentSelectMenuBuilder) {
            allSelectMenus.push(currentSelectMenuBuilder);
        }

        const rows = allSelectMenus.map((selectMenuBuilder) => {
            return new ActionRowBuilder().addComponents(selectMenuBuilder);
        });


        const embed = new EmbedBuilder()
            .setTitle(`${nameProd}`)
            .setDescription(`${descProd}`)
            .setFooter(
                { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
            )
            .setColor(General.get('oficecolor.main') || '#FF8201')

        if (bannerProd !== null) {
            embed.setImage(`${bannerProd}`)
        }

        if (iconProd !== null) {
            embed.setThumbnail(`${iconProd}`)
        }

        for (const iterator in item) {
            const element = item[iterator];
            const channel = await client.channels.cache.get(element.channelid);
            if (!channel) continue;
            const msg = await channel.messages.fetch(element.msgid);
            if (!msg) continue;

            const button13 = new ButtonBuilder()
                .setURL(`${msg.url}`)
                .setLabel(`Ir até Anuncio`)
                .setStyle(5)
                .setEmoji('1252477800145883159')

            const row13 = new ActionRowBuilder().addComponents(button13)
            try {

                msg.edit({ components: [...rows], embeds: [embed] });
                interaction.editReply({ content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Anuncio atualizado!`, components: [row13], ephemeral: true });

            } catch (error) {
                console.log(`Erro ao atualizar a mensagem: ${error}`);
            }
        }
    }
}

async function UpdateStock(client, produtin, interaction) {

    const Valor = products.get(`proodutos.${produtin}`)
    const allSelectMenus = [];
    const Valor2 = products.get(`proodutos.${produtin}.Campos`)
    const EMOJI = await obterEmoji();

    const CampoQn = Object.keys(Valor2).length
    const CampoQnty = Number(CampoQn)
    if (CampoQnty == 0) return;

    let nameProd = Valor.Config.name
    let descProd = Valor.Config.desc
    let bannerProd = Valor.Config.banner || null;
    let iconProd = Valor.Config.icon || null;

    let item = products.get(`proodutos.${produtin}.messageid`)

    if (CampoQnty == 1) {
        const primeiraChave = Object.keys(Valor2)[0];
        const CampoSelect = Valor2[primeiraChave];
        let nameCampo = CampoSelect.name
        let descCampo = CampoSelect.desc
        let priceCampo = CampoSelect.price
        let estoqueProd = CampoSelect.stock || [];
        let estoqueCount = estoqueProd.length


        const embed = new EmbedBuilder()
            .setTitle(`${nameProd}`)
            .setDescription(`${descProd}`)
            .addFields(
                {
                    name: `${EMOJI.vx12 == null ? `` : `<a:${EMOJI.vx12.name}:${EMOJI.vx12.id}>`}Produto`, value: `${nameCampo}`, inline: false
                },
                {
                    name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`}Valor`, value: `\`R$ ${Number(priceCampo).toFixed(2)}\``, inline: true
                },
                {
                    name: `${EMOJI.vx9 == null ? `` : `<:${EMOJI.vx9.name}:${EMOJI.vx9.id}>`}Estoque`, value: `\`${estoqueCount}\``, inline: true
                },
            )
            .setColor(General.get('oficecolor.main') || '#FF8201')
            .setFooter(
                { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
            )

        if (bannerProd !== null) {
            embed.setImage(`${bannerProd}`)
        }

        if (iconProd !== null) {
            embed.setThumbnail(`${iconProd}`)
        }

        const button = new ButtonBuilder()
            .setCustomId(`AdquirirProd_${produtin}`)
            .setLabel(`Comprar`)
            .setStyle(3)
            .setEmoji('1252477800145883159')


        const buttonrow = new ActionRowBuilder().addComponents(button)

        for (const iterator in item) {
            const element = item[iterator];
            const channel = await client.channels.cache.get(element.channelid)
            if (!channel) continue;
            const msg = await channel.messages.fetch(element.msgid)
            if (!msg) continue;

            try {
                msg.edit({ components: [buttonrow], embeds: [embed] })
            } catch (error) {
                console.log(error)
            }
        }

    } else {

        let optionsCount = 0;
        let currentSelectMenuBuilder;
        const menuIndex = Math.floor(optionsCount / 25);

        for (const produto in Valor2) {
            const CampoSelect = Valor2[produto];
            const nomeProduto = CampoSelect.name || "Nome não definido";
            let descProduto = CampoSelect.desc || "Descrição não definida";
            let estoqueCampoo0 = CampoSelect.stock || [];
            let estoqueCount = estoqueCampoo0.length
            let priceCampo = CampoSelect.price
            let emojiCampo = CampoSelect.emojiCampo


            const option = {
                label: nomeProduto,
                description: `Valor: R$ ${priceCampo} - Estoque: ${estoqueCount}`,
                value: produto,
                emoji: emojiCampo,
            };

            if (optionsCount % 25 === 0) {
                if (currentSelectMenuBuilder) {
                    allSelectMenus.push(currentSelectMenuBuilder);
                }

                currentSelectMenuBuilder = new Discord.StringSelectMenuBuilder()
                    .setCustomId(`AdquirirProdSelect_${produtin}_${menuIndex + 1}`)
                    .setPlaceholder(`Clique aqui para selecionar`);
            }

            currentSelectMenuBuilder.addOptions(option);
            optionsCount++;
        }

        if (currentSelectMenuBuilder) {
            allSelectMenus.push(currentSelectMenuBuilder);
        }

        const rows = allSelectMenus.map((selectMenuBuilder) => {
            return new ActionRowBuilder().addComponents(selectMenuBuilder);
        });


        const embed = new EmbedBuilder()
            .setTitle(`${nameProd}`)
            .setDescription(`${descProd}`)
            .setFooter(
                { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
            )
            .setColor(General.get('oficecolor.main') || '#FF8201')

        if (bannerProd !== null) {
            embed.setImage(`${bannerProd}`)
        }

        if (iconProd !== null) {
            embed.setThumbnail(`${iconProd}`)
        }

        for (const iterator in item) {
            const element = item[iterator];
            const channel = await client.channels.cache.get(element.channelid)
            if (!channel) continue;
            const msg = await channel.messages.fetch(element.msgid)
            if (!msg) continue;

            try {
                msg.edit({ components: [...rows], embeds: [embed] });
            } catch (error) {
                console.log(error)
            }
        }
    }
}

async function openCart(produtin, CampoSelect, interaction) {

    const Valor = await products.get(`proodutos.${produtin}`);
    const Valor2 = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}`);
    const userInteract = interaction.user.id
    const EMOJI = await obterEmoji();

    let bannerProd = Valor.Config.banner || '';
    let iconProd = Valor.Config.icon || '';
    const nameCampo = Valor2.name
    const descCampo = Valor2.desc
    const priceCampo = Valor2.price
    const estoqueCampo = Valor2.stock.length

    const buttonNotify = new ButtonBuilder()
        .setCustomId(`esperarEstoque_${produtin}_${CampoSelect}_${userInteract}`)
        .setLabel('Ativar Notificações')
        .setEmoji('1251441491679645698')
        .setStyle(1)

    const rowNotify = new ActionRowBuilder().addComponents(buttonNotify)
    if (estoqueCampo == 0) {
        return interaction.reply({ content: `Este produto se encontra sem estoque.\nClique no botão abaixo para ser notificado quando o estoque for abastecido.`, components: [rowNotify], ephemeral: true });
    }
    if (Valor === null) return interaction.reply({ content: `Esta produto não existe!`, ephemeral: true });

    if (Valor2 == null || Object.keys(Valor2).length == 0) return interaction.editReply({ content: `Este produto não existe!`, ephemeral: true });

    const threadcart = interaction.channel.threads.cache.find(x => x.name.includes(interaction.user.id));

    if (threadcart !== undefined) {
        const row4 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${threadcart.id}`)
                    .setLabel('Ir para o Carrinho')
                    .setStyle(5)
            )

        return interaction.reply({ content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} Você já possuí um carrinho aberto!`, components: [row4], ephemeral: true });
    }
    await interaction.reply({ content: `${EMOJI.vx2 == null ? `` : `<a:${EMOJI.vx2.name}:${EMOJI.vx2.id}>`} Aguarde seu carrinho esta sendo criado..`, ephemeral: true });

    const thread = await interaction.channel.threads.create({
        name: `🛒・${nameCampo}・${interaction.user.id}`,
        autoArchiveDuration: 1440,
        type: Discord.ChannelType.PrivateThread,
        reason: 'Carrinho Aberto',
        invitable: false, 
        members: [interaction.user.id],
        permissionOverwrites: [
            {
                id: General.get('admrole'),
                allow: [Discord.PermissionFlagsBits.SendMessagesInThreads],
                allow: [Discord.PermissionFlagsBits.ViewChannel],
            },
            {
                id: interaction.user.id,
                allow: [Discord.PermissionFlagsBits.SendMessagesInThreads],
                allow: [Discord.PermissionFlagsBits.SendMessages],
                allow: [Discord.PermissionFlagsBits.AttachFiles],
            }
        ],
    });

    const iDCarrin = thread.id
    const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setURL(`https://discord.com/channels/${interaction.guild.id}/${thread.id}`)
                .setLabel('Ir para o Carrinho')
                .setStyle(5)
        )

    interaction.editReply({ content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Carrinho criado com sucesso!`, components: [row4] });

    const agora = new Date();
    const item = products.get(`proodutos.${produtin}.messageid`)
    const infoRebuyC = item[0].channelid
    const infoRebuyM = item[0].msgid

    await carrinhos.set(`${interaction.user.id}.${iDCarrin}`, {
        idCart: iDCarrin,
        itemBuy: nameCampo,
        quantidade: 1,
        valor: Number(priceCampo).toFixed(2),
        StatusBuy: 'pending',
        idPay: null,
        cupom: null,
        creationDate: agora,
        channelid: infoRebuyC,
        msgid: infoRebuyM,
        guildid: interaction.guild.id,
        USERID: interaction.user.id
    });

    let quantidadeCompra = await carrinhos.get(`${interaction.user.id}.${iDCarrin}.quantidade`)
    let priceCompra = priceCampo * quantidadeCompra

    const embed = new Discord.EmbedBuilder()
        .setTitle(`Pedido | ${iDCarrin}`)
        .setDescription(`\u200B`)
        .addFields(
            {
                name: `${EMOJI.vx1 == null ? `` : `<:${EMOJI.vx1.name}:${EMOJI.vx1.id}>`}Carrinho`, value: `\`x${quantidadeCompra}\` - **${nameCampo}**`, inline: true
            },
            {
                name: `${EMOJI.vx9 == null ? `` : `<:${EMOJI.vx9.name}:${EMOJI.vx9.id}>`}Em Estoque`, value: `\`${estoqueCampo}\``, inline: true
            },
            {
                name: `\u200B`, value: `\u200B`, inline: false
            },
            {
                name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`}Valor a ser Pago`, value: `\`R$ ${Number(priceCompra).toFixed(2)}\``, inline: true
            },
            {
                name: `${EMOJI.vx4 == null ? `` : `<:${EMOJI.vx4.name}:${EMOJI.vx4.id}>`}Cupom`, value: `${carrinhos.get(`${interaction.user.id}.${iDCarrin}.cupom`) == null ? 'Nenhum cupom utilizado' : `\`${carrinhos.get(`${interaction.user.id}.${iDCarrin}.cupom`)}\``}`, inline: true
            },
        )
        .setColor(General.get('oficecolor.main') || '#FF8201')
        .setFooter(
            { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
        )
        .setTimestamp()

    if (bannerProd !== '') {
        embed.setImage(`${bannerProd}`)
    }
    if (iconProd !== '') {
        embed.setThumbnail(`${iconProd}`)
    }


    const button = new ButtonBuilder()
        .setCustomId(`pagarCompra_${produtin}_${CampoSelect}_${userInteract}_${iDCarrin}`)
        .setLabel('Realizar Pagamento')
        .setEmoji('1295500759735074887')
        .setStyle(3)
    const button2 = new ButtonBuilder()
        .setCustomId(`cancellCompra_${produtin}_${CampoSelect}_${userInteract}_${iDCarrin}`)
        .setLabel('Cancelar')
        .setEmoji('1251441411266711573')
        .setStyle(4)
    const button3 = new ButtonBuilder()
        .setCustomId(`usarcupomCompra_${produtin}_${CampoSelect}_${userInteract}_${iDCarrin}`)
        .setLabel('Usar Cupom')
        .setEmoji('1251441496104636496')
        .setStyle(2)
    const button4 = new ButtonBuilder()
        .setCustomId(`addoneCompra_${produtin}_${CampoSelect}_${userInteract}_${iDCarrin}`)
        .setEmoji('1264379774793420811')
        .setStyle(2)
    const button5 = new ButtonBuilder()
        .setCustomId(`removeoneCompra_${produtin}_${CampoSelect}_${userInteract}_${iDCarrin}`)
        .setEmoji('1264379758469320761')
        .setStyle(2)
    const button6 = new ButtonBuilder()
        .setCustomId(`editarquantyCompra_${produtin}_${CampoSelect}_${userInteract}_${iDCarrin}`)
        .setLabel('Alterar Quantidade')
        .setEmoji('1264379809845477406')
        .setStyle(1)

    const row1 = new ActionRowBuilder()
        .addComponents(button, button3, button2);
    const row2 = new ActionRowBuilder()
        .addComponents(button4, button5, button6);

    let msgbuyEmbed = await thread.send({ components: [row1, row2], embeds: [embed], content: `${interaction.user}` });
    await carrinhos.set(`${interaction.user.id}.${iDCarrin}.messageID`, msgbuyEmbed.id);
}

async function finalyPay(produtin, CampoSelect, userInteract, iDCarrin, client, interaction) {
    const Valor2 = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}`);
    const Valor3 = await carrinhos.get(`${userInteract}.${iDCarrin}`);
    let EstoqueProd = Valor2.stock

    const Channel = interaction.channel
    const userbuy = interaction.guild.members.cache.get(userInteract);
    const iuser = interaction.user.username
    const EMOJI = await obterEmoji();
    const RoleCostumer = General.get('costumeRrole') || null;
    const item = products.get(`proodutos.${produtin}.messageid`)

    const payment = await generatePayment(Valor3.valor, iuser, Valor3.itemBuy);
    
    if (payment && payment.status === 'error') {
        console.log('Erro ao gerar pagamento com Mercado Pago');
        return Channel.send(`Erro ao gerar o pagamento: `);
    }

    const buffer = Buffer.from(payment.point_of_interaction.transaction_data.qr_code_base64, "base64");
    const attachment = new AttachmentBuilder(buffer, { name: "payment.png" });
    const pixCode = payment.point_of_interaction.transaction_data.qr_code;
    carrinhos.set(`${interaction.user.id}.${iDCarrin}.idPay`, payment.id);

    const Finalyrow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`copypastePPix`)
            .setLabel('Código Copia e Cola')
            .setEmoji('1262642485470167060')
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId(`cancellCompraA`)
            .setLabel('Cancelar')
            .setEmoji('1251441411266711573')
            .setStyle(4)
    )


    interaction.editReply({
        content: ``, embeds: [
            new EmbedBuilder()
                .setTitle(`Pedido | ${iDCarrin}`)
                .setDescription(`O pagamento expira em ⏱️\` 10 Minutos \``)
                .addFields(
                    {
                        name: `Copia e Cola`, value: `\`\`\`${pixCode}\`\`\``, inline: true
                    },
                )
                .setColor(General.get('oficecolor.main') || '#FF8201')
                .setImage('attachment://payment.png')
                .setFooter(
                    { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
                )
                .setTimestamp()
        ], files: [attachment], components: [Finalyrow]
    });

    const filter = i => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10 * 60 * 1000 });

    collector.on('collect', async i => {
        if (i.customId === 'copypastePPix') {
            Channel.send({ content: `${pixCode}` });
        }
        if (i.customId === 'cancellCompraA') {
            collector.stop();
            clearInterval(int);
            carrinhos.delete(`${userInteract}.${iDCarrin}`);
            await interaction.channel.bulkDelete(5)
            interaction.followUp({ content: `${EMOJI.vx2 == null ? `` : `<a:${EMOJI.vx2.name}:${EMOJI.vx2.id}>`} Compra cancelada, o carrinho será fechado em 5 segundos.`, ephemeral: true });
            setTimeout(() => {
                interaction.channel.delete();
            }, 5000)
        }
    });

    const vendasADM = interaction.guild.channels.cache.get(General.get('logsVendasADM')) || null;
    const Avisorow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setURL(`https://discord.com/channels/${interaction.guild.id}/${iDCarrin}`)
            .setLabel('Ir para Carrinho')
            .setEmoji('1297811409132064768')
            .setStyle(5)
    )

    if (userbuy) {
        userbuy.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `Pedido em Andamento`, iconURL: "https://cdn.discordapp.com/emojis/1296862302917759036.webp?size=96&quality=lossless" })
                    .setDescription(`${EMOJI.vx6 == null ? `` : `<:${EMOJI.vx6.name}:${EMOJI.vx6.id}>`} Olá <@${userInteract}> \nSeu pedido está em andamento, não se esqueça de realizar o pagamento.`)
                    .addFields(
                        {
                            name: `${EMOJI.vx5 == null ? `` : `<:${EMOJI.vx5.name}:${EMOJI.vx5.id}>`} ID do Pedido`, value: `\`${iDCarrin}\``, inline: true
                        },
                        {
                            name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`} Valor`, value: `\`R$ ${Number(Valor3.valor).toFixed(2)}\``, inline: true
                        },
                        {
                            name: `${EMOJI.vx7 == null ? `` : `<:${EMOJI.vx7.name}:${EMOJI.vx7.id}>`} Informações do Carrinho`, value: `\`x${Valor3.quantidade}\` - ${Valor3.itemBuy}`, inline: false
                        },

                    )
                    .setColor(General.get('oficecolor.yellow') || '#FF8201')
                    .setFooter(
                        { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
                    )
                    .setTimestamp()
            ], components: [Avisorow]
        });
    }
    if (vendasADM !== null) {
        vendasADM.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `Pedido em Andamento`, iconURL: "https://cdn.discordapp.com/emojis/1296862302917759036.webp?size=96&quality=lossless" })
                    .setDescription(`${EMOJI.vx6 == null ? `` : `<:${EMOJI.vx6.name}:${EMOJI.vx6.id}>`} **Comprador:** <@${userInteract}>`)
                    .addFields(
                        {
                            name: `${EMOJI.vx5 == null ? `` : `<:${EMOJI.vx5.name}:${EMOJI.vx5.id}>`} Id do Pedido:`, value: `\`${iDCarrin}\``, inline: true
                        },
                        {
                            name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`} Valor:`, value: `\`R$ ${Number(Valor3.valor).toFixed(2)}\``, inline: true
                        },
                        {
                            name: `${EMOJI.vx7 == null ? `` : `<:${EMOJI.vx7.name}:${EMOJI.vx7.id}>`} Informações do Carrinho`, value: `\`x${Valor3.quantidade}\` - ${Valor3.itemBuy}`, inline: false
                        },

                    )
                    .setColor(General.get('oficecolor.yellow') || '#FF8201')
                    .setFooter(
                        { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
                    )
                    .setTimestamp()
            ]
        });
    }

    const int = setInterval(async () => {
        try {
            const Pedido = await carrinhos.get(`${userInteract}.${iDCarrin}`);
            const agora = new Date();
            const tempoExpiracao = 10 * 60 * 1000;
            const dataCriacao = new Date(Valor3.creationDate);
            const tempoDecorrido = agora - dataCriacao;

            if (tempoDecorrido >= tempoExpiracao) return clearInterval(int);
            if (!Pedido) return clearInterval(int);
            let pays;
            try {
                pays = await verifyPayment(payment.id);
            } catch (error) {
                console.error("Erro ao verificar pagamento:", error.message || error);
                return;
            }

            if (pays.status === "cancelled") return clearInterval(int);
            if (pays.status !== "approved") return;
            collector.stop();
            clearInterval(int);
            const logEntrega = interaction.guild.channels.cache.get(General.get('logsVendasPUB')) || null;
            const CHFeedback = interaction.guild.channels.cache.get(General.get('VendasFeedback')) || null;
            await Channel.setName(`✅・Pagamento Aprovado・${userInteract}`);
            const removed = EstoqueProd.splice(0, Number(Valor3.quantidade)).join("\n");
            await carrinhos.set(`${userInteract}.${iDCarrin}.StatusBuy`, 'approved');

            const infoRebuyC = item[0].channelid
            const infoRebuyM = item[0].msgid

            const buttonbuyLog = new ButtonBuilder()
                .setURL(`https://discord.com/channels/${interaction.guild.id}/${infoRebuyC}/${infoRebuyM}`)
                .setLabel('Comprar')
                .setEmoji(`1297811409132064768`)
                .setStyle(5)

            const strangerBuy = new ActionRowBuilder().addComponents(buttonbuyLog);

            vendasADM.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: `Pedido Aprovado`, iconURL: "https://cdn.discordapp.com/emojis/1296861728163762206.webp?size=96&quality=lossless" })
                        .setDescription(`${EMOJI.vx6 == null ? `` : `<:${EMOJI.vx6.name}:${EMOJI.vx6.id}>`} Comprador: <@${userInteract}>`)
                        .addFields(
                            {
                                name: `${EMOJI.vx5 == null ? `` : `<:${EMOJI.vx5.name}:${EMOJI.vx5.id}>`} ID do Pedido:`, value: `\`${iDCarrin}\``, inline: true
                            },
                            {
                                name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`} Valor:`, value: `\`R$ ${Number(Valor3.valor).toFixed(2)}\``, inline: true
                            },
                            {
                                name: `${EMOJI.vx7 == null ? `` : `<:${EMOJI.vx7.name}:${EMOJI.vx7.id}>`} Informações do Carrinho`, value: `\`x${Valor3.quantidade}\` - ${Valor3.itemBuy}`, inline: false
                            },
                        )
                        .setThumbnail(userbuy.displayAvatarURL())
                        .setColor(General.get('oficecolor.green') || '#FF8201')
                        .setFooter(
                            { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
                        )
                        .setTimestamp()
                ]
            }).then(() => {
                vendasADM.send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: `Produto(s) Entregue`, iconURL: "https://cdn.discordapp.com/emojis/1290144734529982474.webp?size=96&quality=lossless" })
                            .setDescription(`\`\`\`${removed}\`\`\``)
                            .setColor(General.get('oficecolor.green') || '#FF8201')
                    ]
                })
            })
            logEntrega.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: `Pedido Aprovado`, iconURL: "https://cdn.discordapp.com/emojis/1296861728163762206.webp?size=96&quality=lossless" })
                        .setDescription(`${EMOJI.vx15 == null ? `` : `<:${EMOJI.vx15.name}:${EMOJI.vx15.id}>`} **Nova compra realizada!**`)
                        .addFields(
                            {
                                name: `${EMOJI.vx5 == null ? `` : `<:${EMOJI.vx5.name}:${EMOJI.vx5.id}>`} ID do Pedido:`, value: `\`${iDCarrin}\``, inline: true
                            },
                            {
                                name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`} Valor:`, value: `\`R$ ${Number(Valor3.valor).toFixed(2)}\``, inline: true
                            },
                            {
                                name: `${EMOJI.vx7 == null ? `` : `<:${EMOJI.vx7.name}:${EMOJI.vx7.id}>`} Informações do Carrinho`, value: `\`x${Valor3.quantidade}\` - ${Valor3.itemBuy}`, inline: false
                            },
                        )
                        .setColor(General.get('oficecolor.green') || '#FF8201')
                        .setFooter(
                            { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
                        )
                        .setTimestamp()
                ], components: [strangerBuy]
            });

            CHFeedback.send({ content: `<@${userInteract}>` }).then((msg) => {
                msg.delete();
            });

            if (Valor3.quantidade <= 20) {

                const embedEntrega = new EmbedBuilder()
                    .setAuthor({ name: `Entrega do Produto`, iconURL: "https://cdn.discordapp.com/emojis/1290144734529982474.webp?size=96&quality=lossless" })
                    .setDescription(`\`\`\`${removed}\`\`\``)
                    .setColor(General.get('oficecolor.green') || '#FF8201')

                const buttonNotify = new ButtonBuilder()
                    .setCustomId(`esperarEstoque_${produtin}_${CampoSelect}_${userInteract}`)
                    .setLabel('Notificações de Estoque')
                    .setEmoji(`1251441491679645698`)
                    .setStyle(1)

                const buttonRebuy = new ButtonBuilder()
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${infoRebuyC}/${infoRebuyM}`)
                    .setLabel('Comprar Novamente')
                    .setEmoji(`1297811409132064768`)
                    .setStyle(5)

                const rowNoty = new ActionRowBuilder().addComponents(buttonNotify)
                const rowRebuy = new ActionRowBuilder().addComponents(buttonRebuy)

                userbuy.send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: `Pedido Aprovado`, iconURL: "https://cdn.discordapp.com/emojis/1296861728163762206.webp?size=96&quality=lossless" })
                            .setDescription(`${EMOJI.vx6 == null ? `` : `<:${EMOJI.vx6.name}:${EMOJI.vx6.id}>`} Olá <@${userInteract}>\nSeu pedido com ID \`${iDCarrin}\` foi aprovado e seu produto se encontra abaixo.`)
                            .addFields(
                                {
                                    name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`} Valor Pago`, value: `\`R$ ${Number(Valor3.valor).toFixed(2)}\``, inline: false
                                },
                                {
                                    name: `${EMOJI.vx7 == null ? `` : `<:${EMOJI.vx7.name}:${EMOJI.vx7.id}>`} Informações do Carrinho`, value: `\`x${Valor3.quantidade}\` - ${Valor3.itemBuy}`, inline: false
                                },

                            )
                            .setColor(General.get('oficecolor.green') || '#FF8201')
                            .setFooter(
                                { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
                            )
                            .setTimestamp()
                    ], components: [rowNoty, rowRebuy]
                }).then((msg) => {

                    userbuy.send({ embeds: [embedEntrega] });

                    const buttontoProd = new ButtonBuilder()
                        .setURL(`https://discord.com/channels/@me/${msg.channel.id}/${msg.id}`)
                        .setLabel('Ir para Entrega')
                        .setEmoji('1286148930182058056')
                        .setStyle(5)

                    const rowNotify = new ActionRowBuilder().addComponents(buttontoProd)

                    interaction.editReply({
                        content: ``, embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: `Pedido Aprovado`, iconURL: "https://cdn.discordapp.com/emojis/1296861728163762206.webp?size=96&quality=lossless" })
                                .setDescription(`${EMOJI.vx6 == null ? `` : `<:${EMOJI.vx6.name}:${EMOJI.vx6.id}>`} Olá <@${userInteract}>, seu pedido foi aprovado.\n A entrega foi entregue em sua DM, Agradecemos por sua compra e por confiar em nós, volte sempre!`)
                                .addFields(
                                    {
                                        name: `${EMOJI.vx5 == null ? `` : `<:${EMOJI.vx5.name}:${EMOJI.vx5.id}>`} ID do Pedido`, value: `\`${iDCarrin}\``, inline: false
                                    },
                                    {
                                        name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`} Valor:`, value: `\`R$ ${Number(Valor3.valor).toFixed(2)}\``, inline: false
                                    },
                                    {
                                        name: `${EMOJI.vx7 == null ? `` : `<:${EMOJI.vx7.name}:${EMOJI.vx7.id}>`} Informações do Carrinho`, value: `\`x${Valor3.quantidade}\` - ${Valor3.itemBuy}`, inline: false
                                    },

                                )
                                .setColor(General.get('oficecolor.green') || '#FF8201')
                                .setFooter(
                                    { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
                                )
                                .setTimestamp()
                        ], files: [], components: [rowNotify]
                    });
                }).catch((error) => {
                    console.log(error)
                })
            } else {
                try {
                    const buffer = Buffer.from(removed, 'utf-8');
                    fs.writeFileSync('pedido.txt', buffer);
                    const attachment = new AttachmentBuilder('pedido.txt');

                    const buttonNotify = new ButtonBuilder()
                        .setCustomId(`esperarEstoque_${produtin}_${CampoSelect}_${userInteract}`)
                        .setLabel('Notificações de Estoque')
                        .setEmoji('1251441491679645698')
                        .setStyle(1)

                    const buttonRebuy = new ButtonBuilder()
                        .setURL(`https://discord.com/channels/${interaction.guild.id}/${infoRebuyC}/${infoRebuyM}`)
                        .setLabel('Comprar Novamente')
                        .setEmoji(`1297811409132064768`)
                        .setStyle(5)

                    const rowNotyY = new ActionRowBuilder().addComponents(buttonNotify)
                    const rowRebuy = new ActionRowBuilder().addComponents(buttonRebuy)

                    userbuy.send({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: `Pedido Aprovado`, iconURL: "https://cdn.discordapp.com/emojis/1296861728163762206.webp?size=96&quality=lossless" })
                                .setDescription(`${EMOJI.vx6 == null ? `` : `<:${EMOJI.vx6.name}:${EMOJI.vx6.id}>`} Olá <@${userInteract}>\nSeu pedido com ID \`${iDCarrin}\` foi aprovado e seu produto se encontra abaixo.`)
                                .addFields(
                                    {
                                        name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`} Valor Pago`, value: `\`R$ ${Number(Valor3.valor).toFixed(2)}\``, inline: false
                                    },
                                    {
                                        name: `${EMOJI.vx7 == null ? `` : `<:${EMOJI.vx7.name}:${EMOJI.vx7.id}>`} Informações do Carrinho`, value: `\`x${Valor3.quantidade}\` - ${Valor3.itemBuy}`, inline: false
                                    },

                                )
                                .setColor(General.get('oficecolor.green') || '#FF8201')
                                .setFooter(
                                    { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
                                )
                                .setTimestamp()
                        ], components: [rowNotyY, rowRebuy]
                    }).then((msg) => {
                        userbuy.send({ files: [attachment] });

                        fs.unlinkSync('pedido.txt');

                        const buttontoProd = new ButtonBuilder()
                            .setURL(`https://discord.com/channels/@me/${msg.channel.id}/${msg.id}`)
                            .setLabel('Ir para Entrega')
                            .setEmoji('1286148930182058056')
                            .setStyle(5)

                        const rowNotify = new ActionRowBuilder().addComponents(buttontoProd)

                        interaction.editReply({
                            content: ``, embeds: [
                                new EmbedBuilder()
                                    .setAuthor({ name: `Pedido Aprovado`, iconURL: "https://cdn.discordapp.com/emojis/1296861728163762206.webp?size=96&quality=lossless" })
                                    .setDescription(`${EMOJI.vx6 == null ? `` : `<:${EMOJI.vx6.name}:${EMOJI.vx6.id}>`} Olá <@${userInteract}>, seu pedido foi aprovado.\n A entrega foi feita em sua DM, Agradecemos por sua compra e por confiar em nós, volte sempre!`)
                                    .addFields(
                                        {
                                            name: `${EMOJI.vx5 == null ? `` : `<:${EMOJI.vx5.name}:${EMOJI.vx5.id}>`} ID do Pedido`, value: `\`${iDCarrin}\``, inline: false
                                        },
                                        {
                                            name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`} Valor:`, value: `\`R$ ${Number(Valor3.valor).toFixed(2)}\``, inline: false
                                        },
                                        {
                                            name: `${EMOJI.vx7 == null ? `` : `<:${EMOJI.vx7.name}:${EMOJI.vx7.id}>`} Informações do Carrinho`, value: `\`x${Valor3.quantidade}\` - ${Valor3.itemBuy}`, inline: false
                                        },

                                    )
                                    .setColor(General.get('oficecolor.green') || '#FF8201')
                                    .setFooter(
                                        { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
                                    )
                                    .setTimestamp()
                            ], files: [], components: [rowNotify]
                        });
                    }).catch((error) => {
                        console.log(error)
                    })
                } catch (error) {
                    console.log(error)
                }

            }

            try {
                lojaInfo.add("rendimentos.pedidosAprovados", 1);
                lojaInfo.add("rendimentos.prodEntregues", Number(Valor3.quantidade));
                lojaInfo.add(`rendimentos.valortotal`, Number(Valor3.valor).toFixed(2));
                products.add(`proodutos.${produtin}.Campos.${CampoSelect}.estatisticas.vendas`, 1);
                products.add(`proodutos.${produtin}.Campos.${CampoSelect}.estatisticas.vendidos`, Number(Valor3.quantidade));
                products.add(`proodutos.${produtin}.Campos.${CampoSelect}.estatisticas.rendeu`, Number(Valor3.valor).toFixed(2));
                products.set(`proodutos.${produtin}.Campos.${CampoSelect}.stock`, EstoqueProd);
            } catch (error) {
                console.log(`Erro ao atualizar estatisticas: ${error}`)
            }
            if (RoleCostumer !== null) {
                if (!interaction.member.roles.cache.has(RoleCostumer)) {
                    try {
                        interaction.member.roles.add(RoleCostumer);
                    } catch (error) {
                        if (error.code === 50013) {
                            const LogErro = client.channels.cache.get(General.get('logsGerais'));
                            if (LogErro) {
                                LogErro.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setAuthor({ name: `Error`, iconURL: "https://cdn.discordapp.com/emojis/1296861728163762206.webp?size=96&quality=lossless" })
                                            .setDescription(`Houve um erro ao tentar adicionar cargo ao cliente, <@${userInteract}>\nPedido: \`${iDCarrin}\` Foi devidamente aprovado e entregue, porém não foi possivel adicionar o cargo de cliente ao usuario por falta de permissões.`)
                                            .setColor(General.get('oficecolor.green') || '#FF8201')
                                            .setFooter(
                                                { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
                                            )
                                            .setTimestamp()
                                    ]
                                });
                            }
                        } else {
                            console.error("Erro add role costumer:", error);
                        }
                    }
                }
            }
            UpdateStock(client, produtin, interaction);

            interaction.channel.send({ content: `${EMOJI.vx2 == null ? `` : `<a:${EMOJI.vx2.name}:${EMOJI.vx2.id}>`} Este carrinho será deletado em 60 segundos!` });

            setTimeout(() => {
                const buttonfedbak = new ButtonBuilder()
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${General.get(`VendasFeedback`)}`)
                    .setLabel('Clique aqui e deixe um feedback')
                    .setEmoji('1276564807335809156')
                    .setStyle(5)

                const rowfeedback = new ActionRowBuilder().addComponents(buttonfedbak)
                userbuy.send({ content: `Olá <@${userInteract}>, deu tudo certo com sua compra? não se esqueça de deixar seu feedback, para fortalecer nossa loja.`, components: [rowfeedback] });
                interaction.channel.delete();
            }, 60 * 1000)


        } catch (error) {
            console.error(`Pagamento foi aprovado mas deu problema na entrega\n\n ${error}`);
        }
    }, 3000);

}

module.exports = {
    verifyPayment,
    generatePayment,
    estoqueCampos,
    CreateSale,
    UpdateSale,
    openCart,
    finalyPay,
    UpdateStock,
    refund
}