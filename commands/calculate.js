const { SlashCommandBuilder } = require('@discordjs/builders');

const math = require('mathjs')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('calculate')
		.setDescription('Calculate expressions!')
        .addStringOption(option => option
            .setName("expression")
            .setDescription("The expression you want to get calculated")
        )
    ,
  
	async execute(interaction, client) {
		let input = interaction.options.getString("expression")
    // The input is coming from discord

		interaction.reply({ content: 'The answer is: ' + math.evaluate(input) })
	},
  
};