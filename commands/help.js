const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('node:fs');
const path = require('node:path');

let commands = []

const commandsPath = './commands'
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    commands.push({name: file.split(".")[0], value: file.split(".")[0]});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows a list of commands, or info on specific commands.')
    .addStringOption(option => 
        option
            .setName("command")
            .setDescription("Get more info on a certain command")
            .setRequired(false)
            .addChoices(...commands)
    ),
  
	async execute(interaction, client) {
        
		let commands = client.commands;
        
		if (interaction.options.getString("command")) {
            let command = client.commands.get(interaction.options.getString("command"))
            await interaction.reply(`**__Name: ${command.data.name}__**\n\nDescription: ${command.data.description}`)
            return
        }

        let names = commands.map(x => x.data.name)
        
        await interaction.reply({ content: "`" + names.join("`, `") + "`" });
	},
  
};