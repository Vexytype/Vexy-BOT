const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, AttachmentBuilder, ComponentType, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require("discord.js");
const Discord = require("discord.js")
const { General, BList, tickets, vendas } = require("../../Database/index");
const { panel } = require("../../Functions/painel");
const { definitions, definicoes1, definicoes2, obterEmoji } = require("../../Functions/definicoes")
const { personalizaar } = require("../../Functions/personalizar")
const { moderation, automoderation } = require("../../Functions/moderation")
const { welcome } = require("../../Functions/boasvindas")
const { painelTicket } = require("../../Functions/configurarTicket")
const { BBlackList } = require("../../Functions/configblacklist")
const { CreateMessageTicket, Checkarmensagensticket } = require("../../Functions/createticket")
const { abrirTicket } = require("../../Functions/abrirticket")
const transcript = require('discord-html-transcripts')
const axios = require("axios");
const fs = require('fs');
const path = require('path');
const mercadopago = require('mercadopago');


module.exports = {
    name: "interactionCreate",
    run: async (interaction, client) => {
        const customId = interaction.customId;
        const inteButton = interaction.isButton();

        if (customId === "addfuncaoticket") {

            const funct = tickets.get('tickets.funcoes')


            if (funct && Object.keys(funct).length > 10) {
                return interaction.reply({ content: `Você não pode criar mais de 10 funções em seu ticket!` });
            }

            const modalaAA = new ModalBuilder()
                .setCustomId('addblocoModal')
                .setTitle(`Adicionar bloco`);

            const newnameboteN = new TextInputBuilder()
                .setCustomId('nomeBloco')
                .setLabel(`NOME DO BLOCO`)
                .setPlaceholder(`Insira aqui um nome, como: Suporte`)
                .setStyle(TextInputStyle.Short)
                .setMaxLength(50)
                .setRequired(true)

            const newnameboteN2 = new TextInputBuilder()
                .setCustomId('predescBloco')
                .setLabel(`PRÉ DESCRIÇÃO`)
                .setPlaceholder(`Insira aqui uma pré descrição, ex: "Preciso de suporte."`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMaxLength(70)

            const newnameboteN4 = new TextInputBuilder()
                .setCustomId('descBloco')
                .setLabel(`DESCRIÇÃO`)
                .setPlaceholder(`Insira aqui a descrição do bloco.`)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setMaxLength(1024)

            const newnameboteN5 = new TextInputBuilder()
                .setCustomId('bannerbloco')
                .setLabel(`BANNER (OPCIONAL)`)
                .setPlaceholder(`Insira aqui uma URL de uma imagem ou GIF`)
                .setStyle(TextInputStyle.Short)
                .setRequired(false)

            const newnameboteN6 = new TextInputBuilder()
                .setCustomId('emojiBloco')
                .setLabel(`EMOJI DO BLOCO`)
                .setPlaceholder(`Insira um nome ou id de um emoji do servidor.`)
                .setStyle(TextInputStyle.Short)
                .setRequired(false)

            const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
            const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
            const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN4);
            const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN5);
            const firstActionRow7 = new ActionRowBuilder().addComponents(newnameboteN6);


            modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5, firstActionRow6, firstActionRow7);
            await interaction.showModal(modalaAA);

        }

        if (interaction.isModalSubmit() && interaction.customId === "addblocoModal") {
            let NOME = interaction.fields.getTextInputValue('nomeBloco');
            let PREDESC = interaction.fields.getTextInputValue('predescBloco');
            let DESC = interaction.fields.getTextInputValue('descBloco');
            let BANNER = interaction.fields.getTextInputValue('bannerbloco');
            let EMOJI = interaction.fields.getTextInputValue('emojiBloco');

            NOME = NOME.replace('.', '');
            PREDESC = PREDESC.replace('.', '');

            if (tickets.get(`tickets.funcoes.${NOME}`) !== null) {
                return interaction.reply({ content: `Já existe um bloco com esse nome!`, ephemeral: true });
            }

            if (NOME.length > 50) {
                return interaction.reply({ content: `O nome não pode ter mais de 50 caracteres!`, ephemeral: true });
            } else {
                tickets.set(`tickets.funcoes.${NOME}.nome`, NOME)
            }

            if (PREDESC.length > 70) {
                return interaction.reply({ content: `A pré descrição não pode ter mais de 64 caracteres!`, ephemeral: true });
            } else {
                tickets.set(`tickets.funcoes.${NOME}.predescricao`, PREDESC)
            }

            if (DESC !== '') {
                if (DESC.length > 1024) {
                    return interaction.reply({ content: `A descrição não pode ter mais de 1024 caracteres!`, ephemeral: true });
                } else {
                    tickets.set(`tickets.funcoes.${NOME}.descricao`, DESC)
                }
            }

            if (BANNER !== '') {
                const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
                if (!urlRegex.test(BANNER)) {
                    return interaction.reply({ content: `Você escolheu incorretamente a URL do banner!`, ephemeral: true });
                } else {
                    tickets.set(`tickets.funcoes.${NOME}.banner`, BANNER)
                }
            }

            if (EMOJI !== '') {
                const emojiRegex = /^<:.+:\d+>$|^<a:.+:\d+>$|^\p{Emoji}$/u;
                if (!emojiRegex.test(EMOJI)) {
                    return interaction.reply({ content: `Você escolheu incorretamente o emoji!`, ephemeral: true });
                } else {
                    tickets.set(`tickets.funcoes.${NOME}.emoji`, EMOJI)
                }
            } else {
                tickets.set(`tickets.funcoes.${NOME}.emoji`, '1251441496104636496')
            }

            await painelTicket(client, interaction)
            interaction.followUp({ content: `Bloco adicionado com sucesso!`, ephemeral: true });

        }

        if (customId === "editarfuncaoticket") {


            const ggg = tickets.get(`tickets.funcoes`)

            if (ggg == null) {
                return interaction.reply({ content: `Não existe nenhum bloco criado para Editar.`, ephemeral: true });
            }

            if (ggg == null | Object.keys(ggg).length == 0) {
                return interaction.reply({ content: `Não existe nenhum bloco criado para Editar.`, ephemeral: true });
            }

            else {

                const selectMenuBuilder = new Discord.StringSelectMenuBuilder()
                    .setCustomId('editarticketsfunction')
                    .setPlaceholder('Clique aqui para selecionar')
                    .setMinValues(1)

                for (const chave in ggg) {
                    const item = ggg[chave];

                    const option = {
                        label: `${item.nome}`,
                        description: `${item.predescricao}`,
                        value: item.nome,
                        emoji: `1265528447418105940`
                    };

                    selectMenuBuilder.addOptions(option);

                }

                selectMenuBuilder.setMaxValues(1)

                const style2row = new ActionRowBuilder().addComponents(selectMenuBuilder);
                const row1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('voltarconfigtickett')
                            .setLabel('Voltar')
                            .setEmoji('1265111272312016906')
                            .setStyle(2)
                    )
                try {
                    await interaction.update({ components: [style2row, row1], content: `Qual bloco deseja editar?`, embeds: [], ephemeral: true })
                } catch (error) {
                }
            }

        }

        if (customId === "editarticketsfunction") {
            const valorSelecionado = interaction.values[0];
            const funcaoExistente = tickets.get(`tickets.funcoes.${valorSelecionado}`);

            if (!funcaoExistente) {
                return interaction.reply({ content: `Função não encontrada.`, ephemeral: true });
            }

            const modal = new ModalBuilder()
                .setCustomId(`modalEditarFuncao_${valorSelecionado}`)
                .setTitle('Editar Função do Ticket');

            const nomeInput = new TextInputBuilder()
                .setCustomId('nomeFuncao')
                .setLabel('Nome do Bloco')
                .setPlaceholder('Insira o nome do Bloco')
                .setStyle(TextInputStyle.Short)
                .setMaxLength(50)
                .setValue(funcaoExistente?.nome == undefined ? '' : funcaoExistente.nome)
                .setRequired(false)

            const predescricaoInput = new TextInputBuilder()
                .setCustomId('predescricaoFuncao')
                .setLabel('Pré-descrição do Bloco')
                .setPlaceholder('Insira a pré-descrição do Bloco')
                .setStyle(TextInputStyle.Short)
                .setValue(funcaoExistente?.predescricao == undefined ? '' : funcaoExistente.predescricao)
                .setMaxLength(70)
                .setRequired(false)

            const descricaoInput = new TextInputBuilder()
                .setCustomId('descricaoFuncao')
                .setLabel('Descrição do Bloco')
                .setPlaceholder('Insira a descrição do Bloco')
                .setStyle(TextInputStyle.Paragraph)
                .setValue(funcaoExistente?.descricao == undefined ? '' : funcaoExistente.descricao)
                .setMaxLength(1024)
                .setRequired(false)

            const bannerInput = new TextInputBuilder()
                .setCustomId('bannerFuncao')
                .setLabel('Banner do Bloco')
                .setPlaceholder('Insira uma Url Válida')
                .setStyle(TextInputStyle.Short)
                .setValue(funcaoExistente?.banner == undefined ? '' : funcaoExistente.banner)
                .setRequired(false)

            const emojiInput = new TextInputBuilder()
                .setCustomId('emojiBloco')
                .setLabel('Emoji do Bloco')
                .setPlaceholder('Insira um Emoji válido')
                .setStyle(TextInputStyle.Short)
                .setValue(funcaoExistente?.emoji == undefined ? '' : funcaoExistente.emoji)
                .setRequired(false)

            modal.addComponents(
                new ActionRowBuilder().addComponents(nomeInput),
                new ActionRowBuilder().addComponents(predescricaoInput),
                new ActionRowBuilder().addComponents(descricaoInput),
                new ActionRowBuilder().addComponents(bannerInput),
                new ActionRowBuilder().addComponents(emojiInput)
            );

            await interaction.showModal(modal);
        }

        if (interaction.isModalSubmit()) {
            const customId = interaction.customId;

            if (typeof customId === 'string' && customId.startsWith("modalEditarFuncao_")) {
                let valorSelecionado = customId.split('_')[1];

                let nomeFuncao = interaction.fields.getTextInputValue('nomeFuncao');
                let predescricaoFuncao = interaction.fields.getTextInputValue('predescricaoFuncao');
                let descricaoFuncao = interaction.fields.getTextInputValue('descricaoFuncao');
                let bannerFuncao = interaction.fields.getTextInputValue('bannerFuncao');
                let emojiFuncao = interaction.fields.getTextInputValue('emojiBloco');

                if (nomeFuncao !== '') {

                    if (valorSelecionado !== nomeFuncao) {
                        tickets.delete(`tickets.funcoes.${valorSelecionado}`);
                        tickets.set(`tickets.funcoes.${nomeFuncao}`, {
                            nome: nomeFuncao,
                            predescricao: predescricaoFuncao
                        });
                    }
                }

                if (descricaoFuncao !== '') {
                    tickets.set(`tickets.funcoes.${nomeFuncao}.descricao`, descricaoFuncao)
                }

                if (bannerFuncao !== '') {
                    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
                    if (!urlRegex.test(bannerFuncao)) {
                        return interaction.reply({ content: `Você inseriu uma URL inválida!`, ephemeral: true });
                    } else {
                        tickets.set(`tickets.funcoes.${nomeFuncao}.banner`, bannerFuncao);
                    }
                }

                if (emojiFuncao !== '') {
                    const emojiRegex = /^<:.+:\d+>$|^<a:.+:\d+>$|^\p{Emoji}$/u;
                    if (!emojiRegex.test(emojiFuncao)) {
                        return interaction.reply({ content: `Você inseriu um emoji inválido!`, ephemeral: true });
                    } else {
                        tickets.set(`tickets.funcoes.${nomeFuncao}.emoji`, emojiFuncao);
                    }
                }

                await painelTicket(client, interaction);
                interaction.followUp({ content: `Bloco editada com sucesso!`, ephemeral: true });
            }
        }

        if (customId === "remfuncaoticket") {


            const ggg = tickets.get(`tickets.funcoes`)

            if (ggg == null) {
                return interaction.reply({ content: `Não existe nenhum bloco criado para remover.`, ephemeral: true });
            }

            if (ggg == null | Object.keys(ggg).length == 0) {
                return interaction.reply({ content: `Não existe nenhum bloco criado para remover.`, ephemeral: true });
            }


            else {

                const selectMenuBuilder = new Discord.StringSelectMenuBuilder()
                    .setCustomId('deletarticketsfunction')
                    .setPlaceholder('Clique aqui para selecionar')
                    .setMinValues(1)

                for (const chave in ggg) {
                    const item = ggg[chave];

                    const option = {
                        label: `${item.nome}`,
                        description: `${item.predescricao}`,
                        value: item.nome,
                        emoji: `1265528447418105940`
                    };

                    selectMenuBuilder.addOptions(option);


                }

                const row1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('voltarconfigtickett')
                            .setLabel('Voltar')
                            .setEmoji('1265111272312016906')
                            .setStyle(2)
                    )
                selectMenuBuilder.setMaxValues(Object.keys(ggg).length)

                const style2row = new ActionRowBuilder().addComponents(selectMenuBuilder);
                try {
                    await interaction.update({ components: [style2row, row1], content: `Qual bloco deseja remover?`, embeds: [], ephemeral: true })
                } catch (error) {
                }
            }

        }

        if (customId === "deletarticketsfunction") {
            const valordelete = interaction.values
            for (const iterator of valordelete) {
                tickets.delete(`tickets.funcoes.${iterator}`)
            }
            await painelTicket(client, interaction)
            interaction.followUp({ content: `Bloco removido com sucesso!`, ephemeral: true });
        }

        if (customId === "definiraparencia") {

            const modalaAA = new ModalBuilder()
                .setCustomId('interfaceticket')
                .setTitle(`Editar Ticket`);

            const dd = tickets.get(`tickets.aparencia`)

            const newnameboteN = new TextInputBuilder()
                .setCustomId('titleAparencia')
                .setLabel(`TITULO`)
                .setPlaceholder(`Insira aqui um nome, como: Entrar em contato`)
                .setStyle(TextInputStyle.Short)
                .setValue(dd?.title == undefined ? '' : dd.title)
                .setRequired(true)


            const newnameboteN2 = new TextInputBuilder()
                .setCustomId('descAparencia')
                .setLabel(`DESCRIÇÃO`)
                .setPlaceholder(`Insira aqui uma descrição.`)
                .setStyle(TextInputStyle.Paragraph)
                .setValue(dd?.description == undefined ? '' : dd.description)
                .setMaxLength(1024)
                .setRequired(true)


            const newnameboteN4 = new TextInputBuilder()
                .setCustomId('bannerAparencia')
                .setLabel(`BANNER (OPCIONAL)`)
                .setPlaceholder(`Insira aqui uma URL de uma imagem ou GIF`)
                .setStyle(TextInputStyle.Short)
                .setValue(dd?.banner == undefined ? '' : dd.banner)
                .setRequired(false)

            const newnameboteN3 = new TextInputBuilder()
                .setCustomId('iconAparencia')
                .setLabel(`ICONE (OPCIONAL)`)
                .setPlaceholder(`Insira aqui uma URL de uma imagem ou GIF`)
                .setStyle(TextInputStyle.Short)
                .setValue(dd?.icon == undefined ? '' : dd.icon)
                .setRequired(false)


            const newnameboteN5 = new TextInputBuilder()
                .setCustomId('colorAparencia')
                .setLabel(`COR DO EMBED (OPCIONAL)`)
                .setPlaceholder(`Insira aqui um código Hex Color, ex: FFFFFF`)
                .setStyle(TextInputStyle.Short)
                .setValue(dd?.color == undefined ? '' : dd.color)
                .setRequired(false)


            const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
            const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
            const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN4);
            const firstActionRow1 = new ActionRowBuilder().addComponents(newnameboteN3);
            const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN5);

            modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow1, firstActionRow5, firstActionRow6);
            await interaction.showModal(modalaAA);



        }

        if (interaction.isModalSubmit() && interaction.customId === "interfaceticket") {

            let TITULO = interaction.fields.getTextInputValue('titleAparencia');
            let DESC = interaction.fields.getTextInputValue('descAparencia');
            let ICON = interaction.fields.getTextInputValue('iconAparencia')
            let BANNER = interaction.fields.getTextInputValue('bannerAparencia');
            let COREMBED = interaction.fields.getTextInputValue('colorAparencia');

            if (TITULO.length > 256) {
                return interaction.reply({ content: `O título não pode ter mais de 256 caracteres!`, ephemeral: true });
            }
            if (DESC.length > 1024) {
                return interaction.reply({ content: `A descrição não pode ter mais de 1024 caracteres!`, ephemeral: true });
            }

            if (COREMBED !== '') {
                const hexColorRegex = /^#?([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
                if (!hexColorRegex.test(COREMBED)) {

                    return interaction.reply({ content: `Código Hex Color \`${COREMBED}\` inválido, tente pegar [nesse site.](https://www.google.com/search?q=color+picker&oq=color+picker)`, ephemeral: true });
                } else {
                    tickets.set(`tickets.aparencia.color`, COREMBED)
                }
            }

            if (ICON !== '') {
                const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
                if (!urlRegex.test(ICON)) {

                    return interaction.reply({ message: dd, content: `Você escolheu incorretamente a URL do Icon!`, ephemeral: true });
                } else {
                    tickets.set(`tickets.aparencia.icon`, ICON)
                }
            }

            if (BANNER !== '') {
                const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
                if (!urlRegex.test(BANNER)) {

                    return interaction.reply({ message: dd, content: `Você escolheu incorretamente a URL do banner!`, ephemeral: true });
                } else {
                    tickets.set(`tickets.aparencia.banner`, BANNER)
                }
            }

            if (TITULO !== '') {
                tickets.set(`tickets.aparencia.title`, TITULO)
            } else {
                tickets.delete(`tickets.aparencia.title`)
            }

            if (DESC !== '') {
                tickets.set(`tickets.aparencia.description`, DESC)
            } else {
                tickets.delete(`tickets.aparencia.description`)
            }

            painelTicket(client, interaction)


        }

        if (interaction.customId == `postarticket`) {
            const ggg = tickets.get(`tickets.funcoes`)
            const ggg2 = tickets.get(`tickets.aparencia`)


            if (ggg == null || Object.keys(ggg).length == 0 || ggg2 == null || Object.keys(ggg2).length == 0) {
                return interaction.reply({ content: `O Sistema de Ticket foi redefinido ou não foi configurado, configure-o!`, ephemeral: true });
            } else {
                const posttick = new ChannelSelectMenuBuilder()
                    .setCustomId('canalpostarticket')
                    .setPlaceholder('Clique aqui para selecionar')
                    .setChannelTypes(ChannelType.GuildText)

                const row1 = new ActionRowBuilder()
                    .addComponents(posttick);

                interaction.reply({ components: [row1], content: `Selecione o canal que deseja postar o Ticket.`, ephemeral: true, })

            }
        }

        if (interaction.isChannelSelectMenu() && customId === "canalpostarticket") {
            await interaction.reply({ content: `Aguarde estamos criando sua mensagem...`, ephemeral: true });
            CreateMessageTicket(interaction, interaction.values[0], client);

            setTimeout(() => {
                interaction.editReply({ content: `Mensagem criada com sucesso!`, ephemeral: true });
            }, 1000)
        }

        if (interaction.isButton() && customId === 'redefinirticket') {

            const blocos = tickets.get(`tickets.funcoes`)
            const aparencia = tickets.get("tickets.aparencia")

            if (blocos == null || aparencia == null) {
                return interaction.reply({ content: `Ticket já foi redefinido ou não foi configurado!`, ephemeral: true })
            }

            const row1 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('aprovarRedefinir')
                        .setLabel('Confirmar')
                        .setStyle(3),
                    new ButtonBuilder()
                        .setCustomId('cancelarRedefinir')
                        .setLabel('Voltar')
                        .setStyle(2)
                        .setEmoji('1265111272312016906')
                )
            interaction.update({ content: `**Tem certeza disso? Confirmar esta opção irá redefinir a aparencia e as funções do ticket.**`, embeds: [], components: [row1], ephemeral: true })
        }

        if (interaction.isButton() && customId === 'aprovarRedefinir') {

            tickets.delete("tickets.funcoes")
            tickets.delete("tickets.aparencia")
            await painelTicket(client, interaction)
            interaction.followUp({ content: `Redefinido com sucesso!`, ephemeral: true })
        }


        if (interaction.isButton() && interaction.customId.startsWith('AbrirTicket_')) {
            valorticket = interaction.customId.replace('AbrirTicket_', '');
            abrirTicket(interaction, valorticket)
        } else if (interaction.isStringSelectMenu() && interaction.customId === 'abrirticket') {
            valorticket = interaction.values[0]
            abrirTicket(interaction, valorticket)
        }

        if (interaction.customId === 'notificaruser') {
            const EMOJI = await obterEmoji();

            if (!interaction.member.roles.cache.has(General.get('admrole')) && !interaction.member.roles.cache.has(General.get('staffrole'))) {
                return interaction.reply({ content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} Você não tem permissão para fazer isso!`, ephemeral: true });
            }
            const ticketID = interaction.channel.id;
            const tickeNotify = interaction.channel;
            const quemAbriu = tickets.get(`openeds.${ticketID}.abriu`);
            const useratendimento = interaction.guild.members.cache.get(quemAbriu);
            const server = interaction.guild.name
            const modVexy = interaction.user.id

            if (!useratendimento) return interaction.reply({ content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} O usuário não se encontra no servidor.`, ephemeral: true });

            useratendimento.send({
                content: ``, embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: `Notificação`, iconURL: "https://cdn.discordapp.com/emojis/1276564803762258082.webp?size=96&quality=lossless" })
                        .setDescription(`**- Atendente: <@${modVexy}>\n- A Staff do servidor "${server}" está solicitando sua presença em seu ticket aberto**\n- **Clique no botão abaixo para ser redirecionado até seu Ticket**`)
                        .setColor(General.get('oficecolor.main'))
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setTimestamp()
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setURL(`https://discord.com/channels/${interaction.guild.id}/${tickeNotify.id}`)
                                .setLabel('Ir para o Ticket')
                                .setStyle(5)
                        )
                ],
            });

            interaction.reply({ content: `O usuário foi notificado com sucesso!`, ephemeral: true })

        }

        if (interaction.customId === 'assumiirTicket') {
            const EMOJI = await obterEmoji();
            if (!interaction.member.roles.cache.has(General.get('admrole')) && !interaction.member.roles.cache.has(General.get('staffrole'))) {
                return interaction.reply({
                    content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} Você não tem permissão para fazer isso!`,
                    ephemeral: true
                });
            }

            const ticketID = interaction.channel.id;
            const tickeNotify = interaction.channel;
            const quemAbriu = tickets.get(`openeds.${ticketID}.abriu`);
            const useratendimento = interaction.guild.members.cache.get(quemAbriu);
            const modVexy = interaction.user.id;


            try {
                await tickets.set(`openeds.${ticketID}.assumiu`, modVexy);
                const response = await tickets.get(`openeds.${ticketID}.channelId`);
                const response1 = await tickets.get(`openeds.${ticketID}.msgId`);
                const threadTicket = await interaction.guild.channels.cache.get(response);

                if (threadTicket) {
                    const messageToEdit = await threadTicket.messages.fetch(response1);

                    const button2 = new ButtonBuilder().setCustomId('deletar').setLabel('Deletar').setEmoji('1251441411266711573').setStyle(4);
                    const button3 = new ButtonBuilder().setCustomId('notificaruser').setLabel('Notificar').setEmoji('1251441491679645698').setStyle(1);
                    const button4 = new ButtonBuilder().setCustomId('assumiirTicket').setLabel('Atendimento assumido').setEmoji('1265035825419386911').setDisabled(true).setStyle(2);
                    const button5 = new ButtonBuilder().setCustomId('optionUserTicket').setLabel('Opções do usuario').setEmoji('1267597699931177014').setStyle(2);

                    const row = new ActionRowBuilder().addComponents(button3, button2);
                    const row1 = new ActionRowBuilder().addComponents(button4, button5);

                    await messageToEdit.edit({
                        components: [row1, row],
                    });
                } else {
                    console.log("O canal do ticket não foi encontrado.");
                }
            } catch (error) {
                console.log("Erro:", error);
            }

            await interaction.reply({
                content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Você assumiu este ticket`, ephemeral: true
            });

            if (useratendimento) {
                useratendimento.send({
                    content: ``, embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: `Notificação`, iconURL: "https://cdn.discordapp.com/emojis/1276564803762258082.webp?size=96&quality=lossless" })
                            .setDescription(`- O atendente <@${modVexy}> assumiu a responsabilidade do seu atendimento.\n- **Clique no botão abaixo para ser redirecionado até seu Ticket**`)
                            .setColor(General.get('oficecolor.main'))
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${tickeNotify.id}`)
                                    .setLabel('Ir para o Ticket')
                                    .setStyle(5)
                            )
                    ],
                });
            } else {
                return;
            }
        }

        if (interaction.customId === 'deletar') {
            const EMOJI = await obterEmoji();
            if (!interaction.member.roles.cache.has(General.get('admrole')) && !interaction.member.roles.cache.has(General.get('staffrole'))) {
                return interaction.reply({ content: `Você não tem permissão para fazer isso!`, ephemeral: true });
            }

            const LogTickket = interaction.guild.channels.cache.get(General.get(`logsticketChannel`));
            const LogGeraiss = interaction.guild.channels.cache.get(General.get(`logsGerais`));
            const ticketID = interaction.channel.id
            const responsavel = interaction.user.id
            tickets.set(`openeds.${ticketID}.fechou`, responsavel)
            const quemAbriu = await tickets.get(`openeds.${ticketID}.abriu`)
            const quemAssumiu = await tickets.get(`openeds.${ticketID}.assumiu`)
            const aDemes = interaction.guild.roles.cache.get(General.get(`admrole`));
            const userTicket = interaction.guild.members.cache.get(quemAbriu);
            let embedlog = new EmbedBuilder()
                .setAuthor({ name: `| Atendimento Finalizado`, iconURL: "https://cdn.discordapp.com/emojis/1265528440543645736.webp?size=96&quality=lossless" })
                .setDescription(`- **Atendimento:** \`${ticketID}\`\n- Aberto por: <@${quemAbriu}>\n- Fechado por: <@${responsavel}>\n- Assumido por: ${quemAssumiu == null ? `Ninguem` : `<@${quemAssumiu}>`}`)
                .setColor(General.get('oficecolor.red'))
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTimestamp();

            if(tickets.get(`openeds.${ticketID}.suggestion`) !== null) {
                embedlog.addFields({
                    name: `${EMOJI.vx15 == null ? `` : `<:${EMOJI.vx15.name}:${EMOJI.vx15.id}>`} Sugestão de Melhorias:`, value: `\`${tickets.get(`openeds.${ticketID}.suggestion`)}\``, inline: true
                })
            }

            try {
                const attachment = await transcript.createTranscript(interaction.channel, {
                    limit: -1,
                    returnType: 'attatchment',
                    filename:`Transcript.html`,
                    saveImages:true,
                    footerText: 'Exported ${number} messages',
                    poweredBy:true
                });


                if(LogTickket) {
                    LogTickket.send({ embeds: [embedlog]}).then(() => {
                        LogTickket.send({files:[attachment]});
                    }).catch((error) => {
                        console.log(error)
                    })
                }
                if(userTicket) {
                    userTicket.send({embeds:[
                        new EmbedBuilder()
                        .setAuthor({ name: `Atendimento Finalizado`, iconURL: "https://cdn.discordapp.com/emojis/1301454740328288307.webp?size=96&quality=lossless" })
                        .setDescription(`- Seu atendimento com ID \`${ticketID}\` foi finalizado, abaixo foi enviado o transcript do seu atendimento`)
                        .setColor(General.get('oficecolor.red'))
                        .setTimestamp()
                        .setFooter(
                            { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
                        )
                    ]}).then(() => {
                        userTicket.send({files:[attachment]});
                    }).catch((error) => {
                        console.log(error)
                    })
                } 
                interaction.channel.delete();
            } catch (error) {
                LogGeraiss.send({ content: `${aDemes}`, embeds: [
                    new EmbedBuilder()
                .setAuthor({ name: `Análise de Erros`, iconURL: "https://cdn.discordapp.com/emojis/1267381926927532146.webp?size=96&quality=lossless", })
                .setTitle('Erro de Logs')
                .setDescription(`- Erro ao enviar Logs do ticket\n- Este erro pode ocorrer caso não tenha definido um canal para ser receptor das Logs em definições!`)
                .setColor(General.get('oficecolor.red'))
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTimestamp()
                ] })
            }

        }

        if (interaction.customId === 'optionUserTicket') {
            const EMOJI = await obterEmoji();
            const ticketID = interaction.channel.id;
            const validation = await tickets.get(`openeds.${ticketID}.notifyadm`);

            if (interaction.user.id !== tickets.get(`openeds.${ticketID}.abriu`)) {
                return interaction.reply({ content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} Você não tem permissão para fazer isso!`, ephemeral: true });
            }

            if (validation) {
                interaction.reply({
                    content: `Escolha a opção que deseja.\nLembrando que só possivel solicitar ajuda imediata uma vez.`, components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`ajudaImediata`)
                                    .setLabel('Ajuda Imediata Solicitada')
                                    .setEmoji('1276564803762258082')
                                    .setDisabled(true)
                                    .setStyle(2),
                                new ButtonBuilder()
                                    .setCustomId(`sugestaoTicket`)
                                    .setLabel('Sugestão de Melhorias')
                                    .setEmoji('1276927585544044598')
                                    .setStyle(2),
                            ),
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`sairTicket`)
                                    .setLabel('Sair do Atendimento')
                                    .setEmoji('1251441490576805979')
                                    .setStyle(2),
                            )
                    ], ephemeral: true
                });
            } else {
                interaction.reply({
                    content: `Escolha a opção que deseja.\nLembrando que só possivel solicitar ajuda imediata uma vez.`, components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`ajudaImediata`)
                                    .setLabel('Solicitar Ajuda Imediata')
                                    .setEmoji('1276564803762258082')
                                    .setStyle(2),
                                new ButtonBuilder()
                                    .setCustomId(`sugestaoTicket`)
                                    .setLabel('Sugestão de Melhorias')
                                    .setEmoji('1276927585544044598')
                                    .setStyle(2),
                            ),
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`sairTicket`)
                                    .setLabel('Sair do Atendimento')
                                    .setEmoji('1251441490576805979')
                                    .setStyle(2),
                            )
                    ], ephemeral: true
                });
            }
        }

        if (interaction.customId === 'ajudaImediata') {
            const EMOJI = await obterEmoji();
            const ticketID = interaction.channel.id;
            const userId = interaction.user.id;
            await tickets.set(`openeds.${ticketID}.notifyadm`, true);
            const asummido = await tickets.get(`openeds.${ticketID}.assumiu`);

            if (asummido == null) {
                const admnotify = interaction.guild.channels.cache.get(General.get(`logsticketChannel`));

                admnotify.send({
                    content: `${EMOJI.vx6 == null ? `` : `<:${EMOJI.vx6.name}:${EMOJI.vx6.id}>`} O usuário <@${userId}> solicitou atendimento imediato.`,
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${ticketID}`)
                                    .setLabel('Ir ate Atendimento')
                                    .setEmoji('1251441496104636496')
                                    .setStyle(5),
                            )
                    ]
                });
            } else {
                const modNotify = await interaction.guild.members.cache.get(asummido);

                modNotify.send({
                    content: `${EMOJI.vx6 == null ? `` : `<:${EMOJI.vx6.name}:${EMOJI.vx6.id}>`} O usuário <@${userId}> solicitou atendimento imediato.`,
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${ticketID}`)
                                    .setLabel('Ir ate Atendimento')
                                    .setEmoji('1251441496104636496')
                                    .setStyle(5),
                            )
                    ]
                });
            }

            interaction.update({ content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} O atendimento imediato foi solicitado, aguarde até que alguem da admnistração lhe atenda.`, components: [], ephemeral: true });
        }

        if (interaction.customId === 'sugestaoTicket') {

            const modal = new ModalBuilder()
                .setCustomId(`modalSuggestTicket`)
                .setTitle('Sugestão de Melhorias');

            const suggestInput = new TextInputBuilder()
                .setCustomId('suggestTicket')
                .setLabel('Insira sua Sugestão')
                .setPlaceholder('Caso escreva coisas indevidas, será banido!')
                .setMinLength(15)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)

            modal.addComponents(
                new ActionRowBuilder().addComponents(suggestInput)
            );

            await interaction.showModal(modal);
        }

        if (interaction.isModalSubmit() && interaction.customId === "modalSuggestTicket") {
            const sug = interaction.fields.getTextInputValue('suggestTicket');
            const EMOJI = await obterEmoji();
            const ticketID = interaction.channel.id;

            await tickets.set(`openeds.${ticketID}.suggestion`, sug);

            interaction.reply({ content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Sua sugestão foi enviada!`, ephemeral: true });
        }

        if (interaction.customId === 'sairTicket') {
            const EMOJI = await obterEmoji();
            const ticketID = interaction.channel.id;
            const thread = await interaction.guild.channels.cache.get(ticketID);
            const userId = interaction.user.id;

            if (thread) {
                try {
                    await thread.members.remove(userId).then(() => {
                        interaction.update({ content: `${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Você foi removido do atendimento com sucesso, apenas clique em outro canal e não verá mais o canal.`, components: [], ephemeral: true });
                    })
                } catch (error) {
                    console.error("Erro ao remover usuario do ticket:", error);
                }
            }
        }

        if (interaction.customId === 'sincronizarticket') {

            const funcoes = tickets.get(`tickets.funcoes`)
            const aparencia = tickets.get(`tickets.aparencia`)

            if (funcoes == null || Object.keys(funcoes).length == 0 || aparencia == null || Object.keys(aparencia).length == 0) {
                return interaction.reply({ content: `O Sistema de Ticket foi redefinido ou não foi configurado, configure-o!`, ephemeral: true });
            } else {
                await interaction.reply({ content: `Aguarde...`, ephemeral: true });
                await Checkarmensagensticket(client)
                interaction.editReply({ content: `Ticket atualizado com sucesso!`, ephemeral: true });
            }
        }

    }
}