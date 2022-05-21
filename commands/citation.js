
const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('citation')
		.setDescription('Creates a citation')
		.addStringOption(option => option
				.setName('format')
				.setDescription('The format of the citation')
				.setRequired(false)
				.addChoices(
					{
						name: 'APA',
						value: 'apa'
					},
					{
						name: 'MLA',
						value: 'mla'
					},
					{
						name: 'CMS',
						value: 'cms'
					}
				)
		)
};