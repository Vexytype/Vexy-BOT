const Discord = require("discord.js")
const {ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType} = require("discord.js")
const { General } = require("../../Database/index");
const { notifyStock, downloadFile, obterEmoji } = require("../../Functions/definicoes")

module.exports = {
    name: "clear", 
    description: "[STAFF] clear channel messages", 
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'quantidade',
            description: 'insira a quantidade de mensagens que deseja apagar.',
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        const EMOJI = await obterEmoji();

        let numero = interaction.options.getNumber('quantidade')

        if (interaction.user.id !== General.get('owner') && !interaction.member.roles.cache.has(General.get("admrole"))) {
            interaction.reply({
                content: `${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} Espere! Você não tem permissão para usar este comando`, ephemeral: true
            });
            return;
        } else {

            if (parseInt(numero) > 99 || parseInt(numero) <= 0) {

                interaction.reply({content:`${EMOJI.vx14 == null ? `` : `<:${EMOJI.vx14.name}:${EMOJI.vx14.id}>`} Você só pode apagar até 99 mensagens por vez`})

            } else {

                interaction.reply({content:`${EMOJI.vx2 == null ? `` : `<a:${EMOJI.vx2.name}:${EMOJI.vx2.id}>`} Apagando as mensagens..`, ephemeral:true})
                
                try {
                    await interaction.channel.bulkDelete(parseInt(numero))
                    setTimeout(() => {
                        interaction.editReply({content:`${EMOJI.vx3 == null ? `` : `<:${EMOJI.vx3.name}:${EMOJI.vx3.id}>`} Operação concluida com sucesso!`, ephemeral:true })
                    }, 1000)

                } catch(error) {
                    console.log(error)
                    interaction.editReply({content:`${EMOJI.vx16 == null ? `` : `<:${EMOJI.vx16.name}:${EMOJI.vx16.id}>`} Você não pode apagar mensagens com 14 dias de diferença entre uma e outra.`});
                }
            }

        }

    }
}