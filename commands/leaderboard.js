const { SlashCommandBuilder } = require('@discordjs/builders');

const {db, newUser} = require("../db.js")
const { MessageEmbed } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Shows the leaderboard in the server.'),

  	async execute(interaction, client) {
			const leaderboard = []
			interaction.guild.members.list().forEach(async m => {
				console.log(m.id, await db.get(m.id))
				let user = await db.get(m.id)
				if (user !== null) {
					leaderboard.push({ 
					id: m.id,
					name: m.displayName,
					points: user.points
				})
				}
			})

			leaderboard.sort((a, b) => a.points - b.points)
			
      const embed = new MessageEmbed({
				title: 'Leaderboard',
				description: leaderboard.map(m => `**${m.name}**: ${m.points} points`).join('\n') || 'No one has points!',
				color: '#244698'
			})
	
			interaction.reply({ embeds: [ embed ] })
    }
  
}
