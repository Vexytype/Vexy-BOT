const { ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const schedule = require('node-schedule');
const { General, Autos, products } = require('../../Database');
const { obterEmoji } = require("../../Functions/definicoes")

function cumprimento() {
    const horabrasil = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
    const hora = new Date(horabrasil).getHours();

    if (hora >= 0 && hora < 6) {
        return 'Boa madrugada';
    } else if (hora < 12) {
        return 'Bom dia';
    } else if (hora < 18) {
        return 'Boa tarde';
    } else {
        return 'Boa noite';
    }
}

function readAutolock() {
    return Autos.get('autolock') || {};
}

function readAutoAnnounce() {
    return Autos.get(`AutoAnnounce.repostTime`) || null;
}

async function AutoSendMsg(client) {

    const ConfigMsg = await Autos.get(`AutoMsg`);
    if (ConfigMsg == null) return;
    
    for (const key in ConfigMsg) {
        const Data = ConfigMsg[key];
        if(Data == null) return
        try {
            const channel = await client.channels.cache.get(Data.Channel)
            if(!channel) return;
            const msgg = await channel.messages.fetch(Data.messageid)
            if(!msgg) return;

            msgg.delete();
            if (Data.UrlButon !== null) {
                const button = new ButtonBuilder()
                    .setURL(`${Data.UrlButon}`)
                    .setStyle(5)
                    .setEmoji(`${Data.EmojButon}`)

                if (Data.Label !== null) button.setLabel(`${Data.Label}`);
                const row = new ActionRowBuilder().addComponents(button);

                await channel.send({ content: `${Data.mesage}`, components: [row] }).then((msg) => {
                    Autos.set(`AutoMsg.${Data.Channel}.messageid`, msg.id);
                });
            } else {
                await channel.send({ content: `${Data.mesage}` }).then((msg) => {
                    Autos.set(`AutoMsg.${Data.Channel}.messageid`, msg.id);
                });
            }

        } catch (error) {
            return Autos.delete(`AutoMsg.${Data.Channel}`);
        }
    }
}

const convertTime = (time) => {
    const [hour, minute] = time.split(':');
    return `${minute} ${hour} * * *`;
};

function AutoLockChannel(client, automaticos) {
    const existingJobs = schedule.scheduledJobs;
    for (const job in existingJobs) {
        existingJobs[job].cancel();
    }

    for (const guildId in automaticos) {
        const { abrir: lockTime, fechar: unlockTime, channels, serverid } = automaticos[guildId];

        channels.forEach(async (channelId) => {
            const lockTimeConvert = convertTime(lockTime);
            const unlockTimeConvert = convertTime(unlockTime);

            const EMOJI = await obterEmoji();

            schedule.scheduleJob(lockTimeConvert, async () => {
                const guild = client.guilds.cache.get(serverid);
                if (!guild) return;

                const channel = guild.channels.cache.get(channelId);
                if (!channel || channel.type !== ChannelType.GuildText) return;

                try {
                    await channel.permissionOverwrites.edit(guild.roles.everyone, {
                        SendMessages: false
                    });

                    let messagesDeleted = 0;
                    let fetched;
                    do {
                        fetched = await channel.messages.fetch({ limit: 100 });
                        messagesDeleted += fetched.size;
                        await channel.bulkDelete(fetched);
                    } while (fetched.size >= 2);


                    const embed = new EmbedBuilder()
                        .setColor(General.get('oficecolor.main'))
                        .setDescription(`${EMOJI.vx6 == null ? `` : `<:${EMOJI.vx6.name}:${EMOJI.vx6.id}>`} — ${cumprimento()}\nEste canal foi trancado pelo sistema.`)
                        .setFooter(
                            { text: `Horário de Abertura - ${unlockTime}`, iconURL: guild.iconURL({ dynamic: true }) }
                        )

                    await channel.send({
                        embeds: [embed],
                        components: [
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Mensagem Automática")
                                        .setCustomId("khjkhvgfd")
                                        .setStyle("2")
                                        .setDisabled(true),
                                )
                        ]
                    });
                } catch (error) {
                    console.error("Erro ao bloquear canal:", error);
                }
            });

            schedule.scheduleJob(unlockTimeConvert, async () => {
                const guild = client.guilds.cache.get(guildId);
                if (!guild) {
                    return;
                }

                const channel = guild.channels.cache.get(channelId);
                if (!channel || channel.type !== ChannelType.GuildText) {
                    return;
                }

                try {
                    await channel.permissionOverwrites.edit(guild.roles.everyone, {
                        SendMessages: true
                    });

                    let messagesDeleted = 0;
                    const messages = await channel.messages.fetch();
                    messagesDeleted = messages.size;
                    await channel.bulkDelete(messages);

                    const embed123 = new EmbedBuilder()
                        .setColor(General.get('oficecolor.main'))
                        .setDescription(`${EMOJI.vx6 == null ? `` : `<:${EMOJI.vx6.name}:${EMOJI.vx6.id}>`} — ${cumprimento()}\nEste canal foi liberado automaticamente pelo sistema.`)
                        .setFooter(
                            { text: `Horário de Fechamento - ${lockTime}`, iconURL: guild.iconURL({ dynamic: true }) }
                        )

                    await channel.send({
                        embeds: [embed123],
                        components: [
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel("Mensagem Automática")
                                        .setCustomId("jkhjhjkhjkhjkhjk")
                                        .setStyle("2")
                                        .setDisabled(true),
                                )
                        ]
                    });

                } catch (error) {
                    console.error("Erro ao desbloquear canal:", error);
                }
            });
        });
    }
}

function AutoAnnounce(client, ConfigAnnc) {

    if(!ConfigAnnc || ConfigAnnc == null) return;
    const Produtos = products.get(`proodutos`);
    if (Produtos == null || Object.keys(Produtos).length == 0) return;
    
    for (const key in Produtos) {
        const Data = Produtos[key];
        if(Data == null) return;
        if(Object.keys(Data.Campos).length == 0) return;
        if(Data.messageid == null || Data.messageid.length == 0) return;

        const TimeRepost = convertTime(ConfigAnnc);
        schedule.scheduleJob(TimeRepost, async () => {
            try {
                await SendAutoAnnc(client, Data.Config.name);
            } catch (error) {
                console.log(error)
            }
        });
    }
}

async function SendAutoAnnc(client, produtin) {

    const guildIID = await General.get('guildID')
    if(!guildIID) return;
    const guild = await client.guilds.fetch(guildIID);
    if (!guild) return;

    const Valor = products.get(`proodutos.${produtin}`)
    const Valor2 = products.get(`proodutos.${produtin}.Campos`)
    const EMOJI = await obterEmoji();
    const CampoQn = Object.keys(Valor2).length
    const CampoQnty = Number(CampoQn)

    let nameProd = Valor.Config.name
    let descProd = Valor.Config.desc
    let bannerProd = Valor.Config.banner || null;
    let iconProd = Valor.Config.icon || null;

    const item = products.get(`proodutos.${produtin}.messageid`)
    if (CampoQnty == 1) {
        const primeiraChave = Object.keys(Valor2)[0];
        const CampoSelect = Valor2[primeiraChave];
        let nameCampo = CampoSelect.name
        let priceCampo = CampoSelect.price
        let estoqueProd = CampoSelect.stock || [];
        let estoqueCount = estoqueProd.length


        const embed = new EmbedBuilder()
            .setTitle(`${nameProd}`)
            .setDescription(`\`\`\`${descProd}\`\`\``)
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
                { text: guild.name, iconURL: guild.iconURL({ dynamic: true }) }
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
            try {
                const channel = await client.channels.cache.get(element.channelid)
                const msg = await channel.messages.fetch(element.msgid)

                await msg.delete();
                channel.send({ components: [buttonrow], embeds: [embed] }).then((msg) => {
                    products.delete(`proodutos.${produtin}.messageid`)
                    products.push(`proodutos.${produtin}.messageid`, { msgid: msg.id, channelid: msg.channel.id, guildid: msg.guild.id });
                });
            } catch (error) {
                console.log(error)
            }
        }

    } else {
        const allSelectMenus = [];
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
            .setDescription(`\`\`\`${descProd}\`\`\``)
            .setFooter(
                { text: guild.name, iconURL: guild.iconURL({ dynamic: true }) }
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

            try {
                const channel = await client.channels.cache.get(element.channelid)
                const msg = await channel.messages.fetch(element.msgid)

                await msg.delete();
                channel.send({ components: [...rows], embeds: [embed] }).then((msg) => {
                    products.delete(`proodutos.${produtin}.messageid`)
                    products.push(`proodutos.${produtin}.messageid`, { msgid: msg.id, channelid: msg.channel.id, guildid: msg.guild.id });
                });
            } catch (error) {
                console.log(error)
            }
        }
    }
}

module.exports = {
    name: "ready",
    run: async (client) => {
        AutoSendMsg(client);

        setInterval(() => {
            AutoSendMsg(client);
        }, 15 * 60 * 1000)

        let automaticos = readAutolock();
        AutoLockChannel(client, automaticos);

        setInterval(() => {
            const newAutomaticos = readAutolock();
            if (JSON.stringify(newAutomaticos) !== JSON.stringify(automaticos)) {
                automaticos = newAutomaticos;
                AutoLockChannel(client, automaticos);
            }
        }, 10 * 1000);

        let ConfigAnnc = readAutoAnnounce();
        AutoAnnounce(client, ConfigAnnc);

        setInterval(() => {
            const newAutoRepost = readAutoAnnounce();
            if (JSON.stringify(ConfigAnnc) !== JSON.stringify(newAutoRepost)) {
                ConfigAnnc = newAutoRepost;
                AutoAnnounce(client, ConfigAnnc);
            }
        }, 60000);

    }
};

