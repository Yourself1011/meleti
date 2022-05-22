const { SlashCommandBuilder } = require('@discordjs/builders');
const {db, newUser} = require("../db.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('Everything to do with points')
        .addSubcommand(subcommand => subcommand
            .setName("view")
            .setDescription("View how many points you have")
        ),
  
	async execute(interaction, client) {
        if (interaction.options.getSubcommand() == "view") {
    		let user = await db.get(interaction.user.id)
            await interaction.reply({content: `You have **${user.points}** points! Redeem them for a chance to get an artifact!`})
        }
	},
    async addPoints(user, amount, interaction, reason = undefined, doFollowUp = false) {
        let userID = user.id
        
        if (!await db.get(userID)){
            await newUser(userID)
        }

        let dtb = await db.get(userID)
        dtb.points += amount

        db.set(userID, dtb)

        if (doFollowUp){
            interaction.followUp({content: `You earned ${amount} point(s)` + (reason ? ` for ${reason}!` : "!"), ephemeral: true})
        } else {
            interaction.reply({content: `You earned ${amount} point(s)` + (reason ? ` for ${reason}!` : "!"), ephemeral: true})
        }
    }
};