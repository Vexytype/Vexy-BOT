const Discord = require("discord.js")
const {ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType} = require("discord.js")
const { General, products, lojaInfo, carrinhos } = require("../../Database/index");
const { obterEmoji } = require("../../Functions/definicoes")
const { refund } = require("../../Functions/loja")

module.exports = {
    name: "reembolsar", 
    description: "[STAFF] Refund order", 
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'id_comprador',
            description: 'insira o ID do comprador para quem irá reembolsar',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'id_pedido',
            description: 'insira o ID do pedido que deseja reembolsar',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        const EMOJI = await obterEmoji();

        let Comprador = interaction.options.getString('id_comprador')
        let Pedido = interaction.options.getString('id_pedido')

        if (interaction.user.id !== General.get('owner')) {
            interaction.reply({
                content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} Espere! Você não tem permissão para usar este comando`, ephemeral: true
            });
            return;
        }
        const Valor = await carrinhos.get(`${Comprador}.${Pedido}`);
        await interaction.reply({content:`${EMOJI.vx2 == null ? `` : `<a:${EMOJI.vx2.name}:${EMOJI.vx2.id}>`} Aguarde um momento...`, ephemeral:true});
        try {
            await refund(Valor.idPay);
        } catch(err) {
            interaction.followUp({content:`${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} Ocorreu um erro...\n Mensagem do erro: \`\`\`${err.message}\`\`\``, ephemeral:true});
        } finally {
            lojaInfo.substr(`rendimentos.pedidosAprovados`, 1);
            lojaInfo.substr(`rendimentos.prodEntregues`, Valor.quantidade);
            lojaInfo.substr(`rendimentos.pedidosAprovados`, Valor.valor);
            carrinhos.set(`${Comprador}.${Pedido}.StatusBuy`, 'refunded');
            interaction.editReply({content:`${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Reembolsado com sucesso!`, ephemeral:true});
        }

    }
}
