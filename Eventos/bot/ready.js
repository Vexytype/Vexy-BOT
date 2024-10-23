const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, RoleSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const colors = require("colors");
const { Reiniciarapp } = require("../../Functions/mensagemauto");
const { General, carrinhos } = require("../../Database");
const { obterEmoji } = require("../../Functions/definicoes")
const status = General.get('APP.STATUS')



async function deleteCarts(client) {
  const agora = new Date();
  const tempoExpiracao = 10 * 60 * 1000; 

  const usuarios = carrinhos.all(); 

  const guild = await client.guilds.fetch(General.get('guildID'));
  if (!guild) return;

  for (const { ID: userID, data: carrinhosDoUsuario } of usuarios) {
    for (const cartID in carrinhosDoUsuario) {
      const carrinho = carrinhosDoUsuario[cartID];


      const dataCriacao = new Date(carrinho.creationDate);
      const tempoDecorrido = agora - dataCriacao;

      if (carrinho.StatusBuy === 'pending' && tempoDecorrido >= tempoExpiracao) {
        try {
          const membro = guild.members.cache.get(userID);
          const LogVenda = await client.channels.cache.get(General.get('logsVendas'));
          const channel = await client.channels.fetch(carrinho.idCart);
          if (channel) {
            const EMOJI = await obterEmoji();
            
            if(membro){
              membro.send({
                content: ``, embeds: [
                  new EmbedBuilder()
                    .setAuthor({ name: `Pedido Cancelado`, iconURL: "https://cdn.discordapp.com/emojis/1296861882266681384.webp?size=96&quality=lossless" })
                    .setDescription(`${EMOJI.vx6 == null ? `` : `<:${EMOJI.vx6.name}:${EMOJI.vx6.id}>`} Olá ${membro}, Seu pedido foi cancelado devido a falta de interação.\nO tempo para o pagamento se encerrou, abra outro carrinho se necessário.`)
                    .addFields(
                      {
                        name: `${EMOJI.vx5 == null ? `` : `<:${EMOJI.vx5.name}:${EMOJI.vx5.id}>`} ID do Pedido`, value: `\`${carrinho.idCart}\``, inline: true
                      },
                      {
                        name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`} Valor`, value: `\`R$ ${Number(carrinho.valor).toFixed(2)}\``, inline: true
                      },
                      {
                        name: `${EMOJI.vx7 == null ? `` : `<:${EMOJI.vx7.name}:${EMOJI.vx7.id}>`} Informações do Carrinho`, value: `\`x${carrinho.quantidade}\` - ${carrinho.itemBuy}`, inline: false
                      },
  
                    )
                    .setColor(General.get('oficecolor.red') || '#FF8201')
                    .setFooter(
                      { text: guild.name, iconURL: guild.iconURL({ dynamic: true }) }
                    )
                    .setTimestamp()
              ]
              });
  
            }

            if(LogVenda){
              LogVenda.send({content:``, embeds:[
                new EmbedBuilder()
                    .setAuthor({ name: `Pedido Cancelado`, iconURL: "https://cdn.discordapp.com/emojis/1296861882266681384.webp?size=96&quality=lossless" })
                    .setDescription(`O tempo para o pagamento se expirou, entre em contato com ${membro == null ? `o usuário` : `<@${membro}>`}, não perca seu cliente!`)
                    .addFields(
                        {
                            name: `${EMOJI.vx5 == null ? `` : `<:${EMOJI.vx5.name}:${EMOJI.vx5.id}>`} ID do Pedido`, value: `\`${carrinho.idCart}\``, inline: true
                        },
                        {
                            name: `${EMOJI.vx11 == null ? `` : `<:${EMOJI.vx11.name}:${EMOJI.vx11.id}>`} Valor`, value: `\`R$ ${Number(carrinho.valor).toFixed(2)}\``, inline: true
                        },
                        {
                            name: `${EMOJI.vx7 == null ? `` : `<:${EMOJI.vx7.name}:${EMOJI.vx7.id}>`} Informações do Carrinho`, value: `\`x${carrinho.quantidade}\` - ${carrinho.itemBuy}`, inline: false
                        },

                    )
                    .setColor(General.get('oficecolor.red') || '#FF8201')
                    .setFooter(
                        { text: guild.name, iconURL: guild.iconURL({ dynamic: true }) }
                    )
                    .setTimestamp()
              ]});
            }
            channel.delete();
            carrinhos.delete(`${userID}.${cartID}`);
          }
        } catch (error) {
          console.error(`Erro ao tentar deletar o canal ${carrinho.idCart}:`, error);
        }
      }
    }

    const carrinhosRestantes = carrinhos.get(userID);
    if (!carrinhosRestantes || Object.keys(carrinhosRestantes).length === 0) {
      carrinhos.delete(userID);
    }
  }
}

module.exports = {
  'name': "ready",
  'run': async (client) => {
    const userrs = client.users.cache.size
    if (status !== null) {
      client.user.setActivity(status);
    }
    Reiniciarapp(client);

    setInterval(async () => { await deleteCarts(client) }, 5000);

    console.clear();
    console.log(colors.green('[STATUS]') + " " + client.user.username + " acabou de iniciar.");
    console.log(colors.green("[STATUS]") + " Online em " + client.guilds.cache.size + " servidores");
    console.log(" ");
    console.log(colors.grey("[OWNER]") + " @rayn");
    console.log(colors.cyan("[UPDATES]") + " Atualizações em https://github.com/Vexytype");
  }
};