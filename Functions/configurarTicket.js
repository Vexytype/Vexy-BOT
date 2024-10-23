const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js")
const { General, BList, Tickesettings, tickets } = require("../Database/index");

async function painelTicket(client, interaction) {
    const embed = new EmbedBuilder()
        .setAuthor({ name: `Gerenciamento do Ticket`, iconURL: "https://cdn.discordapp.com/emojis/1265528440543645736.webp?size=96&quality=lossless" })
        .setColor(General.get("oficecolor.main"))
        .setFooter(
            { text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) }
        )
        .setTimestamp()


    if (tickets.get(`tickets.aparencia.title`) !== null) {
        embed.setTitle(tickets.get(`tickets.aparencia.title`))
    }
    if (tickets.get(`tickets.aparencia.description`) !== null) {
        embed.setDescription(tickets.get(`tickets.aparencia.description`))
    }
    if (tickets.get(`tickets.aparencia.color`) !== null) {
        embed.setColor(tickets.get(`tickets.aparencia.color`))
    }
    if (tickets.get(`tickets.aparencia.banner`) !== null) {
        embed.setImage(tickets.get(`tickets.aparencia.banner`))
    }
    if (tickets.get(`tickets.aparencia.icon`) !== null) {
        embed.setThumbnail(tickets.get(`tickets.aparencia.icon`))
    }

    const funcoes = tickets.get(`tickets.funcoes`);

    if (funcoes !== null) {

        let count = 0;
        let maxItems = 4;
        for (const chave in funcoes) {
            if (count >= maxItems) {
                break;
            }

            const objetoAtual = funcoes[chave];

            const nome = objetoAtual.nome;
            const predescricao = objetoAtual.predescricao;
            const descricao = objetoAtual.descricao;
            const emoji = objetoAtual.emoji;

            embed.addFields({ name: `**${nome}**`, value: `**Pré descrição:** \`${predescricao}\`\n**Emoji:** ${emoji == undefined ? `Não definido.` : emoji}\n**Descrição:**\n${descricao == undefined ? `Não definido, será enviado o principal.` : descricao}\n\n` });

            count++;
        }


        if (Object.keys(funcoes).length > maxItems) {
            const maisItens = `Mais ${Object.keys(funcoes).length - maxItems} item${Object.keys(funcoes).length - maxItems > 1 ? 's' : ''}...`;
            embed.addFields({ name: '\u200B', value: maisItens });
        }
    }

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("definiraparencia")
                .setLabel('Personalizar')
                .setEmoji(`1251441496104636496`)
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId("postarticket")
                .setLabel('Postar')
                .setEmoji(`1263220780615991306`)
                .setStyle(1)
        )
    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("addfuncaoticket")
                .setLabel('Adicionar Bloco')
                .setEmoji(`1264379774793420811`)
                .setStyle(3),
            new ButtonBuilder()
                .setCustomId("editarfuncaoticket")
                .setLabel("Editar Bloco")
                .setStyle(1)
                .setEmoji('1264379809845477406'),
            new ButtonBuilder()
                .setCustomId("remfuncaoticket")
                .setLabel('Remover Bloco')
                .setEmoji(`1264379758469320761`)
                .setStyle(4)
        )
    const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("voltar1")
                .setLabel('Voltar')
                .setEmoji(`1265111272312016906`)
                .setStyle(2)
        )
    const row5 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("redefinirticket")
                .setLabel('Redefinir')
                .setEmoji(`1267032211455082508`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("sincronizarticket")
                .setLabel('Atualizar')
                .setEmoji(`1263621210214760489`)
                .setStyle(2)
        )
    await interaction.update({ content: ``, embeds: [embed], components: [row2, row3, row5, row4] })
}

module.exports = {
    painelTicket
}