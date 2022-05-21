const { SlashCommandBuilder } = require('@discordjs/builders');
const {db, newUser} = require("../db.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('Everything to do with points'),
  
	async execute(interaction, client) {
		
	},
    async addPoints(user, amount, interaction, reason = undefined, followup = false) {
        let userID = user.id
        
        if (!await db.get(userID)){
            await newUser(userID)
        }

        let dtb = db.get(userID)
        dtb.points += amount

        db.set(userID, dtb)

        if (followup){
            interaction.followup({content: `You earned ${amount} points` + reason ? `for ${reason}!` : "!", ephemeral: true})
        } else {
            interaction.reply({content: `You earned ${amount} points` + reason ? `for ${reason}!` : "!", ephemeral: true})
        }
    }
};