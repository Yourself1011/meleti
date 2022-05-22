const { SlashCommandBuilder } = require('@discordjs/builders');

const math = require('mathjs')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('calculate')
		.setDescription('Calculate expressions!')
        .addStringOption(option => option
            .setName("expression")
            .setDescription("The expression you want to get calculated")
						.setRequired(true)
        )
    ,
  
	async execute(interaction, client) {
		let input = interaction.options.getString("expression")
    // The input is coming from discord

		try {
			const evaluated = math.evaluate(input)
			interaction.reply({ content: `The answer is \`${evaluated}\``})
		}
		catch (e) {
			interaction.reply({ content: 'Oops! Something went wrong with the calculation. No offense or anything, but it\'s most likely your fault. ' })
		}
	},
  
};