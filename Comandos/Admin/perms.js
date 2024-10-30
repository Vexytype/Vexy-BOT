const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { General } = require("../../Database/index");
const Discord = require("discord.js")

module.exports = {
    name: "setowner", 
    description: "[PERMS] Set owner app",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'keyowner',
            description: 'Insira a key para setar owner.',
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],

    run: async(client, interaction) => {

        let key = interaction.options.getNumber('keyowner');

        const ownerID = interaction.user.id

        let keySet = await General.get("key")

        const guildIDowner = interaction.guild.id

        if (key == keySet) {
            General.delete('key');

            await General.set(`owner`, ownerID);
            await General.set(`guildID`, guildIDowner);

            return interaction.reply({content:`O usuário <@${interaction.user.id}> foi definido como dono da aplicação.`, ephemeral:true});
        } else {

            await interaction.reply({content:`A key fornecida está incorreta.`, ephemeral:true});
        }

    }
}