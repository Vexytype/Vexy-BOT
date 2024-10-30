const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, Guild } = require("discord.js");
const { General, BList, welcomis } = require("../../Database/index");
const axios = require("axios");

module.exports = {
    name: 'messageCreate',
    run: async (message, client) => {
        if (!message.guild || message.author.bot) return;

        const serveralvo = General.get('guildID')
        if (message.guild.id !== serveralvo) {
            return;
        }
        
        const palavrasLeves = General.get('automod.palavras.leves') || [];
        const palavrasPfensivas = General.get('automod.palavras.ofensivas') || [];

        const encontrouPalavraLeve = palavrasLeves.some(palavra => message.content.toLowerCase().includes(palavra.toLowerCase()));
        const encontrouPalavraOfensiva = palavrasPfensivas.some(palavra => message.content.toLowerCase().includes(palavra.toLowerCase()));

        if (encontrouPalavraLeve) {
            try {
                await message.delete(); 

                const tempoTimeout = General.get(`automod.palavras.tempo`);
                const timeoutDuration = tempoTimeout * 60 * 1000;
                await message.member.timeout(timeoutDuration, `Sistema de Moderação`);

                const embed = new EmbedBuilder()
                    .setColor(General.get('oficecolor.red'))
                    .setAuthor({ name: `Sistema de Moderação`, iconURL: "https://cdn.discordapp.com/emojis/1265528442133418077.webp?size=96&quality=lossless" })
                    .setTitle('TimeOut Aplicado')
                    .addFields(
                        { name: `**Usuário**`, value: `${message.author} - \`${message.author.id}\`` },
                        { name: `**Canal**`, value: `${message.channel}` },
                        { name: `**Motivo/Mensagem**`, value: `${message.content}` },
                    )
                    .setFooter({ text: `Data do Ocorrido`, iconURL: "https://cdn.discordapp.com/emojis/1265111283103961219.webp?size=96&quality=lossless" })
                    .setTimestamp();

                const logsCastigo = client.channels.cache.get(General.get(`logsCastigo`));

                if (logsCastigo) {
                    logsCastigo.send({ embeds: [embed] });
                }
            } catch (error) {
                console.error(`Erro ao deletar mensagem: ${error}`);
            }
        }
        if (encontrouPalavraOfensiva) {
            try {
                await message.delete(); 

                await message.member.kick({ reason: "Sistema de Moderação" });

                const embed = new EmbedBuilder()
                    .setColor(General.get('oficecolor.red'))
                    .setTitle('Usuário Expulso')
                    .setAuthor({ name: `Sistema de Moderação`, iconURL: "https://cdn.discordapp.com/emojis/1265528442133418077.webp?size=96&quality=lossless" })
                    .addFields(
                        { name: `**Usuário**`, value: `${message.author} - \`${message.author.id}\`` },
                        { name: `**Canal**`, value: `${message.channel}` },
                        { name: `**Motivo/Mensagem**`, value: `${message.content}` },
                    )
                    .setFooter({ text: `Data do Ocorrido`, iconURL: "https://cdn.discordapp.com/emojis/1265111283103961219.webp?size=96&quality=lossless" })
                    .setTimestamp();

                const logsBan = client.channels.cache.get(General.get(`logsBan`));

                if (logsBan) {
                    logsBan.send({ embeds: [embed] });
                }
            } catch (error) {
                console.error(`Erro ao deletar mensagem: ${error}`);
            }
        }
    }
};