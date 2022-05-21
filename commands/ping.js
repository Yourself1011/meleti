const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed } = require('discord.js')

const {addPoints} = require("./points.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Finds latency (lag), a.k.a ping.'),
  
	async execute(interaction, client) {
    await interaction.reply({ content: ':ping_pong: Pinging...', fetchReply: true })
			.then(async message => {
				var ping = Date.now() - message.createdTimestamp;
				const embed = new MessageEmbed({
					title: ":ping_pong: Pong!",
				  description: `**Message Latency**: ${ping}\n**API Latency**: ${client.ws.ping}`,
					color: '#FF2233'
				})
				await interaction.editReply({ embeds: [ embed ]})
			})
    await addPoints(interaction.user, 1, interaction, "being cool and stuff", true)
	},
};