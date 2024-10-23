const { InteractionType } = require("discord.js");

module.exports = {
    name:"interactionCreate",
    run:async(interaction, client) => {

        if(interaction.type === InteractionType.ApplicationCommand){

            const cmd = client.slashCommands.get(interaction.commandName);
      
            if (!cmd) return interaction.reply(`Error`);
      
            interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
      
            cmd.run(client, interaction)
      
         };
    }
}