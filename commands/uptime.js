const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed } = require('discord.js')
const ms = require('ms')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Gets the uptime of the bot.'),
  
	async execute(interaction, client) {

		interaction.reply({ content: `I have been awake for ${ms(client.uptime, { long: true})}.` })
	},
};