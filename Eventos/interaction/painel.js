const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, ActivityType } = require("discord.js");
const Discord = require("discord.js")
const { General, BList, tickets, announce, welcomis, products, lojaInfo, EmojIs, Autos } = require("../../Database/index");
const { token } = require("../../token.json")
const { panel, AutoAction } = require("../../Functions/painel");
const { definitions, definicoes1, definicoes2, configgggSales, panelSales, GerenciarProduto, GerenciarCampoProd, obterEmoji, infoAPP, deleteVexyEmojis } = require("../../Functions/definicoes")
const { personalizaar } = require("../../Functions/personalizar")
const { moderation, automoderation } = require("../../Functions/moderation")
const { welcome } = require("../../Functions/boasvindas")
const { painelTicket } = require("../../Functions/configurarTicket")
const { BBlackList } = require("../../Functions/configblacklist")
const { anunciar, createannounce } = require("../../Functions/anunciar.js")
const axios = require("axios");



module.exports = {
    name: "interactionCreate",
    run: async (interaction, client) => {
        const customId = interaction.customId;
        const inteButton = interaction.isButton();
        const inteModal = interaction.isModalSubmit();
        const inteChannellll = interaction.isChannelSelectMenu();
        const strings = interaction.isStringSelectMenu();

        if (inteButton) {

            if (customId === "infoBOOT") {
                await infoAPP(client, interaction);
            }
            if (customId === "installEmojis") {
                if(EmojIs.get('Emojis') !== null) return interaction.reply({ content: "Os emojis já foram instalados.", ephemeral: true });
                await interaction.reply({ content: "Aguarde..", ephemeral: true });

                const emojiArray = [
                    "https://cdn.discordapp.com/emojis/1259069283124903988.webp?size=96&quality=lossless",
                    "https://cdn.discordapp.com/emojis/1296709613235863613.gif?size=96&quality=lossless",
                    "https://cdn.discordapp.com/emojis/1296710060851855370.webp?size=96&quality=lossless",
                    "https://cdn.discordapp.com/emojis/1251441496104636496.webp?size=96&quality=lossless",
                    "https://cdn.discordapp.com/emojis/1276564810321891411.webp?size=96&quality=lossless",
                    "https://cdn.discordapp.com/emojis/1238642246820167700.webp?size=96&quality=lossless",
                    "https://cdn.discordapp.com/emojis/1262641761692549204.webp?size=96&quality=lossless",
                    "https://cdn.discordapp.com/emojis/1276927587083358321.webp?size=96&quality=lossless",
                    "https://cdn.discordapp.com/emojis/1290144734529982474.webp?size=96&quality=lossless",
                    "https://cdn.discordapp.com/emojis/1295500759735074887.webp?size=96&quality=lossless",
                    "https://cdn.discordapp.com/emojis/1284569503744659539.webp?size=96&quality=lossless",
                    "https://cdn.discordapp.com/emojis/1248735913698132122.gif?size=96&quality=lossless",
                    "https://cdn.discordapp.com/emojis/1282571928367923231.webp?size=96&quality=lossless",
                    "https://cdn.discordapp.com/emojis/1286148923605385276.webp?size=96&quality=lossless",
                    "https://cdn.discordapp.com/emojis/1273127418386976788.webp?size=96&quality=lossless",
                    "https://cdn.discordapp.com/emojis/1297714662489591870.webp?size=96&quality=lossless",
                    "https://cdn.discordapp.com/emojis/1301452504592154645.webp?size=96&quality=lossless",
                ];

                try {
                    await Promise.all(emojiArray.map(async (url, index) => {
                        const emojiName = `vx${index + 1}`;
                        const createdEmoji = await interaction.guild.emojis.create({ attachment: url, name: emojiName });
                        await EmojIs.set(`Emojis.${emojiName}`, {
                            id: createdEmoji.id,
                            name: createdEmoji.name
                        });
                    }));

                    const EMOJI = await obterEmoji();

                    await interaction.editReply({ content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Emojis adicionados com sucesso neste servidor! Lembre-se de reiniciar o bot para garantir que as alterações entrem em vigor.`, ephemeral: true });
                } catch (error) {
                    console.error("Erro ao criar emojis:", error);
                    interaction.reply({ content: "❌ Ocorreu um erro ao adicionar os emojis.", ephemeral: true });
                }
            }
            if (customId === "voltarcfgVendas") {
                panelSales(client, interaction);
            }
            if (customId === "automaticosOption") {
                AutoAction(client, interaction);
            }
            if (customId === "personalizarapp") {
                personalizaar(client, interaction);
            }
            if (customId === "moderationn") {
                moderation(client, interaction);
            }
            if (customId === "bemvindou") {
                welcome(client, interaction);
            }
            if (customId === "gerenciarerTicket") {
                painelTicket(client, interaction);
            }
            if (customId === "blackLList") {
                BBlackList(client, interaction);
            }
            if (customId === "config_cargos") {
                definicoes1(client, interaction);
            }
            if (customId === "definiicao") {
                definitions(client, interaction);
            }
            if (customId === "embedDentruu") {
                embedAberta(client, interaction);
            }
            if (customId === "embedForaa") {
                embedSetada(client, interaction);
            }
            if (customId === "config_logs") {
                definicoes2(client, interaction);
            }
            if (customId === "voltarmoderation") {
                moderation(client, interaction);
            }
            if (customId === "voltardefiniicao") {
                definicoes1(client, interaction);
            }
            if (customId === "voltarDefinitions") {
                definitions(client, interaction);
            }
            if (customId === "voltardefiniicao2") {
                definicoes2(client, interaction);
            }
            if (customId === "voltarWelcome") {
                welcome(client, interaction);
            }
            if (customId === "voltar1") {
                panel(client, interaction);
            }
            if (customId === "voltarconfigtickett") {
                painelTicket(client, interaction);
            }
            if (customId === "voltarBllackliist") {
                BBlackList(client, interaction);
            }
            if (customId === "cancelarRedefinir") {
                painelTicket(client, interaction);
            }
            if (customId === "autoModapp") {
                automoderation(client, interaction);
            }
            if (customId === "setnameapp") {
                const modal = new ModalBuilder()
                    .setCustomId('nomebotModal')
                    .setTitle('Configurar Nome do Bot')
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('botName')
                                .setLabel('Nome do Bot')
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder('Insira o novo nome do bot')
                                .setRequired(true)
                        )
                    );

                await interaction.showModal(modal);
            }
            if (customId === "setavatarapp") {
                const modal1 = new ModalBuilder()
                    .setCustomId('avatarbotModal')
                    .setTitle('Configurar Avatar do Bot')
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('botAvatar')
                                .setLabel('URL do Avatar do Bot')
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder('Insira a URL do novo avatar do bot')
                                .setRequired(true)
                        )
                    );

                await interaction.showModal(modal1);
            }
            if (customId === "setbannerapp") {
                const modal1 = new ModalBuilder()
                    .setCustomId('bannerbotModal')
                    .setTitle('Configurar Banner do Bot')
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('botBanner')
                                .setLabel('URL do Banner do Bot')
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder('Insira a URL do novo Banner do bot')
                                .setRequired(true)
                        )
                    );

                await interaction.showModal(modal1);
            }
            if (customId === "setstatusapp") {
                const modal = new ModalBuilder()
                    .setCustomId('statusbotModal')
                    .setTitle('Configurar Atividade do Bot')
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('botActivity')
                                .setLabel('Atividade do Bot')
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder('Insira uma Atividade ao bot')
                                .setRequired(true)
                        )
                    );

                await interaction.showModal(modal);
            }
            if (customId === "setcolormain") {
                const modal = new ModalBuilder()
                    .setCustomId('mainColorModal')
                    .setTitle('Editar Cor Principal')
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('mainColor')
                                .setLabel('Cor Principal')
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder('Insira um código HEX Colour "#ffffff"')
                                .setMaxLength(7)
                                .setRequired(true)
                        )
                    );

                await interaction.showModal(modal);
            }
            if (customId === "setDeescapp") {
                const modal = new ModalBuilder()
                    .setCustomId('mainDescModal')
                    .setTitle('Alterar Descrição')
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('DeesscColor')
                                .setLabel('Descrição do Bot')
                                .setStyle(TextInputStyle.Paragraph)
                                .setPlaceholder('Insira a descrição')
                                .setRequired(true)
                        )
                    );

                await interaction.showModal(modal);
            }
            if (customId === "logTicketsss") {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n- Selecione abaixo o Canal que deseja setar para **Logs De ticket**. \n\n`)
                    .setColor(General.get("oficecolor.main"))
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp();

                const components = [
                    new ActionRowBuilder()
                        .addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId(`logsTicketSelect`)
                                .setPlaceholder(`Clique aqui para selecionar uma opção`)
                                .setMaxValues(1)
                                .setChannelTypes(ChannelType.GuildText)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId(`voltardefiniicao2`).setLabel(`Voltar`).setEmoji(`1265111272312016906`).setStyle(2)
                        )
                ];

                interaction.update({
                    embeds: [embed],
                    components: components
                });
            }
            if (customId === "logsEntradass") {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n - Selecione abaixo o Canal que deseja setar para **Logs De Entradas**. \n\n`)
                    .setColor(General.get("oficecolor.main"))
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp();

                const components = [
                    new ActionRowBuilder()
                        .addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId(`logsEntradasSelect`)
                                .setPlaceholder(`Clique aqui para selecionar uma opção`)
                                .setMaxValues(1)
                                .setChannelTypes(ChannelType.GuildText)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId(`voltardefiniicao2`).setLabel(`Voltar`).setEmoji(`1265111272312016906`).setStyle(2)
                        )
                ];

                interaction.update({
                    embeds: [embed],
                    components: components
                });
            }
            if (customId === "saidalogs") {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n- Selecione abaixo o Canal que deseja setar para **Logs De Saidas**. \n\n`)
                    .setColor(General.get("oficecolor.main"))
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp();

                const components = [
                    new ActionRowBuilder()
                        .addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId(`logsExitSelect`)
                                .setPlaceholder(`Clique aqui para selecionar uma opção`)
                                .setMaxValues(1)
                                .setChannelTypes(ChannelType.GuildText)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId(`voltardefiniicao2`).setLabel(`Voltar`).setEmoji(`1265111272312016906`).setStyle(2)
                        )
                ];

                interaction.update({
                    embeds: [embed],
                    components: components
                });
            }
            if (customId === "loogsBan") {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n- Selecione abaixo o Canal que deseja setar para **Logs De Bans**. \n\n`)
                    .setColor(General.get("oficecolor.main"))
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp();

                const components = [
                    new ActionRowBuilder()
                        .addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId(`logsBanSelect`)
                                .setPlaceholder(`Clique aqui para selecionar uma opção`)
                                .setMaxValues(1)
                                .setChannelTypes(ChannelType.GuildText)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId(`voltardefiniicao2`).setLabel(`Voltar`).setEmoji(`1265111272312016906`).setStyle(2)
                        )
                ];

                interaction.update({
                    embeds: [embed],
                    components: components
                });
            }
            if (customId === "logsBlackliist") {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n- Selecione abaixo o Canal que deseja setar para **Logs Da Blacklist**. \n\n`)
                    .setColor(General.get("oficecolor.main"))
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp();

                const components = [
                    new ActionRowBuilder()
                        .addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId(`logsBlacklistSelect`)
                                .setPlaceholder(`Clique aqui para selecionar uma opção`)
                                .setMaxValues(1)
                                .setChannelTypes(ChannelType.GuildText)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId(`voltardefiniicao2`).setLabel(`Voltar`).setEmoji(`1265111272312016906`).setStyle(2)
                        )
                ];

                interaction.update({
                    embeds: [embed],
                    components: components
                });
            }
            if (customId === "logissGerais") {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n- Selecione abaixo o Canal que deseja setar para **Logs Gerais do Sistema.** \n\n`)
                    .setColor(General.get("oficecolor.main"))
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp();

                const components = [
                    new ActionRowBuilder()
                        .addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId(`logsGeraiiisSelect`)
                                .setPlaceholder(`Clique aqui para selecionar uma opção`)
                                .setMaxValues(1)
                                .setChannelTypes(ChannelType.GuildText)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId(`voltardefiniicao2`).setLabel(`Voltar`).setEmoji(`1265111272312016906`).setStyle(2)
                        )
                ];

                interaction.update({
                    embeds: [embed],
                    components: components
                });
            }
            if (customId === "loogscastigu") {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n- Selecione abaixo o Canal que deseja setar para **Logs De Castigos** \n\n`)
                    .setColor(General.get("oficecolor.main"))
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp();

                const components = [
                    new ActionRowBuilder()
                        .addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId(`logsCastigoSelect`)
                                .setPlaceholder(`Clique aqui para selecionar uma opção`)
                                .setMaxValues(1)
                                .setChannelTypes(ChannelType.GuildText)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId(`voltardefiniicao2`).setLabel(`Voltar`).setEmoji(`1265111272312016906`).setStyle(2)
                        )
                ];

                interaction.update({
                    embeds: [embed],
                    components: components
                });
            }
            if (customId === "logissVendaADeM") {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n- Selecione abaixo o Canal que deseja setar para **Logs De Vendas Admnistrador** \n\n`)
                    .setColor(General.get("oficecolor.main"))
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp();

                const components = [
                    new ActionRowBuilder()
                        .addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId(`logsVendasADMSelect`)
                                .setPlaceholder(`Clique aqui para selecionar uma opção`)
                                .setMaxValues(1)
                                .setChannelTypes(ChannelType.GuildText)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId(`voltardefiniicao2`).setLabel(`Voltar`).setEmoji(`1265111272312016906`).setStyle(2)
                        )
                ];

                interaction.update({
                    embeds: [embed],
                    components: components
                });
            }
            if (customId === "logissVendaPublic") {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n- Selecione abaixo o Canal que deseja setar para **Logs De Entregas** \n\n`)
                    .setColor(General.get("oficecolor.main"))
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp();

                const components = [
                    new ActionRowBuilder()
                        .addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId(`logsEntregasSelect`)
                                .setPlaceholder(`Clique aqui para selecionar uma opção`)
                                .setMaxValues(1)
                                .setChannelTypes(ChannelType.GuildText)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId(`voltardefiniicao2`).setLabel(`Voltar`).setEmoji(`1265111272312016906`).setStyle(2)
                        )
                ];

                interaction.update({
                    embeds: [embed],
                    components: components
                });
            }
            if (customId === "fidibackChannelset") {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n- Selecione abaixo o Canal que deseja setar para **Feedbacks** \n\n`)
                    .setColor(General.get("oficecolor.main"))
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp();

                const components = [
                    new ActionRowBuilder()
                        .addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId(`fidibeckSelect`)
                                .setPlaceholder(`Clique aqui para selecionar uma opção`)
                                .setMaxValues(1)
                                .setChannelTypes(ChannelType.GuildText)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId(`voltardefiniicao2`).setLabel(`Voltar`).setEmoji(`1265111272312016906`).setStyle(2)
                        )
                ];

                interaction.update({
                    embeds: [embed],
                    components: components
                });
            }
            if (customId === "changecargoadmin") {
                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                            .setDescription(`Olá Sr(a)**${interaction.user.username}**\n \n- Selecione abaixo o cargo para **Admnistradores**. \n`)
                            .setColor(General.get("oficecolor.main"))
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new RoleSelectMenuBuilder()
                                    .setCustomId(`AdminroleSelect`)
                                    .setPlaceholder(`Clique aqui para selecionar um Cargo`)
                                    .setMaxValues(1)
                            ),
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder().setCustomId(`voltardefiniicao`).setLabel(`Voltar`).setEmoji(`1265111272312016906`).setStyle(2)
                            )
                    ]
                });
            }
            if (customId === "changecargostaff") {
                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                            .setDescription(`Olá Sr(a)**${interaction.user.username}**\n \n- Selecione abaixo o cargo para o **Suporte**. \n`)
                            .setColor(General.get("oficecolor.main"))
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new RoleSelectMenuBuilder()
                                    .setCustomId(`SupportroleSelect`)
                                    .setPlaceholder(`Clique aqui para selecionar um Cargo`)
                                    .setMaxValues(1)
                            ),
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder().setCustomId(`voltardefiniicao`).setLabel(`Voltar`).setEmoji(`1265111272312016906`).setStyle(2)
                            )
                    ]
                });
            }
            if (customId === "changecargoCostumer") {
                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                            .setDescription(`Olá Sr(a)**${interaction.user.username}**\n \n- Selecione abaixo o cargo para **Clientes**. \n`)
                            .setColor(General.get("oficecolor.main"))
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new RoleSelectMenuBuilder()
                                    .setCustomId(`CostumerroleSelect`)
                                    .setPlaceholder(`Clique aqui para selecionar um Cargo`)
                                    .setMaxValues(1)
                            ),
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder().setCustomId(`voltardefiniicao`).setLabel(`Voltar`).setEmoji(`1265111272312016906`).setStyle(2)
                            )
                    ]
                });
            }
            if (customId === "changecargomembru") {
                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                            .setDescription(`Olá Sr(a)**${interaction.user.username}**\n \n- Selecione abaixo o cargo para **Membros**. \n`)
                            .setColor(General.get("oficecolor.main"))
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new RoleSelectMenuBuilder()
                                    .setCustomId(`MembroroleSelect`)
                                    .setPlaceholder(`Clique aqui para selecionar um Cargo`)
                                    .setMaxValues(1)
                            ),
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder().setCustomId(`voltardefiniicao`).setLabel(`Voltar`).setEmoji(`1265111272312016906`).setStyle(2)
                            )
                    ]
                });
            }
            if (customId === "canallentrada") {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`Olá Sr(a) **${interaction.user.username}**\n \n- Selecione abaixo o Canal que deseja setar como **Canal de Entradas**. \n\n`)
                    .setColor(General.get("oficecolor.main"))
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp();

                const components = [
                    new ActionRowBuilder()
                        .addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId(`chatEntradasSelect`)
                                .setPlaceholder(`Clique aqui para selecionar uma opção`)
                                .setMaxValues(1)
                                .setChannelTypes(ChannelType.GuildText)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId(`voltarWelcome`).setLabel(`Voltar`).setEmoji(`1265111272312016906`).setStyle(2)
                        )
                ];

                interaction.update({
                    embeds: [embed],
                    components: components
                });
            }
            if (customId === "Msgwelcome") {

                const modalBoasvindasEmbed = new ModalBuilder()
                    .setCustomId('welboasMSG')
                    .setTitle(`Personalizar Mensagem`);

                const newnameboteN1 = new TextInputBuilder()
                    .setCustomId('titleBoausvindas')
                    .setLabel(`Título`)
                    .setPlaceholder(`Insira um título`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('descBoausvindas')
                    .setLabel(`Descrição`)
                    .setPlaceholder(`Olá {member}, seja bem-vinda á {guildname}.`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)

                const newnameboteN3 = new TextInputBuilder()
                    .setCustomId('bannerBoausvindas')
                    .setLabel(`Banner`)
                    .setPlaceholder(`Insira uma URL de uma imagem ou GIF`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN5 = new TextInputBuilder()
                    .setCustomId('colorBoausvindas')
                    .setLabel(`COR DO EMBED`)
                    .setPlaceholder(`Insira um código Hex Color, ex: FFFFFF`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)


                const Row1 = new ActionRowBuilder().addComponents(newnameboteN1);
                const Row2 = new ActionRowBuilder().addComponents(newnameboteN2);
                const Row3 = new ActionRowBuilder().addComponents(newnameboteN3);
                const Row5 = new ActionRowBuilder().addComponents(newnameboteN5);

                modalBoasvindasEmbed.addComponents(Row1, Row2, Row3, Row5);
                await interaction.showModal(modalBoasvindasEmbed);
            }
            if (customId === "verMSGG") {
                const channel = interaction.channel
                const welcommm = welcomis.get('welcomeMSG')
                const title = welcomis.get('welcomeMSG.title')
                const description = welcomis.get('welcomeMSG.description')
                const icon = welcomis.get('welcomeMSG.icon')
                const banner = welcomis.get('welcomeMSG.banner')
                const color = welcomis.get('welcomeMSG.color')

                const embedVermsg = new EmbedBuilder()
                    .setAuthor({ name: `Mensagem de Boas-Vindas`, iconURL: 'https://cdn.discordapp.com/emojis/1265508950858793001.webp?size=96&quality=lossless' })
                    .setTitle(`${title}`)
                    .setDescription(`${description}`)

                if (welcommm === null) {
                    interaction.reply({ content: `A mensagem de boas vindas não foi definida ou não foi configurada ainda.`, ephemeral: true });
                }

                if (title !== null) {
                    embedVermsg.setTitle(title)
                } else {
                    return
                }
                if (description !== null) {
                    embedVermsg.setDescription(description)
                } else {
                    return
                }
                if (icon !== null) {
                    embedVermsg.setThumbnail(icon)
                }
                if (banner !== null) {
                    embedVermsg.setImage(banner)
                }
                if (color !== null) {
                    embedVermsg.setColor(color)
                } else {
                    embedVermsg.setColor(General.get('oficecolor.main'))
                }
                try {
                    interaction.reply({ embeds: [embedVermsg], ephemeral: true });
                } catch (error) {
                    console.log(error)
                }
            }
            if (customId === "redefinirBoasvindas") {
                welcomis.delete('welcomeMSG')
                interaction.reply({ content: `Mensagem de boas-vindas foi redefinida com sucesso`, ephemeral: true })
            }
            if (customId == `enviarAnuncio`) {

                const postanuncio = new ChannelSelectMenuBuilder()
                    .setCustomId('canalpostarAnuncio')
                    .setPlaceholder('Clique aqui para selecionar')
                    .setChannelTypes(ChannelType.GuildText)

                const row1 = new ActionRowBuilder().addComponents(postanuncio);

                if (announce.get(`anunciar.aparencia.title`) == null) {
                    return interaction.reply({ content: `Não é posssivel enviar o anuncio, pois o mesmo não foi configurado!`, ephemeral: true })
                }
                if (announce.get(`anunciar.aparencia.description`) == null) {
                    return interaction.reply({ content: `Não é posssivel enviar o anuncio, pois o mesmo não foi configurado!`, ephemeral: true })
                }
                interaction.reply({ components: [row1], content: `Selecione o canal que deseja postar seu anúncio.`, ephemeral: true, })
            }
            if (customId === "addblacklist") {

                const modalBL = new ModalBuilder()
                    .setCustomId('modalBlacklist')
                    .setTitle(`Adicionar Usuario a Blacklist`);

                const idUsuarioBlacklist = new TextInputBuilder()
                    .setCustomId('idUserBlacklist')
                    .setLabel(`ID DO USUARIO`)
                    .setPlaceholder(`Insira aqui o ID do usuario`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const motivosBlacklist = new TextInputBuilder()
                    .setCustomId('motivoBlacklist')
                    .setLabel(`MOTIVO`)
                    .setPlaceholder(`Ex: "Racista", "Homofóbico", "Scammer"...`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const blacklistProva = new TextInputBuilder()
                    .setCustomId('blacklistProvassss')
                    .setLabel(`PROVAS`)
                    .setPlaceholder(`Insira a Url da imagem aqui!`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(500)


                const firstActionRow1 = new ActionRowBuilder().addComponents(idUsuarioBlacklist);
                const firstActionRow2 = new ActionRowBuilder().addComponents(motivosBlacklist);
                const firstActionRow3 = new ActionRowBuilder().addComponents(blacklistProva);

                modalBL.addComponents(firstActionRow1, firstActionRow2, firstActionRow3);
                await interaction.showModal(modalBL);

            }
            if (customId === "cargoaoEntrar") {
                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                            .setDescription(`Olá Sr(a)**${interaction.user.username}**\n \n- **Selecione abaixo o cargo que deseja setar como Cargo Automático ao entrar.** \n`)
                            .setColor(General.get("oficecolor.main"))
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new RoleSelectMenuBuilder()
                                    .setCustomId(`AutoroleSelect`)
                                    .setPlaceholder(`Clique aqui para selecionar um Cargo`)
                                    .setMaxValues(1)
                            ),
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder().setCustomId(`voltarmoderation`).setLabel(`Voltar`).setEmoji(`1265111272312016906`).setStyle(2)
                            )
                    ]
                });
            }
            if (customId === "mensagemAnuncio") {

                const modalMSGanuncio = new ModalBuilder()
                    .setCustomId('modalMensagemAnuncio')
                    .setTitle(`Personalizar Mensagem`);

                const MSGanunciar = new TextInputBuilder()
                    .setCustomId('persoMSGanunciar')
                    .setLabel(`Mensagem do Anuncio`)
                    .setPlaceholder(`Esta mensagem vai acima da Embed`)
                    .setStyle(2)

                const firstActionRow1 = new ActionRowBuilder().addComponents(MSGanunciar);

                modalMSGanuncio.addComponents(firstActionRow1);
                await interaction.showModal(modalMSGanuncio);

            }
            if (customId === "limparMensagemAnuncio") {
                announce.delete("anunciar.mensagem")
                await anunciar(client, interaction)
            }
            if (customId === "aparenciaAnuncio") {

                const val = announce.get('anunciar.aparencia')

                const modalAnuncioEmbed = new ModalBuilder()
                    .setCustomId('interfaceAnuncio')
                    .setTitle(`Personalizar Anúncio`);

                const newnameboteN1 = new TextInputBuilder()
                    .setCustomId('titleAnuncio')
                    .setLabel(`Título`)
                    .setPlaceholder(`Insira um título para seu anúncio`)
                    .setStyle(TextInputStyle.Short)
                    .setValue(val?.title == undefined ? '' : val.title)
                    .setRequired(true)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('descAnuncio')
                    .setLabel(`Descrição`)
                    .setPlaceholder(`Insira uma descrição para seu anúncio`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setValue(val?.description == undefined ? '' : val.description)
                    .setRequired(true)

                const newnameboteN3 = new TextInputBuilder()
                    .setCustomId('bannerAnuncio')
                    .setLabel(`Banner`)
                    .setPlaceholder(`Insira uma URL de uma imagem ou GIF`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN4 = new TextInputBuilder()
                    .setCustomId('iconAnuncio')
                    .setLabel(`Miniatura`)
                    .setPlaceholder(`Insira uma URL de uma imagem ou GIF`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN5 = new TextInputBuilder()
                    .setCustomId('colorANuncio')
                    .setLabel(`COR DO EMBED`)
                    .setPlaceholder(`Insira um código Hex Color, ex: FFFFFF`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)


                const Row1 = new ActionRowBuilder().addComponents(newnameboteN1);
                const Row2 = new ActionRowBuilder().addComponents(newnameboteN2);
                const Row3 = new ActionRowBuilder().addComponents(newnameboteN3);
                const Row4 = new ActionRowBuilder().addComponents(newnameboteN4);
                const Row5 = new ActionRowBuilder().addComponents(newnameboteN5);

                modalAnuncioEmbed.addComponents(Row1, Row2, Row3, Row4, Row5);
                await interaction.showModal(modalAnuncioEmbed);
            }
            if (customId === "limparAparenciaAnuncio") {
                announce.delete('anunciar.aparencia')
                await anunciar(client, interaction)
            }
            if (customId === "limparAparenciaAnuncio") {
                announce.delete('anunciar.aparencia')
                await anunciar(client, interaction)
            }
            if (customId === "removeblacklist") {


                const ggg = BList.get(`usuariosBan`)

                if (ggg == null) {
                    return interaction.reply({ content: `Não existe nenhum usuário na Blacklist para remover.`, ephemeral: true });
                }

                if (ggg == null | Object.keys(ggg).length == 0) {
                    return interaction.reply({ content: `Não existe nenhum usuário na Blacklist para remover.`, ephemeral: true });
                }


                else {

                    const selectMenuBuilder = new Discord.StringSelectMenuBuilder()
                        .setCustomId('tirarBlacklistfunction')
                        .setPlaceholder('Clique aqui para selecionar')
                        .setMaxValues(1)

                    for (const chave in ggg) {
                        const item = ggg[chave];

                        const option = {
                            label: `${item.ID}`,
                            description: `${item.motivo}`,
                            value: item.ID,
                            emoji: `1265528447418105940`
                        };

                        selectMenuBuilder.addOptions(option);

                    }

                    const row1 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('voltarBllackliist')
                                .setLabel('Voltar')
                                .setEmoji('1265111272312016906')
                                .setStyle(2)
                        )
                    selectMenuBuilder.setMaxValues(Object.keys(ggg).length)

                    const style2row = new ActionRowBuilder().addComponents(selectMenuBuilder);
                    try {
                        await interaction.update({ components: [style2row, row1], content: `Selecione o ID do usuário que deseja remover.`, embeds: [], ephemeral: true })
                    } catch (error) {
                    }
                }

            }
        }

        if (inteChannellll) {
            if (customId === "logsTicketSelect") {
                const option = interaction.values[0];
                General.set("logsticketChannel", option);
                definicoes2(client, interaction);
            }
            if (customId === "logsEntradasSelect") {
                const option1 = interaction.values[0];
                General.set("logsbemvindu", option1);
                definicoes2(client, interaction);
            }
            if (customId === "logsExitSelect") {
                const option1 = interaction.values[0];
                General.set("logsaidas", option1);
                definicoes2(client, interaction);
            }
            if (customId === "logsVendasADMSelect") {
                const option1 = interaction.values[0];
                General.set("logsVendasADM", option1);
                definicoes2(client, interaction);
            }
            if (customId === "logsEntregasSelect") {
                const option1 = interaction.values[0];
                General.set("logsVendasPUB", option1);
                definicoes2(client, interaction);
            }
            if (customId === "fidibeckSelect") {
                const option1 = interaction.values[0];
                General.set("VendasFeedback", option1);
                definicoes2(client, interaction);
            }
            if (customId === "logsBanSelect") {
                const option1 = interaction.values[0];
                General.set("logsBan", option1);
                definicoes2(client, interaction);
            }
            if (customId === "logsBlacklistSelect") {
                const option1 = interaction.values[0];
                General.set("logsBlacklist", option1);
                definicoes2(client, interaction);
            }
            if (customId === "logsGeraiiisSelect") {
                const option1 = interaction.values[0];
                General.set("logsGerais", option1);
                definicoes2(client, interaction);
            }
            if (customId === "logsCastigoSelect") {
                const option1 = interaction.values[0];
                General.set("logsCastigo", option1);
                definicoes2(client, interaction);
            }
            if (customId === "chatEntradasSelect") {
                const option1 = interaction.values[0];
                welcomis.set("welcomeMSG.chatentrada", option1);
                welcome(client, interaction);
            }
            if (customId === "canalpostarAnuncio") {
                await interaction.reply({ content: `Aguarde estamos criando seu anúncio...`, ephemeral: true });
                createannounce(interaction, interaction.values[0], client)

                setTimeout(() => {
                    interaction.editReply({ content: `Anúncio criado com sucesso!`, ephemeral: true });
                }, 1000)

            }
        }

        if (interaction.type === InteractionType.ModalSubmit) {

            const hexColorRegex = /^#?([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;

            if (customId === 'mainColorModal') {
                const mainColouur = interaction.fields.getTextInputValue('mainColor');

                if (!hexColorRegex.test(mainColouur)) {

                    return interaction.reply({ content: `Código Hex Color \`${mainColouur}\` está inválido, Pegue um código HEX válido [neste site.](https://www.google.com/search?q=color+picker&oq=color+picker) `, ephemeral: true });
                } else {
                    General.set(`oficecolor.main`, mainColouur)
                }

                personalizaar(client, interaction);
            }
            if (customId === 'nomebotModal') {
                const botName = interaction.fields.getTextInputValue('botName');

                try {
                    await client.user.setUsername(botName);
                    personalizaar(client, interaction);
                } catch (error) {
                    if (error.code === 50035 && error.rawError?.errors?.username?._errors[0]?.code === 'USERNAME_TOO_MANY_USERS') {
                        await interaction.reply({ content: `Muitas aplicações já possui este nome de usuário.`, ephemeral: true });
                    } else {
                        await interaction.reply({ content: `Erro ao Alterar o nome do APP.`, ephemeral: true });
                    }
                }
            }
            if (customId === 'avatarbotModal') {
                const botAvatar = interaction.fields.getTextInputValue('botAvatar');

                try {
                    await client.user.setAvatar(botAvatar);
                    personalizaar(client, interaction);
                } catch (error) {
                    await interaction.reply({ content: `Erro ao atualizar o Avatar do APP`, ephemeral: true });
                }
            }
            if (customId === 'bannerbotModal') {
                const botBanner = interaction.fields.getTextInputValue('botBanner');

                try {
                    await client.user.setBanner(botBanner);
                    personalizaar(client, interaction);
                } catch (error) {
                    await interaction.reply({ content: `Erro ao atualizar o Banner do APP`, ephemeral: true });
                }
            }
            if (customId === 'mainDescModal') {
                const botDDDDEsc = interaction.fields.getTextInputValue('DeesscColor');

                url = 'https://discord.com/api/v10/applications/@me',
                    data = {
                        description:
                            `${botDDDDEsc}`,
                    }
                try {
                    axios.patch(url, data, {
                        headers: {
                            Authorization: 'Bot ' + token,
                            'Content-Type': 'application/json',
                        },
                    });
                    definitions(client, interaction);
                } catch (error) {
                    console.log(error)
                }
            }
            if (customId === 'statusbotModal') {
                const botActivity = interaction.fields.getTextInputValue('botActivity');

                try {
                    await client.user.setActivity({
                        name: `${botActivity}`,
                        type: ActivityType.Custom
                      });
                    await General.set(`APP.STATUS`, botActivity)
                    await interaction.reply({ content: `Atividade do APP Alterada com Sucesso`, ephemeral: true });
                } catch (error) {
                    await interaction.reply({ content: `Erro ao atualizar a Atividade do APP`, ephemeral: true });
                    console.log(error)
                }
            }
        }

        if (interaction.isRoleSelectMenu() && interaction.customId === "AdminroleSelect") {
            const option = interaction.values[0];
            General.set("admrole", option);
            definicoes1(client, interaction);
        }

        if (interaction.isRoleSelectMenu() && interaction.customId === "SupportroleSelect") {
            const option = interaction.values[0];
            General.set("staffrole", option);
            definicoes1(client, interaction);
        }
        if (interaction.isRoleSelectMenu() && interaction.customId === "CostumerroleSelect") {
            const option = interaction.values[0];
            General.set("costumeRrole", option);
            definicoes1(client, interaction);
        }

        if (interaction.isRoleSelectMenu() && interaction.customId === "MembroroleSelect") {
            const option = interaction.values[0];
            General.set("rolemember", option);
            definicoes1(client, interaction);
        }

        if (interaction.isModalSubmit() && interaction.customId === "modalBlacklist") {
            let idBLuser = interaction.fields.getTextInputValue('idUserBlacklist');
            let motivosBL = interaction.fields.getTextInputValue('motivoBlacklist');
            let blackkkProvas = interaction.fields.getTextInputValue('blacklistProvassss');

            if (BList.get(`usuariosBan.${idBLuser}`) !== null) {
                return interaction.reply({ content: `O Usuário ja está na Blacklist!`, ephemeral: true });
            }

            if (idBLuser !== '') {
                BList.set(`usuariosBan.${idBLuser}.ID`, idBLuser)
            }

            if (motivosBL !== '') {
                BList.set(`usuariosBan.${idBLuser}.motivo`, motivosBL)
            }

            if (blackkkProvas !== '') {
                const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
                if (!urlRegex.test(blackkkProvas)) {
                    return interaction.reply({ content: `Você inseriu uma URL inválida!`, ephemeral: true });
                } else {
                    BList.set(`usuariosBan.${idBLuser}.provas`, blackkkProvas)
                }
            }

            try {
                await interaction.guild.members.ban(idBLuser)
                interaction.reply({ content: `Usuário foi banido e adicionado a Blacklist com Sucesso.`, ephemeral: true });

            } catch (error) {
                console.error(error);
                interaction.reply({ content: `Não possui permissões para banir este usuário!`, ephemeral: true });
            }


            BBlackList(client, interaction)
        }

        if (customId === "tirarBlacklistfunction") {
            const valordelete = interaction.values
            for (const iterator of valordelete) {
                BList.delete(`usuariosBan.${iterator}`)
            }
            await BBlackList(client, interaction)
            interaction.followUp({ content: `Usuário removido com sucesso!`, ephemeral: true });
        }

        if (interaction.isRoleSelectMenu() && interaction.customId === "AutoroleSelect") {
            const option = interaction.values[0];
            General.set("automod.autorole", option);
            moderation(client, interaction);
        }

        if (interaction.isModalSubmit() && interaction.customId === "modalMensagemAnuncio") {

            let mensagemAnunciar = interaction.fields.getTextInputValue('persoMSGanunciar');


            if (mensagemAnunciar !== null) {
                announce.set("anunciar.mensagem", mensagemAnunciar);
            }

            await anunciar(client, interaction)

        }

        if (interaction.isModalSubmit() && interaction.customId === "interfaceAnuncio") {

            let TITULO = interaction.fields.getTextInputValue('titleAnuncio');
            let DESC = interaction.fields.getTextInputValue('descAnuncio');
            let ICON = interaction.fields.getTextInputValue('iconAnuncio')
            let BANNER = interaction.fields.getTextInputValue('bannerAnuncio');
            let COREMBED = interaction.fields.getTextInputValue('colorANuncio');

            if (TITULO.length > 256) {
                return interaction.reply({ content: `O título não pode ter mais de 256 caracteres!`, ephemeral: true });
            }

            if (COREMBED !== '') {
                const hexColorRegex = /^#?([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
                if (!hexColorRegex.test(COREMBED)) {

                    return interaction.reply({ content: `Código Hex Color \`${COREMBED}\` inválido, tente pegar [nesse site.](https://www.google.com/search?q=color+picker&oq=color+picker) `, ephemeral: true });
                } else {
                    announce.set(`anunciar.aparencia.color`, COREMBED)
                }
            }

            if (ICON !== '') {
                const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
                if (!urlRegex.test(ICON)) {

                    return interaction.reply({ message: dd, content: `Você inseriu uma URL inválida, tente outra!`, ephemeral: true });
                } else {
                    announce.set(`anunciar.aparencia.icon`, ICON)
                }
            }

            if (BANNER !== '') {
                const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
                if (!urlRegex.test(BANNER)) {

                    return interaction.reply({ message: dd, content: `Você inseriu uma URL inválida, tente outra!`, ephemeral: true });
                } else {
                    announce.set(`anunciar.aparencia.banner`, BANNER)
                }
            }

            if (TITULO !== '') {
                announce.set(`anunciar.aparencia.title`, TITULO)
            }

            if (DESC !== '') {
                announce.set(`anunciar.aparencia.description`, DESC)
            }

            anunciar(client, interaction)


        }

        if (interaction.isModalSubmit() && interaction.customId === "welboasMSG") {

            let TITULO = interaction.fields.getTextInputValue('titleBoausvindas');
            let DESC = interaction.fields.getTextInputValue('descBoausvindas');
            let BANNER = interaction.fields.getTextInputValue('bannerBoausvindas');
            let COREMBED = interaction.fields.getTextInputValue('colorBoausvindas');

            if (TITULO.length > 256) {
                return interaction.reply({ content: `O título não pode ter mais de 256 caracteres!`, ephemeral: true });
            }
            if (DESC.length > 1024) {
                return interaction.reply({ content: `A descrição não pode ter mais de 1024 caracteres!`, ephemeral: true });
            }

            if (COREMBED !== '') {
                const hexColorRegex = /^#?([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
                if (!hexColorRegex.test(COREMBED)) {

                    return interaction.reply({ content: `Código Hex Color \`${COREMBED}\` inválido, tente pegar [nesse site.](https://www.google.com/search?q=color+picker&oq=color+picker) `, ephemeral: true });
                } else {
                    welcomis.set(`welcomeMSG.color`, COREMBED)
                }
            }

            if (BANNER !== '') {
                const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
                if (!urlRegex.test(BANNER)) {

                    return interaction.reply({ message: dd, content: `Você inseriu uma URL inválida, tente outra!`, ephemeral: true });
                } else {
                    welcomis.set(`welcomeMSG.banner`, BANNER)
                }
            }

            if (TITULO !== '') {
                welcomis.set(`welcomeMSG.title`, TITULO)
            }

            if (DESC !== '') {
                welcomis.set(`welcomeMSG.description`, DESC)
            }

            welcome(client, interaction)


        }

        if (interaction.isButton()) {
            const val = General.get('automod')
            if (customId === "nomisprohibited") {

                const modal = new ModalBuilder()
                    .setCustomId('nickAutomod')
                    .setTitle('Bloquear Nomes')

                const newnameboteN1 = new TextInputBuilder()
                    .setCustomId('nickProibi')
                    .setLabel('Nomes que deseja bloquear')
                    .setPlaceholder(`Digite separado por vírgulas\nEx: joao, maria, julio...\n "off" Para desligar`)
                    .setStyle(2)
                    .setRequired(true)

                const row = new ActionRowBuilder().addComponents(newnameboteN1);

                modal.addComponents(row);
                await interaction.showModal(modal);
            }
            if (customId === "proibidoStattus") {

                const modal = new ModalBuilder()
                    .setCustomId('statusAutomod')
                    .setTitle('Status que deseja bloquear')

                const newnameboteN1 = new TextInputBuilder()
                    .setCustomId('statsProibi')
                    .setLabel('Status Proibidos')
                    .setPlaceholder(`Digite separado por vírgulas\nEx: loja, https://...\n "off" Para desligar `)
                    .setStyle(2)
                    .setRequired(true)

                const row = new ActionRowBuilder().addComponents(newnameboteN1);

                modal.addComponents(row);
                await interaction.showModal(modal);
            }
            if (customId === "diassminin") {

                const modal = new ModalBuilder()
                    .setCustomId('diasAutomod')
                    .setTitle('Dias Mínimos Para entrar')

                const newnameboteN1 = new TextInputBuilder()
                    .setCustomId('diasProibi')
                    .setLabel('Quantidade Mínima de dias')
                    .setPlaceholder(` "3" - "off" Para desligar`)
                    .setStyle(1)
                    .setRequired(true)

                const row = new ActionRowBuilder().addComponents(newnameboteN1);

                modal.addComponents(row);
                await interaction.showModal(modal);
            }
            if (customId === "MsssgggBloq") {

                const modal = new ModalBuilder()
                    .setCustomId('msgsAutomod')
                    .setTitle('Definir Palavras Bloqueadas')

                const newnameboteN1 = new TextInputBuilder()
                    .setCustomId('msgsProibi')
                    .setLabel('Palavras Leves')
                    .setPlaceholder(`Digite separado por vírgulas\nEx: Divulgação, Xingamentos...\nDigite "off" Para desligar`)
                    .setStyle(2)
                    .setRequired(true)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('msgs2Proibi')
                    .setLabel('Palavras Ofensivas')
                    .setPlaceholder(`Digite separado por vírgulas\nEx: Racismo, Homofobia...\nDigite "off" Para desligar`)
                    .setStyle(2)
                    .setRequired(true)

                const newnameboteN3 = new TextInputBuilder()
                    .setCustomId('timeCastigo')
                    .setLabel('Tempo TimeOut (Palavras Leves)')
                    .setPlaceholder(`"10" - Digite "off" Para desligar`)
                    .setStyle(1)
                    .setRequired(true)

                const row = new ActionRowBuilder().addComponents(newnameboteN1);
                const row2 = new ActionRowBuilder().addComponents(newnameboteN2);
                const row3 = new ActionRowBuilder().addComponents(newnameboteN3);

                modal.addComponents(row, row2, row3);
                await interaction.showModal(modal);
            }
        }
        if (interaction.isModalSubmit()) {
            if (customId === "nickAutomod") {
                const names = interaction.fields.getTextInputValue('nickProibi')

                await General.set("automod.antifake.nomes", names === "off" ? [] : names.split(", "));
                interaction.reply({ content: `A lista de Nomes proibidos foi definida.`, ephemeral: true });
            }
            if (customId === "statusAutomod") {
                const status = interaction.fields.getTextInputValue('statsProibi')

                await General.set("automod.antifake.status", status === "off" ? [] : status.split(", "));
                interaction.reply({ content: `A lista de Status proibidos foi definida.`, ephemeral: true });
            }
            if (customId === "diasAutomod") {
                const dias = interaction.fields.getTextInputValue('diasProibi')

                if (isNaN(dias) || dias !== "off") return interaction.reply({ content: `Insira apenas numeros!`, ephemeral: true });

                await General.set("automod.antifake.dias", dias === "off" ? null : Number(dias).toFixed(2));
                interaction.reply({ content: `Dia(s) Minimos para entrar no servidor foi definido para \`${dias}\``, ephemeral: true });
            }
            if (customId === "msgsAutomod") {
                const leves = interaction.fields.getTextInputValue('msgsProibi')
                const ofensivas = interaction.fields.getTextInputValue('msgs2Proibi')
                const tempo = interaction.fields.getTextInputValue('timeCastigo')

                if (isNaN(tempo) || tempo === "off") return interaction.reply({ content: `Insira apenas numeros no tempo de timeout!`, ephemeral: true });

                await General.set("automod.palavras", {
                    "leves": leves === "off" ? [] : leves.split(", "),
                    "ofensivas": ofensivas === "off" ? [] : ofensivas.split(", "),
                    "tempo": tempo === "off" || leves === "off" ? null : Number(tempo).toFixed(2)
                });
                interaction.reply({ content: `Configurações de mensagens proibida foi definida com sucesso!`, ephemeral: true });
            }
        }

        if (inteButton) {
            if (customId === "configPayments") {
                configgggSales(client, interaction);
            }
            if (customId === "voltarDefinitionsSales") {
                configgggSales(client, interaction);
            }
            if (customId === "seTokenMP") {

                const modal = new ModalBuilder()
                    .setCustomId('modalTokenMP')
                    .setTitle('Definições de Pagamentos')

                const input = new TextInputBuilder()
                    .setCustomId('keyMPacess')
                    .setLabel('Acess Token')
                    .setPlaceholder('Ex: APP_USR-2490037217407474-041415')
                    .setStyle(TextInputStyle.Short)

                const row = new ActionRowBuilder().addComponents(input)
                modal.addComponents(row)
                await interaction.showModal(modal)
            }
            if (customId === "gerenciarerVEndaa") {
                await panelSales(client, interaction)
            }
            if (customId === "criarPProdct") {

                const modalaAA = new ModalBuilder()
                    .setCustomId('modaladdProdct')
                    .setTitle(`Criar Produto`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('nnameProduct')
                    .setLabel(`Nome do Produto`)
                    .setPlaceholder(`Insira um nome para seu produto`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('ddescProduct')
                    .setLabel(`Descrição do Produto`)
                    .setPlaceholder(`Insira uma descrição para seu produto`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(1024)

                const newnameboteN5 = new TextInputBuilder()
                    .setCustomId('iiconProduct')
                    .setLabel(`Icon do Produto (OPCIONAL)`)
                    .setPlaceholder(`Insira uma URL válida`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN6 = new TextInputBuilder()
                    .setCustomId('bbanerProduct')
                    .setLabel(`Banner do Produto (OPCIONAL)`)
                    .setPlaceholder(`Insira uma URL válida`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN5);
                const firstActionRow7 = new ActionRowBuilder().addComponents(newnameboteN6);



                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow6, firstActionRow7);
                await interaction.showModal(modalaAA);

            }
            if (customId === "delletePProdct") {

                const produtosData = products.get("proodutos");
                const allSelectMenus = [];

                let optionsCount = 0;
                let currentSelectMenuBuilder;

                if (produtosData == null || Object.keys(produtosData).length == 0) {
                    return interaction.reply({ content: `Não existe nenhum produto criado para deletar.`, ephemeral: true });
                }

                for (const produto in produtosData) {
                    const config = produtosData[produto].Config;
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
                            .setCustomId(`removeproduto_${Math.floor(optionsCount / 25) + 1}`)
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
                        .setCustomId('voltarcfgVendas')
                        .setLabel('Voltar')
                        .setEmoji('1265111272312016906')
                        .setStyle(2)
                );

                await interaction.update({
                    embeds: [],
                    components: [...rows, row4],
                    content: `Selecione o produto que deseja deletar.`,
                });
            }
            if (customId === "protecaoSystem") {
                const protectSystem = await General.get(`SystemProtect`);

                if (protectSystem == false) {
                    await General.set(`SystemProtect`, true);
                } else {
                    await General.set(`SystemProtect`, false);
                }

                await moderation(client, interaction);
            }
            if (customId === `autolockSettings`) {
                const modala = new ModalBuilder()
                    .setCustomId('modalautolock')
                    .setTitle(`Configurar Auto-Lock`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('inputhoraAbertura')
                    .setLabel(`Horário de Abertura`)
                    .setPlaceholder(`Exemplo: 15:30`)
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(5)
                    .setRequired(true)

                const newnameboteN1 = new TextInputBuilder()
                    .setCustomId('inputhoraFechamento')
                    .setLabel(`Horário de Fechamento`)
                    .setPlaceholder(`Exemplo: 18:30`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(5)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('inputcanaisAutolock')
                    .setLabel(`Canais Afetados`)
                    .setPlaceholder(`Insira o id dos canais linha por linha`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)


                const Row = new ActionRowBuilder().addComponents(newnameboteN);
                const Row1 = new ActionRowBuilder().addComponents(newnameboteN1);
                const Row2 = new ActionRowBuilder().addComponents(newnameboteN2);

                modala.addComponents(Row, Row1, Row2);
                await interaction.showModal(modala);
            }
            if (customId == 'autoMsgs') {
                const modala = new ModalBuilder()
                    .setCustomId('modalMessagauto')
                    .setTitle(`Configurar Mensagem Automática`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('inputlabelButton')
                    .setLabel(`Nome do Botão`)
                    .setPlaceholder(`Insira o nome do botão`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN1 = new TextInputBuilder()
                    .setCustomId('inputcanalMsgauto')
                    .setLabel(`ID do Canal`)
                    .setPlaceholder(`Insira o ID do canal que deseja`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('inputMsgauto')
                    .setLabel(`Insira sua mensagem`)
                    .setPlaceholder(`Insira sua mensagem automática`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)

                const newnameboteN3 = new TextInputBuilder()
                    .setCustomId('inputLinkbutton')
                    .setLabel(`URl do Botão`)
                    .setPlaceholder(`Caso queira um botão, coloque a URL caso contrário deixe vazio.`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN4 = new TextInputBuilder()
                    .setCustomId('inputemojibuttonAuto')
                    .setLabel(`Emoji do Botão`)
                    .setPlaceholder(`insira o ID do emoji, caso contrário será definido o padrão.`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)


                const Row = new ActionRowBuilder().addComponents(newnameboteN);
                const Row1 = new ActionRowBuilder().addComponents(newnameboteN1);
                const Row2 = new ActionRowBuilder().addComponents(newnameboteN2);
                const Row3 = new ActionRowBuilder().addComponents(newnameboteN3);
                const row4 = new ActionRowBuilder().addComponents(newnameboteN4);

                modala.addComponents(Row1, Row2, Row, Row3, row4);
                await interaction.showModal(modala);
            }
            if (customId == 'repostSellAuto') {
                const modala = new ModalBuilder()
                    .setCustomId('modalTimeRepost')
                    .setTitle(`Configuração Repostagem Automática`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('inputTimeRepostAnns')
                    .setLabel(`Horário de Repostagem`)
                    .setPlaceholder(`Ex: 19:35 ou 6:30`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)


                const Row = new ActionRowBuilder().addComponents(newnameboteN);

                modala.addComponents(Row);
                await interaction.showModal(modala);
            }
            if (customId === 'deleteEmojis') {
                if(EmojIs.get('Emojis') == null) return interaction.reply({content:`Os emojis já foram excluidos.`,ephemeral:true});
                await interaction.reply({content:`aguarde..`,ephemeral:true});
            
                await deleteVexyEmojis(client);
                await interaction.editReply({ content: 'Emojis deletados com sucesso.', ephemeral: true });
            }
        }
        if (strings) {
            const [action, produtin] = interaction.customId.split('_');
            if (interaction.customId.startsWith('removeproduto_')) {
                let produtin = interaction.values[0];
                products.delete(`proodutos.${produtin}`);
                await panelSales(client, interaction);

            }
            if (interaction.customId.startsWith('configproduto_')) {
                let produtin = interaction.values[0]
                await GerenciarProduto(produtin, interaction, client);
            }
            if (action === 'configCampoproduto') {
                let nameE = interaction.values[0]
                await GerenciarCampoProd(produtin, nameE, interaction, client);
            }
            if (action === 'removeCampoproduto') {
                let campu = interaction.values[0]
                products.delete(`proodutos.${produtin}.Campos.${campu}`);
                await GerenciarProduto(produtin, interaction, client);
            }
        }

        if (inteModal) {
            if (customId == "modalTokenMP") {
                const tokenmp = interaction.fields.getTextInputValue('keyMPacess')

                if (tokenmp) {

                    await General.set(`TokenMP`, tokenmp);
                    configgggSales(client, interaction);
                }
            }
            if (customId == 'modaladdProdct') {

                let nome = interaction.fields.getTextInputValue('nnameProduct');
                let desc = interaction.fields.getTextInputValue('ddescProduct');;
                let icon = interaction.fields.getTextInputValue('iiconProduct');
                let banner = interaction.fields.getTextInputValue('bbanerProduct');

                nome = nome.replace('.', '');
                nome = nome.replace(',', '');

                if (products.get(`proodutos.${nome}`) !== null) {
                    return interaction.reply({ content: `O produto \`${nome}\` já existe!`, ephemeral: true })
                }

                products.set(`proodutos.${nome}`, {
                    Config: {
                        name: nome,
                        desc: desc,
                        icon: `${icon == null ? "" : icon}`,
                        banner: `${banner == null ? "" : banner}`
                    },
                    Campos: {}
                });

                await GerenciarProduto(nome, interaction, client);
            }
            if (customId == 'modalautolock') {
                let abertura = interaction.fields.getTextInputValue('inputhoraAbertura');
                let fechamento = interaction.fields.getTextInputValue('inputhoraFechamento');
                let canaisAfetados = interaction.fields.getTextInputValue('inputcanaisAutolock');

                const EMOJI = await obterEmoji();
                const guildRes = interaction.guild.id;

                function isValidTime(time) {
                    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
                    return regex.test(time);
                }

                if (!isValidTime(abertura) || !isValidTime(fechamento)) {
                    return interaction.reply({
                        content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} Os horários de abertura e fechamento devem estar no formato correto (HH:MM) e entre 00:00 e 23:59.`,
                        ephemeral: true
                    });
                }

                const array = canaisAfetados.split("\n").map(line => line.trim());
                let channelss = [];
                for (const conts of array) {
                    if (conts) {
                        channelss.push(conts);
                    }
                }

                Autos.set(`autolock.${guildRes}`, {
                    abrir: abertura,
                    fechar: fechamento,
                    channels: channelss,
                    serverid: guildRes
                });

                interaction.reply({
                    content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Sistema de auto-lock foi devidamente configurado.`,
                    ephemeral: true
                });
            }
            if (customId == 'modalMessagauto') {
                let CanalFluxo = interaction.fields.getTextInputValue('inputcanalMsgauto');
                let MensagemTosend = interaction.fields.getTextInputValue('inputMsgauto');;
                let LabelButon = interaction.fields.getTextInputValue('inputlabelButton');
                let UrlButton = interaction.fields.getTextInputValue('inputLinkbutton');
                let EmojiMsg = interaction.fields.getTextInputValue('inputemojibuttonAuto');

                const testchannel = await interaction.guild.channels.cache.get(CanalFluxo);

                if (!testchannel) return interaction.reply({ content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} O canal escolhido não foi encontrado`, ephemeral: true })
                const EMOJI = await obterEmoji();
                Autos.set(`AutoMsg.${CanalFluxo}`, {
                    Channel: CanalFluxo,
                    Label: null,
                    mesage: MensagemTosend,
                    UrlButon: null,
                    EmojButon: null
                });

                if (UrlButton !== '') {
                    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
                    if (!urlRegex.test(UrlButton)) {
                        return interaction.reply({ content: `Você inseriu uma URL inválida!`, ephemeral: true });
                    } else {
                        Autos.set(`AutoMsg.${CanalFluxo}.UrlButon`, UrlButton)
                        if (EmojiMsg !== '') {
                            Autos.set(`AutoMsg.${CanalFluxo}.EmojButon`, EmojiMsg)
                        } else {
                            Autos.set(`AutoMsg.${CanalFluxo}.EmojButon`, '1276927587083358321');
                        }
                        if (LabelButon !== '') Autos.set(`AutoMsg.${CanalFluxo}.Label`, LabelButon);
                    }
                }

                const butonBoll = await Autos.get(`AutoMsg.${CanalFluxo}.UrlButon`)
                if (!butonBoll) {
                    testchannel.send({ content: `${MensagemTosend}` }).then((msg) => {
                        Autos.set(`AutoMsg.${CanalFluxo}.messageid`, msg.id);
                    });
                } else {

                    const Lubel = await Autos.get(`AutoMsg.${CanalFluxo}.Label`);

                    const butt = new ButtonBuilder()
                        .setURL(`${butonBoll}`)
                        .setStyle(5)
                        .setEmoji(Autos.get(`AutoMsg.${CanalFluxo}.EmojButon`))

                    if (Lubel !== null) butt.setLabel(Lubel);

                    const ButtonAuto = new ActionRowBuilder().addComponents(butt)

                    testchannel.send({ content: `${MensagemTosend}`, components: [ButtonAuto] }).then((msg) => {
                        Autos.set(`AutoMsg.${CanalFluxo}.messageid`, msg.id);
                    });
                }

                interaction.reply({ content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Mensagem automática configurada com sucesso!`, ephemeral: true })

            }
            if (customId == 'modalTimeRepost') {
                let TimeRepost = interaction.fields.getTextInputValue('inputTimeRepostAnns');
                const EMOJI = await obterEmoji();

                function isValidTime(time) {
                    const regex = /^(0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
                    return regex.test(time);
                }

                if (!isValidTime(TimeRepost)) {
                    return interaction.reply({
                        content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} Os horários de abertura e fechamento devem estar no formato correto (HH:MM) e entre 00:00 e 23:59.`,
                        ephemeral: true
                    });
                }
                Autos.set(`AutoAnnounce.repostTime`, TimeRepost);

                interaction.reply({ content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Repostagem automática configurada com sucesso!`, ephemeral: true })
            }
        }
    }
}
