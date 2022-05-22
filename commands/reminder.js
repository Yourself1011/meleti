const { SlashCommandBuilder } = require('@discordjs/builders');

const parseDate = require('date.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reminder')
		.setDescription('Creates a reminder.')
    .addStringOption(option => option
			.setName('task')
			.setDescription('The task to be reminded about.')
			.setRequired(true)
		)
		.addStringOption(option => option
			.setName('time')
			.setDescription('When to be reminded.')
			.setRequired(true)
		),
  
	async execute(interaction, client) {
		const timestamp = parseDate(interaction.options.time);
		
   	await interaction.reply({ content: `Ok. I will remind you about ${interaction.options.reminder} <t:${timestamp}:R>.` })
		console.log('yayhoo')
  
	},
};