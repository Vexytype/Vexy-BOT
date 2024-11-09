const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, AttachmentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require("discord.js");
const Discord = require("discord.js")
const { General, BList, tickets, announce, welcomis, products, lojaInfo, carrinhos } = require("../../Database/index");
const { token } = require("../../token.json")
const { panel } = require("../../Functions/painel");
const { configgggSales, panelSales, GerenciarProduto, GerenciarCampoProd, notifyStock, downloadFile, obterEmoji, configCoupons } = require("../../Functions/definicoes")
const { CreateSale, verifyPayment, generatePayment, UpdateSale, estoqueCampos, openCart, finalyPay, UpdateStock, refund } = require("../../Functions/loja")
const axios = require("axios");
const fs = require('fs');
const path = require('path');
const mercadopago = require('mercadopago');
const { generateInvite } = require("../../index.js");


module.exports = {
    name: "interactionCreate",
    run: async (interaction, client) => {
        const customId = interaction.customId;
        const inteButton = interaction.isButton();
        const inteModal = interaction.isModalSubmit();
        const inteChannellll = interaction.isChannelSelectMenu();
        const stringsS = interaction.isStringSelectMenu();

        if (inteButton) {
            const [action, produtin] = interaction.customId.split('_');

            if (action === 'personalizarPRood') {

                const modal = new ModalBuilder()
                    .setCustomId(`modalEdiitProd_${produtin}`)
                    .setTitle('Editar Produto')

                const input = new TextInputBuilder()
                    .setCustomId(`inputEditNameProd`)
                    .setLabel('Nome')
                    .setPlaceholder('Insira o nome para o qual deseja alterar')
                    .setStyle(1)
                    .setMaxLength(32)
                    .setRequired(false)

                const input1 = new TextInputBuilder()
                    .setCustomId(`inputEditDescProd`)
                    .setLabel('Descrição')
                    .setPlaceholder('Insira a descrição do produto')
                    .setStyle(2)
                    .setMaxLength(1024)
                    .setRequired(false)

                const input2 = new TextInputBuilder()
                    .setCustomId(`inputEditBannerProd`)
                    .setLabel('Banner')
                    .setPlaceholder('Insira a URL da imagem aqui')
                    .setStyle(1)
                    .setRequired(false)

                const input3 = new TextInputBuilder()
                    .setCustomId(`inputEditIconProd`)
                    .setLabel('Icon')
                    .setPlaceholder('Insira a URL da imagem aqui')
                    .setStyle(1)
                    .setRequired(false)

                const row = new ActionRowBuilder().addComponents(input)
                const row1 = new ActionRowBuilder().addComponents(input1)
                const row2 = new ActionRowBuilder().addComponents(input2)
                const row3 = new ActionRowBuilder().addComponents(input3)

                modal.addComponents(row, row1, row2, row3);
                await interaction.showModal(modal);
            }
            if (action === 'addCampoProd') {
                const produtosData = products.get(`proodutos.${produtin}.Campos`);

                if (Object.keys(produtosData).length >= 10) {
                    return interaction.reply({ content: `Este produto atingiu o limite de campos.`, ephemeral: true });
                }

                const modal = new ModalBuilder()
                    .setCustomId(`modalAddCampo_${produtin}`)
                    .setTitle('Adicionar Campo')

                const input = new TextInputBuilder()
                    .setCustomId(`inputNameCampo`)
                    .setLabel('Nome')
                    .setPlaceholder('Insira o nome do campo')
                    .setStyle(1)
                    .setMaxLength(32)
                    .setRequired(true)

                const input1 = new TextInputBuilder()
                    .setCustomId(`inputDescCampo`)
                    .setLabel('Descrição')
                    .setPlaceholder('Insira a descrição do campo')
                    .setStyle(2)
                    .setMaxLength(1024)
                    .setRequired(true)

                const input2 = new TextInputBuilder()
                    .setCustomId(`inputPriceCampo`)
                    .setLabel('Valor')
                    .setPlaceholder('ex: 3.90')
                    .setStyle(1)
                    .setRequired(true)


                const input3 = new TextInputBuilder()
                    .setCustomId(`inputEmojiCampo`)
                    .setLabel('Emoji')
                    .setPlaceholder('Insira um emoji válido')
                    .setStyle(1)
                    .setRequired(false)

                const row = new ActionRowBuilder().addComponents(input)
                const row1 = new ActionRowBuilder().addComponents(input1)
                const row2 = new ActionRowBuilder().addComponents(input2)
                const row3 = new ActionRowBuilder().addComponents(input3)

                modal.addComponents(row, row1, row2, row3)
                await interaction.showModal(modal);
            }
            if (action === `gerenciarProds`) {
                const EMOJI = await obterEmoji();

                const produtosData = products.get(`proodutos`);
                const allSelectMenus = [];

                let optionsCount = 0;
                let currentSelectMenuBuilder;

                if (produtosData == null || Object.keys(produtosData).length == 0) {
                    return interaction.reply({ content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} Não existe nenhum produto criado para gerenciar.`, ephemeral: true });
                }

                const menuIndex = Math.floor(optionsCount / 25);

                for (const produto in produtosData) {
                    const config = produtosData[produto].Config;
                    const nomeProduto = config.name || "Nome não definido";
                    let descProduto = config.desc || "Descrição não definida";

                    if (descProduto.length > 40) {
                        descProduto = descProduto.slice(0, 40);
                    }

                    const option = {
                        label: nomeProduto,
                        description: descProduto,
                        value: produto,
                        emoji: "1265528447418105940",
                    };

                    if (optionsCount % 25 === 0) {
                        if (currentSelectMenuBuilder) {
                            allSelectMenus.push(currentSelectMenuBuilder);
                        }

                        currentSelectMenuBuilder = new Discord.StringSelectMenuBuilder()
                            .setCustomId(`configproduto_${menuIndex + 1}`)
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

                const row45 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('voltarcfgVendas')
                        .setLabel('Voltar')
                        .setEmoji('1265111272312016906')
                        .setStyle(2)
                );

                await interaction.update({
                    embeds: [],
                    components: [...rows, row45],
                    content: `Selecione o produto que deseja configurar.`,
                });
            }
            if (action === `voltarcfgProds`) {
                await GerenciarProduto(produtin, interaction, client);
            }
            if (action === `configCampoProd`) {
                const EMOJI = await obterEmoji();

                const produtosData = products.get(`proodutos.${produtin}.Campos`);
                const allSelectMenus = [];

                let optionsCount = 0;
                let currentSelectMenuBuilder;

                if (produtosData == null || Object.keys(produtosData).length == 0) {
                    return interaction.reply({ content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} Não existe nenhum campo criado para gerenciar.`, ephemeral: true });
                }

                const menuIndex = Math.floor(optionsCount / 25);

                for (const produto in produtosData) {
                    const config = produtosData[produto];
                    const nomeProduto = config.name || "Nome não definido";
                    let descProduto = config.desc || "Descrição não definida";

                    if (descProduto.length > 70) {
                        descProduto = descProduto.slice(0, 70);
                    }

                    const option = {
                        label: nomeProduto,
                        description: descProduto,
                        value: produto,
                        emoji: "1265528447418105940",
                    };

                    if (optionsCount % 25 === 0) {
                        if (currentSelectMenuBuilder) {
                            allSelectMenus.push(currentSelectMenuBuilder);
                        }

                        currentSelectMenuBuilder = new Discord.StringSelectMenuBuilder()
                            .setCustomId(`configCampoproduto_${produtin}_${menuIndex + 1}`)
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

                const row45 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`voltarcfgProds_${produtin}`)
                        .setLabel('Voltar')
                        .setEmoji('1265111272312016906')
                        .setStyle(2)
                );

                await interaction.update({
                    embeds: [],
                    components: [...rows, row45],
                    content: `Selecione o campo que deseja gerenciar.`,
                });
            }
            if (action === `removeCampoProd`) {

                const produtosData = products.get(`proodutos.${produtin}.Campos`);
                const allSelectMenus = [];

                let optionsCount = 0;
                let currentSelectMenuBuilder;

                if (produtosData == null || Object.keys(produtosData).length == 0) {
                    return interaction.reply({ content: `Não existe nenhum campo criado para deletar.`, ephemeral: true });
                }

                const menuIndex = Math.floor(optionsCount / 25);

                for (const produto in produtosData) {
                    const config = produtosData[produto];
                    const nomeProduto = config.name || "Nome não definido";
                    let descProduto = config.desc || "Descrição não definida";

                    if (descProduto.length > 70) {
                        descProduto = descProduto.slice(0, 70);
                    }

                    const option = {
                        label: nomeProduto,
                        description: descProduto,
                        value: produto,
                        emoji: "1265528447418105940",
                    };

                    if (optionsCount % 25 === 0) {
                        if (currentSelectMenuBuilder) {
                            allSelectMenus.push(currentSelectMenuBuilder);
                        }

                        currentSelectMenuBuilder = new Discord.StringSelectMenuBuilder()
                            .setCustomId(`removeCampoproduto_${produtin}_${menuIndex + 1}`)
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

                const row4 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`voltarcfgProds_${produtin}`)
                        .setLabel('Voltar')
                        .setEmoji('1265111272312016906')
                        .setStyle(2)
                );

                await interaction.update({
                    embeds: [],
                    components: [...rows, row4],
                    content: `Selecione o campo que deseja deletar.`,
                });
            }
            if (action === `postarPRodd`) {
                const valor1 = await products.get(`proodutos.${produtin}.Campos`);


                if (valor1 == null || Object.keys(valor1).length == 0) {
                    return interaction.reply({ content: `O produto não possui campos para venda.`, ephemeral: true });
                } else {
                    const posttick = new ChannelSelectMenuBuilder()
                        .setCustomId(`canalPostSale_${produtin}`)
                        .setPlaceholder('Clique aqui para selecionar')
                        .setChannelTypes(ChannelType.GuildText)

                    const row1 = new ActionRowBuilder()
                        .addComponents(posttick);

                    interaction.reply({ components: [row1], content: `Selecione o canal que deseja postar seu anuncio.`, ephemeral: true, });
                }
            }
            if (action === `sincronizarPRodd`) {
                const EMOJI = await obterEmoji();
                await interaction.reply({ content: `${EMOJI.vx2 == null ? `` : `<a:${EMOJI.vx2.name}:${EMOJI.vx2.id}>`} Aguarde estamos atualizando seu anúncio..`, ephemeral: true });
                await UpdateSale(client, produtin, interaction);
            }
        }

        if (inteButton) {
            const [actionButton, produtin, CampoSelect] = interaction.customId.split('_');

            if (actionButton === `EditarCampoProd`) {

                const modal = new ModalBuilder()
                    .setCustomId(`modalEdiitCampo_${produtin}_${CampoSelect}`)
                    .setTitle('Editar Campo')

                const input = new TextInputBuilder()
                    .setCustomId(`inputEditNameCampo`)
                    .setLabel('Nome')
                    .setPlaceholder('Insira o nome do campo')
                    .setStyle(1)
                    .setMaxLength(32)
                    .setRequired(false)

                const input1 = new TextInputBuilder()
                    .setCustomId(`inputEditDescCampo`)
                    .setLabel('Descrição')
                    .setPlaceholder('Insira a descrição do campo')
                    .setStyle(2)
                    .setMaxLength(1024)
                    .setRequired(false)

                const input2 = new TextInputBuilder()
                    .setCustomId(`inputEditPriceCampo`)
                    .setLabel('Valor')
                    .setPlaceholder('ex: 3.90')
                    .setStyle(1)
                    .setRequired(false)


                const input3 = new TextInputBuilder()
                    .setCustomId(`inputEditEmojiCampo`)
                    .setLabel('Emoji')
                    .setPlaceholder('Insira um emoji válido')
                    .setStyle(1)
                    .setRequired(false)

                const row = new ActionRowBuilder().addComponents(input)
                const row1 = new ActionRowBuilder().addComponents(input1)
                const row2 = new ActionRowBuilder().addComponents(input2)
                const row3 = new ActionRowBuilder().addComponents(input3)

                modal.addComponents(row, row1, row2, row3)
                await interaction.showModal(modal);
            }
            if (actionButton === `EstoqueCampo`) {
                await estoqueCampos(CampoSelect, produtin, interaction, client);
            }
            if (actionButton === `VoltarCampoConfig`) {
                await GerenciarCampoProd(produtin, CampoSelect, interaction, client);
            }
            if (actionButton === `ClearStockCampo`) {
                const EMOJI = await obterEmoji();

                const Valor = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}`);
                const EstoqQty = Valor.stock

                if (EstoqQty.length <= 0) {
                    return interaction.reply({ content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} O estoque está já está vazio.`, ephemeral: true });
                }

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`confirmClearStock_${produtin}_${CampoSelect}`)
                            .setLabel('Confirmar')
                            .setEmoji('1296710060851855370')
                            .setStyle(3),
                        new ButtonBuilder()
                            .setCustomId(`VoltarCampoConfig_${produtin}_${CampoSelect}`)
                            .setLabel('Voltar')
                            .setEmoji('1265111710063132732')
                            .setStyle(2)
                    )

                await interaction.update({ content: `${EMOJI.vx14 == null ? `` : `<:${EMOJI.vx14.name}:${EMOJI.vx14.id}>`} Tem certeza? Confirmar esta opção irá apagar todos os produtos em estoque neste campo.`, components: [row], embeds: [], ephemeral: true });
            }
            if (actionButton === `confirmClearStock`) {
                await products.set(`proodutos.${produtin}.Campos.${CampoSelect}.stock`, []);
                await GerenciarCampoProd(produtin, CampoSelect, interaction, client);
            }
            if (actionButton === `estoquefantasma`) {

                const modalaAA = new ModalBuilder()
                    .setCustomId(`modalGhostStock_${produtin}_${CampoSelect}`)
                    .setTitle(`Adicionar estoque fantasma`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('QtyStockGhostInput')
                    .setLabel(`Quantidade`)
                    .setPlaceholder(`Insira aqui a quantidade que deseja adicionar`)
                    .setStyle(1)
                    .setRequired(true)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('typeStockGhostInput')
                    .setLabel(`Produto Fantasma`)
                    .setPlaceholder(`Ex: Abra ticket para resgatar\nCaso não definido, será enviado o default.`)
                    .setStyle(2)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);

                modalaAA.addComponents(firstActionRow3, firstActionRow4);
                await interaction.showModal(modalaAA);
            }
            if (actionButton === `estoqueArquivo`) {
                const EMOJI = await obterEmoji();
                const userid = interaction.user.id
                interaction.reply({
                    content: `Envie o arquivo txt contendo os produtos.`,
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`${userid}_cancelled`)
                                    .setLabel("Cancelar")
                                    .setEmoji('1262641750971908137')
                                    .setStyle(4)
                            )
                    ],
                    ephemeral: true
                });

                const filterArquivo = (msg) => msg.author.id === interaction.user.id && msg.attachments.size > 0 && msg.attachments.first().name.endsWith(".txt");
                const collectorArquivo = interaction.channel.createMessageCollector({ filter: filterArquivo, time: 60000 });

                collectorArquivo.on("collect", async (mensagem) => {
                    const attachment = mensagem.attachments.first();
                    const fileContent = await downloadFile(attachment.url);
                    mensagem.delete();

                    const lines = fileContent.split('\n');

                    let count = 0;
                    for (const line of lines) {
                        const produto = line.trim();
                        if (produto !== "") {
                            await products.push(`proodutos.${produtin}.Campos.${CampoSelect}.stock`, produto);
                            count++;
                        }
                    }

                    collectorArquivo.stop();
                    const item = await products.get(`proodutos.${produtin}.messageid`) || null;
                    const item1 = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}.espera`);
                    const aguardando = item1.length
                    if (item !== null) {
                        await UpdateSale(client, produtin, interaction);
                    }
                    if (aguardando > 0) {
                        await notifyStock(asd, produtin, CampoSelect, interaction);
                    }
                    interaction.editReply({ content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Foram adicionados \`${count}\` itens ao estoque.`, ephemeral: true });
                });

                const filterBotao = (i) => i.customId.startsWith(userid) && i.customId.endsWith("_cancelled") && i.user.id === interaction.user.id;
                const collectorBotao = interaction.channel.createMessageComponentCollector({ filter: filterBotao, time: 60000 });

                collectorBotao.on("collect", (i) => {
                    collectorArquivo.stop();
                    collectorBotao.stop("cancelled");
                    i.deferUpdate();
                    interaction.editReply({ content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} Adição de Produtos cancelada.`, ephemeral: true });
                });

                collectorArquivo.on('end', (collected, reason) => {
                    if (reason === 'time') {
                        interaction.editReply({ content: `O tempo para enviar o arquivo foi encerrado.`, ephemeral: true });
                    }
                });
            }
            if (actionButton === `addestoqueLine`) {
                const modal = new ModalBuilder()
                    .setCustomId(`stockLinemodal_${produtin}_${CampoSelect}`)
                    .setTitle("Adicionar Estoque");

                const text = new TextInputBuilder()
                    .setCustomId("inputLineStock")
                    .setLabel("Adicione um produto por linha")
                    .setStyle(2)
                    .setMaxLength(4000)
                    .setPlaceholder("Ex: Produto1 \nProduto2 \nProduto3 \nProduto4")
                    .setRequired(true);

                modal.addComponents(new ActionRowBuilder().addComponents(text));

                await interaction.showModal(modal);
            }
            if (actionButton === `AdquirirProd`) {
                const tokenmp = await General.get('TokenMP')
                if (!tokenmp) return interaction.reply({ content: `Não é possivel realizar compras no momento, aguarde o dono configurar os pagamentos.`, ephemeral: true })
                const Valor = await products.get(`proodutos.${produtin}.Campos`);
                const primeiraChave = Object.keys(Valor)[0];
                await openCart(produtin, primeiraChave, interaction);
            }
        }

        if (stringsS) {
            const [actionString, produtin, CampoSelect] = interaction.customId.split('_');

            if (actionString === `AdquirirProdSelect`) {
                const tokenmp = await General.get('TokenMP')
                if (!tokenmp) return interaction.reply({ content: `Não é possivel realizar compras no momento, aguarde o dono configurar os pagamentos.`, ephemeral: true })
                const value = interaction.values;
                await openCart(produtin, value, interaction);
                UpdateStock(client, produtin, interaction);
            }
        }

        if (inteButton) {
            const [actButun, produtin, CampoSelect, userInteract, iDCarrin] = interaction.customId.split('_');

            if (actButun === `cancellCompra`) {
                if (interaction.user.id !== userInteract) {
                    return interaction.reply({ content: `Somente o comprador pode interagir.`, ephemeral: true })
                }
                const EMOJI = await obterEmoji();
                carrinhos.delete(`${userInteract}.${iDCarrin}`);
                await interaction.channel.bulkDelete(10)
                interaction.reply({ content: `${EMOJI.vx2 == null ? `` : `<a:${EMOJI.vx2.name}:${EMOJI.vx2.id}>`} Compra cancelada, o carrinho será fechado em 5 segundos.`, ephemeral: true });
                setTimeout(() => {
                    interaction.channel.delete();
                }, 5000)
            }
            if (actButun === `addoneCompra`) {
                if (interaction.user.id !== userInteract) {
                    return interaction.reply({ content: `Somente o comprador pode interagir.`, ephemeral: true });
                }
                const EMOJI = await obterEmoji();

                const Valor = await products.get(`proodutos.${produtin}`);
                const Valor2 = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}`);
                const estoqueCampo = Valor2.stock.length;

                let quantidadeCompra = await carrinhos.get(`${interaction.user.id}.${iDCarrin}.quantidade`);
                if (quantidadeCompra >= estoqueCampo) {
                    return interaction.reply({ content: `${EMOJI.vx7 == null ? `` : `<:${EMOJI.vx7.name}:${EMOJI.vx7.id}>`} A quantidade máxima em estoque é \`${estoqueCampo}\`!`, ephemeral: true });
                }

                interaction.deferUpdate();

                let bannerProd = Valor.Config.banner || '';
                let iconProd = Valor.Config.icon || '';
                const nameCampo = Valor2.name;
                const priceCampo = Valor2.price;


                await carrinhos.add(`${interaction.user.id}.${iDCarrin}.quantidade`, 1);

                const quantytopay = await carrinhos.get(`${userInteract}.${iDCarrin}.quantidade`);
                let priceCompra = Number(priceCampo * quantytopay);


                const cupomAplicado = await carrinhos.get(`${userInteract}.${iDCarrin}.cupom`);
                if (cupomAplicado !== null) {
                    const detalhesCupom = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}.cupom.${cupomAplicado}`);
                    const desconto = detalhesCupom.desconto;


                    const valorDesconto = (Math.floor(desconto * priceCompra) / 100).toFixed(2);
                    priceCompra = priceCompra - valorDesconto;
                }

                await carrinhos.set(`${userInteract}.${iDCarrin}.valor`, Number(priceCompra).toFixed(2));

                const pricetopay = await carrinhos.get(`${userInteract}.${iDCarrin}.valor`);

                const threadbuyMSG = await interaction.guild.channels.cache.get(iDCarrin);
                const messageID = await carrinhos.get(`${userInteract}.${iDCarrin}.messageID`);

                const messageToEdit = await threadbuyMSG.messages.fetch(messageID);

                let embed = new Discord.EmbedBuilder()
                    .setTitle(`Pedido | ${iDCarrin}`)
                    .setDescription(`\u200B`)
                    .addFields(
                        {
                            name: `${EMOJI.vx1 == null ? `` : `<:${EMOJI.vx1.name}:${EMOJI.vx1.id}>`}Carrinho`, value: `\`x${quantytopay}\` - **${nameCampo}**`, inline: true
                        },
                        {
                            name: `${EMOJI.vx9 == null ? `` : `<:${EMOJI.vx9.name}:${EMOJI.vx9.id}>`}Em Estoque`, value: `\`${estoqueCampo}\``, inline: true
                        },
                        {
                            name: `\u200B`, value: `\u200B`, inline: false
                        },
                        {
                            name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`}Valor a ser Pago`, value: `\`R$ ${Number(pricetopay).toFixed(2)}\``, inline: true
                        },
                        {
                            name: `${EMOJI.vx4 == null ? `` : `<:${EMOJI.vx4.name}:${EMOJI.vx4.id}>`}Cupom`, value: `${cupomAplicado == null ? 'Nenhum cupom utilizado' : `\`${cupomAplicado}\``}`, inline: true
                        }
                    )
                    .setColor(General.get('oficecolor.main') || '#FF8201')
                    .setFooter(
                        { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
                    )
                    .setTimestamp();

                if (bannerProd !== '') {
                    embed.setImage(`${bannerProd}`);
                }

                if (iconProd !== '') {
                    embed.setThumbnail(`${iconProd}`);
                }

                await messageToEdit.edit({
                    embeds: [embed]
                });
            }
            if (actButun === `removeoneCompra`) {
                if (interaction.user.id !== userInteract) {
                    return interaction.reply({ content: `Somente o comprador pode interagir.`, ephemeral: true });
                }
                const EMOJI = await obterEmoji();

                const quantidadeCompra = await carrinhos.get(`${interaction.user.id}.${iDCarrin}.quantidade`);
                if (quantidadeCompra === 1) {
                    return interaction.reply({ content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} Esta é a quantidade mínima de compra!`, ephemeral: true });
                }

                interaction.deferUpdate();
                const Valor = await products.get(`proodutos.${produtin}`);
                const Valor2 = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}`);
                const Valor3 = await carrinhos.get(`${userInteract}.${iDCarrin}.cupom`);


                const bannerProd = Valor.Config.banner || '';
                const iconProd = Valor.Config.icon || '';
                const nameCampo = Valor2.name;
                const priceCampo = Valor2.price;
                const estoqueCampo = Valor2.stock.length;


                await carrinhos.substr(`${interaction.user.id}.${iDCarrin}.quantidade`, 1);
                const quantytopay = await carrinhos.get(`${userInteract}.${iDCarrin}.quantidade`);


                const priceCompra = Number(priceCampo * quantytopay);
                let finalPrice = priceCompra;


                if (Valor3 !== null) {
                    const Valor4 = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}.cupom.${Valor3}`);
                    const desconto = Valor4.desconto;

                    const descontu = (Math.floor(desconto * priceCompra) / 100).toFixed(2);
                    finalPrice = priceCompra - descontu;

                    await carrinhos.set(`${userInteract}.${iDCarrin}.valor`, Number(finalPrice).toFixed(2));
                } else {
                    await carrinhos.set(`${userInteract}.${iDCarrin}.valor`, Number(finalPrice).toFixed(2));
                }

                const pricetopay = await carrinhos.get(`${userInteract}.${iDCarrin}.valor`);


                const threadbuyMSG = await interaction.guild.channels.cache.get(iDCarrin);
                const messageID = await carrinhos.get(`${userInteract}.${iDCarrin}.messageID`);
                const messageToEdit = await threadbuyMSG.messages.fetch(messageID);

                const embed = new Discord.EmbedBuilder()
                    .setTitle(`Pedido | ${iDCarrin}`)
                    .setDescription(`\u200B`)
                    .addFields(
                        {
                            name: `${EMOJI.vx1 == null ? `` : `<:${EMOJI.vx1.name}:${EMOJI.vx1.id}>`}Carrinho`,
                            value: `\`x${quantytopay}\` - **${nameCampo}**`,
                            inline: true,
                        },
                        {
                            name: `${EMOJI.vx9 == null ? `` : `<:${EMOJI.vx9.name}:${EMOJI.vx9.id}>`}Em Estoque`,
                            value: `\`${estoqueCampo}\``,
                            inline: true,
                        },
                        {
                            name: `\u200B`,
                            value: `\u200B`,
                            inline: false,
                        },
                        {
                            name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`}Valor a ser Pago`,
                            value: `\`R$ ${Number(pricetopay).toFixed(2)}\``,
                            inline: true,
                        },
                        {
                            name: `${EMOJI.vx4 == null ? `` : `<:${EMOJI.vx4.name}:${EMOJI.vx4.id}>`}Cupom`,
                            value: `${Valor3 == null ? 'Nenhum cupom utilizado' : `\`${Valor3}\``}`,
                            inline: true,
                        },
                    )
                    .setColor(General.get('oficecolor.main') || '#FF8201')
                    .setFooter({
                        text: interaction.guild.name,
                        iconURL: interaction.guild.iconURL({ dynamic: true }),
                    })
                    .setTimestamp();

                if (bannerProd !== '') {
                    embed.setImage(`${bannerProd}`);
                }

                if (iconProd !== '') {
                    embed.setThumbnail(`${iconProd}`);
                }


                await messageToEdit.edit({
                    embeds: [embed],
                });
            }
            if (actButun === `editarquantyCompra`) {

                if (interaction.user.id !== userInteract) {
                    return interaction.reply({ content: `Somente o comprador pode interagir.`, ephemeral: true })
                }

                const modal = new ModalBuilder()
                    .setCustomId(`modalQtyBuy_${produtin}_${CampoSelect}_${userInteract}_${iDCarrin}`)
                    .setTitle('Quantidade')

                const input = new TextInputBuilder()
                    .setCustomId(`inputQtyBuy`)
                    .setLabel('Digite a quantidade')
                    .setPlaceholder('Ex: 27')
                    .setStyle(1)
                    .setMaxLength(32)
                    .setRequired(false)

                const row = new ActionRowBuilder().addComponents(input)

                modal.addComponents(row)
                await interaction.showModal(modal);
            }
            if (actButun === `usarcupomCompra`) {

                if (interaction.user.id !== userInteract) {
                    return interaction.reply({ content: `Somente o comprador pode interagir.`, ephemeral: true })
                }

                const modal = new ModalBuilder()
                    .setCustomId(`modalcupomBuy_${produtin}_${CampoSelect}_${userInteract}_${iDCarrin}`)
                    .setTitle('Cupom de Desconto')

                const input = new TextInputBuilder()
                    .setCustomId(`inputCupomBuy`)
                    .setLabel('Digite seu Cupom')
                    .setStyle(1)
                    .setMaxLength(8)
                    .setRequired(false)

                const row = new ActionRowBuilder().addComponents(input)

                modal.addComponents(row)
                await interaction.showModal(modal);
            }
            if (actButun === `esperarEstoque`) {
                const Aksje = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}.name`);
                const userI = interaction.user.id;

                const listaEspera = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}.espera`) || [];

                if (listaEspera.includes(userI)) {
                    return interaction.update({
                        content: `${interaction.user} você já está na lista de espera para o produto \`${Aksje}\`.\nAguarde o reabastecimento!`,
                        components: [],
                        ephemeral: true
                    });
                }

                await products.push(`proodutos.${produtin}.Campos.${CampoSelect}.espera`, userI);

                interaction.update({
                    content: `Obrigado ${interaction.user}!\nVocê será notificado assim que o estoque do produto \`${Aksje}\` for reabastecido!`,
                    ephemeral: true
                });
            }
            if (actButun === `pagarCompra`) {
                const EMOJI = await obterEmoji();

                const Valor2 = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}.stock`);
                const stoqui = Valor2.length
                if (stoqui <= 0) return interaction.reply({ content: `${EMOJI.vx7 == null ? `` : `<a:${EMOJI.vx7.name}:${EMOJI.vx7.id}>`} O estoque se esgotou`, ephemeral: true })
                const Valor3 = await carrinhos.get(`${interaction.user.id}.${iDCarrin}`);

                const Channel = interaction.channel
                const msg = await Channel.messages.fetch(Valor3.messageID)

                await msg.delete();

                interaction.reply({ content: `${EMOJI.vx2 == null ? `` : `<a:${EMOJI.vx2.name}:${EMOJI.vx2.id}>`} Gerando pagamento..` })

                await finalyPay(produtin, CampoSelect, userInteract, iDCarrin, client, interaction);
                Channel.setName(`💱・Aguardando Pagamento・${interaction.user.id}`);


            }
            if (actButun === `downloadStock`) {
                const EMOJI = await obterEmoji();
                let Valor = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}.stock`);

                try {
                    fs.writeFileSync('estoque.txt', '');

                    for (const conts of Valor) {
                        if (conts !== '') {
                            fs.appendFileSync('estoque.txt', conts + '\n', 'utf-8');
                        }
                    }

                    const attachment = new AttachmentBuilder('estoque.txt');
                    await interaction.reply({ content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Aqui está seu backup.`, files: [attachment], ephemeral: true });
                    fs.unlinkSync('estoque.txt');
                } catch (error) {
                    console.error('Erro ao escrever o arquivo:', error);
                }
            }
            if (actButun === `criarCoupons`) {

                const modal = new ModalBuilder()
                    .setCustomId(`modalCreatecupom_${produtin}_${CampoSelect}`)
                    .setTitle('Criar Cupom')


                const input = new TextInputBuilder()
                    .setCustomId(`inputCupomNameC`)
                    .setLabel('Nome do Cupom')
                    .setPlaceholder('Ex: desconto10')
                    .setStyle(1)
                    .setMaxLength(10)
                    .setRequired(true)

                const input1 = new TextInputBuilder()
                    .setCustomId(`inputCupomPercent`)
                    .setLabel('Quantidade de Desconto (%)')
                    .setPlaceholder('Insira numeros inteiros entre 1 e 99')
                    .setStyle(1)
                    .setMaxLength(2)
                    .setRequired(true)

                const input2 = new TextInputBuilder()
                    .setCustomId(`inputCupomMaxuses`)
                    .setLabel('Maximo de Usos')
                    .setPlaceholder('Insira numeros inteiros, ex: 50 , 100')
                    .setStyle(1)
                    .setMaxLength(4)
                    .setRequired(false)

                const input3 = new TextInputBuilder()
                    .setCustomId(`inputCupomMinValue`)
                    .setLabel('Valor Minimo')
                    .setPlaceholder('Insira o valor minimo de utilização')
                    .setStyle(1)
                    .setMaxLength(8)
                    .setRequired(false)

                const input4 = new TextInputBuilder()
                    .setCustomId(`inputCupomRoleBuy`)
                    .setLabel('Cargo Necessário')
                    .setPlaceholder('Insira o ID do cargo')
                    .setStyle(1)
                    .setRequired(false)


                const row = new ActionRowBuilder().addComponents(input)
                const row1 = new ActionRowBuilder().addComponents(input1)
                const row2 = new ActionRowBuilder().addComponents(input2)
                const row3 = new ActionRowBuilder().addComponents(input3)
                const row4 = new ActionRowBuilder().addComponents(input4)

                modal.addComponents(row, row1, row2, row3, row4)
                await interaction.showModal(modal);
            }
            if (actButun === `cupomCampoProd`) {
                await configCoupons(produtin, CampoSelect, interaction, client);
            }
        }

        if (inteModal) {
            const [actModal, produtin, CampoSelect, userInteract, iDCarrin] = interaction.customId.split('_');

            if (actModal === `modalCreatecupom`) {
                let name = interaction.fields.getTextInputValue('inputCupomNameC');
                let Percent = interaction.fields.getTextInputValue('inputCupomPercent');
                let MaxUses = interaction.fields.getTextInputValue('inputCupomMaxuses');
                let ValueMin = interaction.fields.getTextInputValue('inputCupomMinValue');
                let RoleRequired = interaction.fields.getTextInputValue('inputCupomRoleBuy');

                name = name.replace('.', '');
                name = name.replace(',', '');
                Percent = Percent.replace('.', '');
                Percent = Percent.replace(',', '');
                ValueMin = ValueMin.replace(',', '.');
                MaxUses = MaxUses.replace(',', '');
                MaxUses = MaxUses.replace('.', '');

                const testRole = interaction.guild.roles.cache.get(RoleRequired);

                if (RoleRequired !== '' && !testRole) return interaction.reply({ content: `Insira um cargo válido`, ephemeral: true });
                if (isNaN(Percent)) return interaction.reply({ content: `Insira um número válido de 1 - 99!`, ephemeral: true });
                try {
                    await products.set(`proodutos.${produtin}.Campos.${CampoSelect}.cupom.${name}`, {
                        name: name,
                        desconto: Percent,
                        maxusos: MaxUses == '' ? null : MaxUses,
                        valormin: ValueMin == '' ? null : ValueMin,
                        role: RoleRequired == '' ? null : RoleRequired,
                        usos: 0
                    });

                    interaction.reply({ content: `Cupom \`${name}\` de \`${Percent}%\` foi criado com sucesso!`, ephemeral: true });
                } catch (error) {
                    console.log(error);
                }
            }
            if (actModal === `modalcupomBuy`) {
                const Cupon = interaction.fields.getTextInputValue('inputCupomBuy');
                const Valor = await products.get(`proodutos.${produtin}`);
                const Valor2 = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}`);
                const Valor3 = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}.cupom.${Cupon}`);


                if (Valor3 == null) return interaction.reply({ content: `Este cupom não existe.`, ephemeral: true });
                const descont = Valor3.desconto
                const roleCoupon = Valor3.role || null;
                const nameCoupon = Valor3.name
                const maxUseCoupon = Valor3.maxusos || null;
                const UsesCoupon = Valor3.usos
                const MinimotoBuy = Number(Valor3.valormin).toFixed(2) || null;

                if (maxUseCoupon !== null && UsesCoupon >= maxUseCoupon) return interaction.reply({ content: `Este cupom atingiu seu limite de usos.`, ephemeral: true });
                if (roleCoupon !== null && !interaction.member.roles.cache.has(roleCoupon)) return interaction.reply({ content: `Você não é qualificado para utilizar este cupom.`, ephemeral: true });
                const pricetopay = await carrinhos.get(`${userInteract}.${iDCarrin}.valor`);
                if (MinimotoBuy !== null) {
                    if (MinimotoBuy > pricetopay) return interaction.reply({ content: `Este cupom possui um valor mínimo de \`R$ ${MinimotoBuy}\` para ser utilizado.`, ephemeral: true });
                }


                interaction.deferUpdate();
                const estoqueCampo = Valor2.stock.length
                let bannerProd = Valor.Config.banner || '';
                let iconProd = Valor.Config.icon || '';
                const nameCampo = Valor2.name
                const EMOJI = await obterEmoji();

                const descontu = (Math.floor(descont * pricetopay) / 100).toFixed(2);

                await carrinhos.set(`${userInteract}.${iDCarrin}.cupom`, nameCoupon);
                await carrinhos.set(`${userInteract}.${iDCarrin}.valor`, Number(pricetopay - descontu).toFixed(2));

                const quantytopay = await carrinhos.get(`${userInteract}.${iDCarrin}.quantidade`);
                const valuetopay = await carrinhos.get(`${userInteract}.${iDCarrin}.valor`);

                const threadbuyMSG = await interaction.guild.channels.cache.get(iDCarrin);
                const messageID = carrinhos.get(`${userInteract}.${iDCarrin}.messageID`);
                const messageToEdit = await threadbuyMSG.messages.fetch(messageID);

                const embed = new Discord.EmbedBuilder()
                    .setTitle(`Pedido | ${iDCarrin}`)
                    .setDescription(`\u200B`)
                    .addFields(
                        {
                            name: `${EMOJI.vx1 == null ? `` : `<:${EMOJI.vx1.name}:${EMOJI.vx1.id}>`}Carrinho`, value: `\`x${quantytopay}\` - **${nameCampo}**`, inline: true
                        },
                        {
                            name: `${EMOJI.vx9 == null ? `` : `<:${EMOJI.vx9.name}:${EMOJI.vx9.id}>`}Em Estoque`, value: `\`${estoqueCampo}\``, inline: true
                        },
                        {
                            name: `\u200B`, value: `\u200B`, inline: false
                        },
                        {
                            name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`}Valor a ser Pago`, value: `\`R$ ${Number(valuetopay).toFixed(2)}\``, inline: true
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

                await messageToEdit.edit({
                    embeds: [embed]
                });

            }
            if (actModal === `modalQtyBuy`) {
                let QTy = interaction.fields.getTextInputValue('inputQtyBuy');
                const Valor = await products.get(`proodutos.${produtin}`);
                const Valor2 = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}`);
                const estoqueCampo = Valor2.stock.length;

                QTy = QTy.replace('.', '');
                QTy = QTy.replace(',', '');

                if (isNaN(QTy)) {
                    return interaction.reply({ content: `Insira apenas números.`, ephemeral: true });
                }

                if (QTy > estoqueCampo) {
                    return interaction.reply({ content: `A quantidade máxima em estoque é \`${estoqueCampo}\`.`, ephemeral: true });
                }

                if (QTy <= 0) {
                    return interaction.reply({ content: `A quantidade minima de compra é \`1\`.`, ephemeral: true });
                }

                interaction.deferUpdate();

                let bannerProd = Valor.Config.banner || '';
                let iconProd = Valor.Config.icon || '';
                const nameCampo = Valor2.name;
                const priceCampo = Valor2.price;

                let valorEdit = priceCampo * QTy;


                const cupomAplicado = await carrinhos.get(`${interaction.user.id}.${iDCarrin}.cupom`);
                if (cupomAplicado !== null) {
                    const detalhesCupom = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}.cupom.${cupomAplicado}`);
                    const desconto = detalhesCupom.desconto;


                    const valorDesconto = (Math.floor(desconto * valorEdit) / 100).toFixed(2);
                    valorEdit = valorEdit - valorDesconto;
                }


                await carrinhos.set(`${interaction.user.id}.${iDCarrin}.quantidade`, QTy);
                await carrinhos.set(`${userInteract}.${iDCarrin}.valor`, Number(valorEdit).toFixed(2));
                const EMOJI = await obterEmoji();

                const quantytopay = await carrinhos.get(`${userInteract}.${iDCarrin}.quantidade`);
                const pricetopay = await carrinhos.get(`${userInteract}.${iDCarrin}.valor`);

                const threadbuyMSG = await interaction.guild.channels.cache.get(iDCarrin);
                const messageID = await carrinhos.get(`${userInteract}.${iDCarrin}.messageID`);
                const messageToEdit = await threadbuyMSG.messages.fetch(messageID);


                const embed = new Discord.EmbedBuilder()
                    .setTitle(`Pedido | ${iDCarrin}`)
                    .setDescription(`\u200B`)
                    .addFields(
                        {
                            name: `${EMOJI.vx1 == null ? `` : `<:${EMOJI.vx1.name}:${EMOJI.vx1.id}>`}Carrinho`, value: `\`x${quantytopay}\` - **${nameCampo}**`, inline: true
                        },
                        {
                            name: `${EMOJI.vx9 == null ? `` : `<:${EMOJI.vx9.name}:${EMOJI.vx9.id}>`}Em Estoque`, value: `\`${estoqueCampo}\``, inline: true
                        },
                        {
                            name: `\u200B`, value: `\u200B`, inline: false
                        },
                        {
                            name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`}Valor a ser Pago`, value: `\`R$ ${Number(pricetopay).toFixed(2)}\``, inline: true
                        },
                        {
                            name: `${EMOJI.vx4 == null ? `` : `<:${EMOJI.vx4.name}:${EMOJI.vx4.id}>`}Cupom`, value: `${cupomAplicado == null ? 'Nenhum cupom utilizado' : `\`${cupomAplicado}\``}`, inline: true
                        }
                    )
                    .setColor(General.get('oficecolor.main') || '#FF8201')
                    .setFooter(
                        { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
                    )
                    .setTimestamp();

                if (bannerProd !== '') {
                    embed.setImage(`${bannerProd}`);
                }

                if (iconProd !== '') {
                    embed.setThumbnail(`${iconProd}`);
                }

                await messageToEdit.edit({
                    embeds: [embed]
                });
            }
            if (actModal === `modalEdiitCampo`) {
                let nameE = interaction.fields.getTextInputValue("inputEditNameCampo");
                let descC = interaction.fields.getTextInputValue("inputEditDescCampo");
                let PriceE = interaction.fields.getTextInputValue("inputEditPriceCampo");
                let EmojiI = interaction.fields.getTextInputValue("inputEditEmojiCampo");

                nameE = nameE.replace('.', '');
                nameE = nameE.replace(',', '');
                PriceE = PriceE.replace(',', '.');

                const oldCampo = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}`);

                const estatisticasCampo = oldCampo.estatisticas
                const esperabuyCampo = oldCampo.espera || [];
                const stockbuyCampo = oldCampo.stock || [];

                if (nameE !== '') {
                    const newProd = await products.get(`proodutos.${produtin}.Campos.${nameE}`);
                    if (newProd) {
                        return interaction.reply({ content: `Já existe um campo com este nome \`${nameE}\`.`, ephemeral: true });
                    }

                    await products.set(`proodutos.${produtin}.Campos.${nameE}`, {
                        name: nameE,
                        desc: descC == null || descC === '' ? oldCampo.desc : descC,
                        price: PriceE == null || PriceE === '' ? oldCampo.price : PriceE,
                        emojiCampo: EmojiI == null || EmojiI === '' ? oldCampo.emojiCampo : EmojiI,
                        estatisticas: estatisticasCampo,
                        espera: esperabuyCampo,
                        stock: stockbuyCampo
                    });

                    products.delete(`proodutos.${produtin}.Campos.${CampoSelect}`);
                }

                if (descC !== null && descC !== '') {
                    await products.set(`proodutos.${produtin}.Campos.${CampoSelect}.desc`, descC);
                }
                if (PriceE !== null && PriceE !== '') {
                    PriceE = PriceE.replace(',', '.');
                    await products.set(`proodutos.${produtin}.Campos.${CampoSelect}.price`, Number(PriceE).toFixed(2));
                }
                if (EmojiI !== null && EmojiI !== '') {
                    const emojiRegex = /^<:.+:\d+>$|^<a:.+:\d+>$|^\p{Emoji}$/u;
                    if (!emojiRegex.test(EmojiI)) {
                        return interaction.reply({ content: `Você inseriu um emoji inválido.`, ephemeral: true });
                    } else {
                        await products.set(`proodutos.${produtin}.Campos.${CampoSelect}.emojiCampo`, EmojiI);
                    }
                }

                await GerenciarCampoProd(produtin, nameE || CampoSelect, interaction, client);
            }
            if (actModal === `modalGhostStock`) {
                let qtd = interaction.fields.getTextInputValue('QtyStockGhostInput');
                let produto = interaction.fields.getTextInputValue('typeStockGhostInput');
                const EMOJI = await obterEmoji();

                if (qtd > 100) {
                    return interaction.reply({ content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} O maximo por operação é de \`100\``, ephemeral: true });
                }

                if (isNaN(qtd)) {
                    return interaction.reply({ content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} Voce inseriu um valor inválido para a quantidade de estoque.`, ephemeral: true });
                }

                const arrayItens = [];
                if (produto == '') {
                    for (let i = 0; i < qtd; i++) {
                        const linha = `Contate a admnistração`;
                        arrayItens.push(linha);
                        await products.push(`proodutos.${produtin}.Campos.${CampoSelect}.stock`, ...arrayItens);
                    }
                } else {
                    for (let i = 0; i < qtd; i++) {
                        const linha = `${produto}`;
                        arrayItens.push(linha);
                        await products.push(`proodutos.${produtin}.Campos.${CampoSelect}.stock`, ...arrayItens);
                    }
                }
                const item = await products.get(`proodutos.${produtin}.messageid`) || null;
                const item1 = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}.espera`);
                const aguardando = item1.length

                await interaction.reply({ content: `${EMOJI.vx2 == null ? `` : `<a:${EMOJI.vx2.name}:${EMOJI.vx2.id}>`} Atualizando estoque..`, ephemeral: true }).then(async tt => {

                    if (item !== null) {
                        await tt.edit({ content: `${EMOJI.vx2 == null ? `` : `<a:${EMOJI.vx2.name}:${EMOJI.vx2.id}>`} Sincronizando anúncio..`, ephemeral: true }).then(async msg => {
                            await UpdateSale(client, produtin, interaction);
                        });
                    }

                    if (aguardando > 0) {
                        await tt.edit({ content: `${EMOJI.vx2 == null ? `` : `<a:${EMOJI.vx2.name}:${EMOJI.vx2.id}>`} Notificando usuarios a espera do produto..`, ephemeral: true }).then(async msg => {

                            await notifyStock(qtd, produtin, CampoSelect, interaction);

                        });
                    }
                    await tt.edit({ content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Total de \`${qtd}\` itens adicionados ao estoque.`, ephemeral: true })
                });
            }
            if (actModal === `stockLinemodal`) {
                const content = interaction.fields.getTextInputValue("inputLineStock");
                const EMOJI = await obterEmoji();
                const array = content.split("\n").map(line => line.trim());
                let asd = 0;


                let countStock = [];


                for (const conts of array) {
                    if (conts) {
                        asd++;
                        countStock.push(conts);
                        await products.push(`proodutos.${produtin}.Campos.${CampoSelect}.stock`, conts);
                    }
                }


                await interaction.reply({ content: `${EMOJI.vx2 == null ? `` : `<a:${EMOJI.vx2.name}:${EMOJI.vx2.id}>`} Sincronizando estoque..`, ephemeral: true });

                const item = await products.get(`proodutos.${produtin}.messageid`) || null;
                const item1 = await products.get(`proodutos.${produtin}.Campos.${CampoSelect}.espera`);
                const aguardando = item1.length
                if (item !== null) {
                    await UpdateSale(client, produtin, interaction);
                }
                if (aguardando > 0) {
                    await notifyStock(asd, produtin, CampoSelect, interaction);
                }

                await interaction.editReply({ content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Foram adicionados \`${asd}\` itens ao estoque.`, ephemeral: true });
            }
            if (actModal === `modalAddCampo`) {
                let nameE = interaction.fields.getTextInputValue("inputNameCampo");
                let descC = interaction.fields.getTextInputValue("inputDescCampo");
                let PriceE = interaction.fields.getTextInputValue("inputPriceCampo");
                let emojiI = interaction.fields.getTextInputValue("inputEmojiCampo");

                nameE = nameE.replace('.', '');
                nameE = nameE.replace(',', '');
                PriceE = PriceE.replace(',', '.');

                const nameexist = await products.get(`proodutos.${produtin}.Campos.${nameE}`)

                try {
                    if (nameexist == null) {
                        await products.set(`proodutos.${produtin}.Campos.${nameE}`, {
                            name: nameE,
                            desc: descC,
                            price: Number(PriceE).toFixed(2),
                            emojiCampo: emojiI || '1297811409132064768',
                            cupom: {},
                            estatisticas: {
                                vendas: 0,
                                vendidos: 0,
                                rendeu: Number(0).toFixed(2),
                            },

                            espera: [],
                            stock: []
                        });

                        await GerenciarCampoProd(produtin, nameE, interaction, client);
                    } else {
                        return interaction.reply({ content: `O campo \`${nameE}\` já existe.`, ephemeral: true })
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            if (actModal === `modalEdiitProd`) {
                let nameE = interaction.fields.getTextInputValue("inputEditNameProd");
                let descC = interaction.fields.getTextInputValue("inputEditDescProd");
                let BannerR = interaction.fields.getTextInputValue("inputEditBannerProd");
                let iconN = interaction.fields.getTextInputValue("inputEditIconProd");

                nameE = nameE.replace('.', '');
                nameE = nameE.replace(',', '');

                const oldProd = await products.get(`proodutos.${produtin}`);
                if (!oldProd) {
                    return interaction.reply({ content: "O produto original não foi encontrado.", ephemeral: true });
                }

                const oldProdCampo = oldProd.Campos;
                const oldProdMsgId = oldProd.messageid

                if (nameE !== '') {
                    const newProd = await products.get(`proodutos.${nameE}`);
                    if (newProd) {
                        return interaction.reply({ content: `O produto com o nome \`${nameE}\` já existe.`, ephemeral: true });
                    }

                    await products.set(`proodutos.${nameE}`, {
                        Config: {
                            name: nameE,
                            desc: descC == null || descC === '' ? oldProd.Config.desc : descC,
                            icon: iconN == null || iconN === '' ? oldProd.Config.icon : iconN,
                            banner: BannerR == null || BannerR === '' ? oldProd.Config.banner : BannerR
                        },
                        Campos: oldProdCampo,
                        messageid: oldProdMsgId == null ? [] : oldProdMsgId
                    });

                    products.delete(`proodutos.${produtin}`);
                }

                if (descC !== null && descC !== '') {
                    await products.set(`proodutos.${produtin}.Config.desc`, descC);
                }
                if (BannerR !== null && BannerR !== '') {
                    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
                    if (!urlRegex.test(BannerR)) {
                        return interaction.reply({ content: "Você inseriu uma URL de banner inválida!", ephemeral: true });
                    }
                    await products.set(`proodutos.${produtin}.Config.banner`, BannerR);
                }
                if (iconN !== null && iconN !== '') {
                    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
                    if (!urlRegex.test(iconN)) {
                        return interaction.reply({ content: "Você inseriu uma URL de ícone inválida!", ephemeral: true });
                    }
                    await products.set(`proodutos.${produtin}.Config.icon`, iconN);
                }

                await GerenciarProduto(nameE || produtin, interaction, client);
            }
        }

        if (inteChannellll) {
            const [actionChanel, produtin] = interaction.customId.split('_');

            if (actionChanel === `canalPostSale`) {
                const EMOJI = await obterEmoji();
                await interaction.reply({ content: `${EMOJI.vx2 == null ? `` : `<a:${EMOJI.vx2.name}:${EMOJI.vx2.id}>`} Aguarde..`, ephemeral: true });
                CreateSale(interaction.values[0], produtin, interaction, client);
            }
        }
    }
}
