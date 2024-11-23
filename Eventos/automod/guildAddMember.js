const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ActivityType, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, Guild } = require("discord.js");
const { General, BList, welcomis } = require("../../Database/index");
let timer = {};


module.exports = {
    name: "guildMemberAdd",
    run: async (member, client) => {

        if(member.bot) return;

        const serveralvo = General.get('guildID')
        if (member.guild.id !== serveralvo) {
            return;
        }

        function getCreationDateFromSnowflake(snowflake) {
            const snowflakeNumber = BigInt(snowflake);
            const timestamp = Number(snowflakeNumber >> BigInt(22)) + 1420070400000;
            return new Date(timestamp);
        }

        const automod = await General.get("automod");
        const antfake = automod.antifake || 0;

        const logsKicks = client.channels.cache.get(General.get(`logsBan`));

        if (antfake.dias) {
            const dataCriacaoConta = new Date(getCreationDateFromSnowflake(member.user.id));

            const dataAtual = new Date();
        
            const diferencaEmMilissegundos = dataAtual - dataCriacaoConta;
        
            const diascorridos = Math.floor(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));

            if (diascorridos < antfake.dias) {
                try{
                    const embedDiasmnni = new EmbedBuilder()
                    .setAuthor({ name: `Sistema de Moderação`, iconURL: "https://cdn.discordapp.com/emojis/1265528442133418077.webp?size=96&quality=lossless" })
                    .setDescription(`O Sistema identificou uma conta suspeita tentando entrar no servidor.
                        \nO usuário <@${member.user.id}> foi **expulso** por medidas de proteção!`)
                    .addFields(
                        { name: `ID do Usuário`, value: `\`${member.user.id}\``, inline: true },
                        { name: `Data de criação`, value: `<t:${Math.ceil(getCreationDateFromSnowflake(member.user.id) / 1000)}:R>`, inline: true }
                    )
                    .setColor(General.get('oficecolor.red'))
                    .setFooter({ text: `Data do Ocorrido`, iconURL: "https://cdn.discordapp.com/emojis/1265111283103961219.webp?size=96&quality=lossless" })
                    .setTimestamp();
                    await member.kick("Sistema de Moderação");
                    logsKicks.send({embeds:[embedDiasmnni]});
                }
                catch(error){
                    console.log(error)
                }
            }
        } 

        const channelLogsperma = client.channels.cache.get(General.get(`logsBlacklist`));
        const admrole = (General.get(`admrole`))
        const rowSystem = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('dsfjsdfksjlalaa')
                    .setLabel('Mensagem do Sistema')
                    .setStyle(2)
                    .setDisabled(true)
            )

        const embedBlack = new EmbedBuilder()
            .setAuthor({ name: `Sistema de Moderação`, iconURL: "https://cdn.discordapp.com/emojis/1265528442133418077.webp?size=96&quality=lossless" })
            .setTitle('Entrada Negada')
            .setColor(General.get('oficecolor.red'))
            .setTimestamp()
            .setFooter({ text: `Medida de Segurança`, iconURL: "https://cdn.discordapp.com/emojis/1267381920333955112.webp?size=96&quality=lossless" })
            .setDescription(`- **O usuário <@${member.user.id}> está na sua Blacklist.**\n- **Portanto o usuário foi impedido de entrar neste Servidor.**`)

        const Blacklist = await BList.get("usuariosBan");

        if (Blacklist && Blacklist[member.user.id]) {
            channelLogsperma.send({ content: `<@&${admrole}>`, embeds: [embedBlack], components: [rowSystem] })
            return member.ban({ reason: "Sistema de Moderação" });
        };


        const cargoentrada = General.get('automod.autorole')
        const logsEntradass = client.channels.cache.get(General.get(`logsbemvindu`));
        const embedautoroleErro = new EmbedBuilder()
            .setAuthor({ name: `Análise de Erros`, iconURL: "https://cdn.discordapp.com/emojis/1267381926927532146.webp?size=96&quality=lossless", })
            .setTitle('Erro ao Atribuir Cargos')
            .setDescription(`- **Erro ao atribuir o cargo <@&${cargoentrada}> ao membro <@${member.user.id}>**\n- **Este erro pode ocorrer caso o BOT não tenha permissões para adicionar cargos à usuários, ou, Caso o Cargo do bot esteja abaixo do cargo selecionado na hierárquia de Cargos, ou, Caso o usuário tenha sido expulso ou banido do servidor assim que entrou.**`)
            .setColor(General.get('oficecolor.red'))
            .setTimestamp()
            .setFooter({ text: `Sistema de análise de Erros`, iconURL: "https://cdn.discordapp.com/emojis/1267381920333955112.webp?size=96&quality=lossless" })

        if(cargoentrada !== null){
        if (!member.roles.cache.has(cargoentrada)) {
            try {
                await member.roles.add(cargoentrada);
            } catch (error) {
                logsEntradass.send({ content: `<@&${admrole}>`, embeds: [embedautoroleErro], components: [rowSystem] })
                console.error(error);
            }
        }
    }
        const welcommm = await welcomis.get('welcomeMSG');

        if(welcommm){
            const chatWelcome = client.channels.cache.get(welcommm.chatentrada) || ""
            try {
            if (chatWelcome !== null) {
                let title = welcommm.title;
                let description = welcommm.description;
                let color = welcommm.color || General.get('oficecolor.main');
        
                description = description.replace(/{member}/g, `<@${member.id}>`);
                description = description.replace(/{guildname}/g, member.guild.name);
        
                let embedMSg = new EmbedBuilder()
                    .setTitle(`${title}`)
                    .setDescription(`${description}\n\n**ID do Usuário:** \`${member.id}\``)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setFooter({ text: `Entrou às | `, iconURL: "https://cdn.discordapp.com/emojis/1265111283103961219.webp?size=96&quality=lossless" })
                    .setTimestamp()
                    .setColor(color); 
        
                chatWelcome.send({
                    content: `<@${member.id}>`, embeds: [embedMSg]
                });
            }
        } catch (error) {
            console.error("Erro ao enviar a mensagem de boas-vindas:", error);
        }
    }       

    }
};