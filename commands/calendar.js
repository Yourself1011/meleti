
const { SlashCommandBuilder } = require('@discordjs/builders');
const calendarLink = require('calendar-link')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('calendar')
		.setDescription('Adds an event to a Calendar.')
		.addStringOption(option => option
				.setName('calendakjdhr')
				.setDescription('The calendar provider to add the event to (eg. Google Calendar)')
				.setRequired(true)
				.addChoices(
					{
						name: 'Google Calendar',
	          value: 'google'
					},
					{
						name: 'Yahoo! Calendar',
						value: 'yahoo'
					},
					{
						name: 'Microsoft Outlook',
						value: 'outlook'
					},
					{
						name: 'Office 365',
						value: 'office365'
					}
				)
		)
		.addStringOption(option => option
				.setName('title')
				.setDescription('The title of the event.')
		)
		.addStringOption(option => option
				.setName('description')
				.setDescription('The description of the event.')
		)
		.addStringOption(option => option
				.setName('start-time')
				.setDescription('The starting time of the event.')
		)
		.addStringOption(option => option
				.setName('duration')
				.setDescription('How long the event lasts (eg. 3 hours). Can also be set to all-day.')
		)
	,
	

	
	async execute(interaction, client) {
			interaction.reply({ 
				content: calendarLink[interaction.options.calendar](
					{
						title: interaction.options.title,
						description: interaction.options.description,
						start: interaction.options['start-time'],
						duration: interaction.options['duration']
					}
				)
			})
		
	},
};