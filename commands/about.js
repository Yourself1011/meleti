const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Shows info about the origins, creators, and purpose of the bot.'),
  
	async execute(interaction, client) {
		const embed = new MessageEmbed({
			title: '***Meleti***: Greek for study',
			description: 'Meleti was created at Jamhacks 6, from May 20 2022 to May 22 2022. It was created by Daniel Zhang, Li Feng Yin, Jeffrey Zang, and Jashanpreet Singh. Its purpose is to have all the productivity essentials in one easy-to-access place.\n\nLink to invite: https://discord.com/invite/wyPGW6Asbx',
			color: '#5865f2'
		})
    await interaction.reply({ embeds: [ embed ] })
	},
};