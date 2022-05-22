const { SlashCommandBuilder } = require('@discordjs/builders');

const {db, newUser} = require("../db.js")
const { MessageEmbed } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Shows the leaderboard in the server.'),

  	async execute(interaction, client) {
				return interaction.reply({ content: 'Sorry, this command does not work.'});
				const leaderboard = []
				const list = await db.list()

				list.forEach(async mKey => {
					let user = await db.get(mKey)
					if (user !== null) {
						leaderboard.push({ 
							id: user.id,
							points: user.points
						})
					}
		
					leaderboard.sort((a, b) => a.points - b.points)
					
		      const embed = new MessageEmbed({
						title: 'Leaderboard',
						description: leaderboard.map(m => `**<@${m.id}>**: ${m.points} points`).join('\n') || 'No one has points!',
						color: '#244698'
					})
			
					return interaction.reply({ embeds: [ embed ] })
				})
			}
 
}
