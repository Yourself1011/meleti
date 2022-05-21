const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Shows info about the origins, creators, and purpose of the bot.'),
  
	async execute(interaction, client) {
    await interaction.reply({ content: '***Meleti***: Greek for study. \n\nMeleti was created at Jamhacks 6, from May 20 2022 to May 22 2022. It was created by Daniel Zhang, Li Feng Yin, Jeffrey Zang, and Jashanpreet Singh. It\'s purpose is to have all the productivity essentials in one easy-to-access place. ' })
	},
};