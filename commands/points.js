const { SlashCommandBuilder } = require('@discordjs/builders');
const {db, newUser} = require("../db.js")
const {allartifacts} = require("./artifacts.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('View and redeem your points. Points are gained in various ways.')
        .addSubcommand(subcommand => subcommand
            .setName("view")
            .setDescription("View how many points you have")
        )

        .addSubcommand(subcommand => subcommand
            .setName('redeem')
            .setDescription('Redeem 30 points for a chance to earn some cool artifacts')
    ),
  
	async execute(interaction, client) {
        let user = await db.get(interaction.user.id)
        let userID = interaction.user.id
        
        if (!await db.get(userID)){
            await newUser(userID)
        }
        
        if (interaction.options.getSubcommand() == "view") {
            await interaction.reply({content: `You have **${user.points}** points! Redeem them for a chance to get an artifact!`})
        }

        if (interaction.options.getSubcommand() == 'redeem') {
          if (user.points < 30) {
            await interaction.reply({content: 'You must have more than 30 points to redeem, earn points by studying with focus timers or completing tasks'})
              return
          }
          user.points -= 30;
            let level = Math.random()

            if (level <= 0.5){
                level = 1
            } else if (level > 0.5 && level <= 5/6) {
                level = 2
            } else {
                level = 3
            }

            let rarityArtifacts = Object.values(allartifacts).filter(x => x.level == level)

            let artifactIndex = Math.floor(Math.random() * Object.keys(rarityArtifacts).length)

            let artifact = rarityArtifacts[artifactIndex]

            let dupemsg = ""

            if (user.artifacts.find(x => x.artifact == artifact.name)) {
                user.artifacts.find(x => x.artifact == artifact.name).count += 1
                dupemsg = `Duplicate! You now have ${user.artifacts.find(x => x.artifact == artifact.name).count} ${artifact.name}(s)`
            } else {
                user.artifacts.push({artifact: artifact.name, count: 1})
                dupemsg = "New artifact!"
            }
            
            await db.set(userID, user)
            await interaction.reply({ content: `You got a level ${level} ${artifact.name} ${artifact.emoji}\n${dupemsg}` })
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
            interaction.followUp({content: `:tada: You earned +\`${amount}\` point(s)` + (reason ? ` for ${reason}! :tada:` : "! :tada:"), ephemeral: true})
        } else {
            interaction.reply({content: `:tada: You earned +\`${amount}\` point(s)` + (reason ? ` for ${reason}! :tada:` : "! :tada:"), ephemeral: true})
        }
    }
};