const { SlashCommandBuilder } = require('@discordjs/builders');

const {db, newUser} = require("../db.js")

const allartifacts = {
  bone: {
    emoji: ':bone:',
    name: 'Bone',
    desc: '**Bone**\nScientific name "osseous"\nBone is connective tissue made up of calcium. It is the structural foundation of most mammals and birds, providing a base for nerves and muscle.',
    level: '1'
  },
  skull: {
    emoji: ':skull:',
    name: 'Skull',
    desc: '**Skull**\nScientific name "cranium"\nThe skull is made of similar tissue to bone, but it is more dense. It is the protective barrier for the brain.',
    level: '1'
  },
  claypot: {
    emoji: ' <:claypot:977788421508563004>',
    name: 'Clay Pot',
    desc: '**Clay Pot**\nA basic storage unit, commonly used for water and food. The first forms of pottery were found in China. They are dated to be about 20,000 years old.',
    level: '1'
  },
  dinosaurfossil: {
    emoji: '<:dinofossil:977787024511741992>',
    name: 'Dinosaur Fossil',
    desc: '**Dinosaur Fossil**\nDinosaurs lived on Earth for 165 million years. The first dinosaur fossils were found by Ferdinand Hayden in 1854. Over 700 different dinosaur types were found, the most famous being the Tyrannosaurus Rex.',
    level: '1'
  },
  amber: {
    emoji: '<:amber:977789283819745302>',
    name: 'Amber',
    desc: '**Amber**\nAmber is fossilized tree sap, often found with trapped insects inside.',
    level: '1'
  },
  romanhelmet: {
    emoji: '<:romanhelmet:977791482616492092>',
    name: 'Roman Helmet',
    desc: '**Roman Helmet**\nAlso commonly known as the gladiator helmet, these helmets were used by soldiers, generals, and people fighting in the gladiator arena.',
    level: '2'
  },
  samuraiswords: {
    emoji: '<:katana:977793117287743499>',
    name: 'Samurai Swords',
    desc: '**Samurai Swords**\nThe common, recognizable weapon of Japanese Samurai. They were known for performing military service for nobles.',
    level: '2'
  },
  megalodontooth: {
    emoji: ':shark:',
    name: 'Megalodon Tooth',
    desc: '**Megalodon**\nMegalodon means "big tooth". It was an extinct species of shark that lived in the water 23 million years ago. They are known for being incredibly huge, 15 to 18 metres in length.',
    level: '2'
  },
  pharaoh: {
    emoji: '<:pharaoh:977797513916600401>',
    name: 'Pharaoh',
    desc: '**Pharaoh**\nPharaohs were the supreme rulers of Egypt. They believed that when they died, their soul would live on in the afterlife.',
    level: '3'
  },
  hopediamond: {
    emoji: ':gem:',
    name: 'Hope Diamond',
    desc: '**Hope Diamond**\nThe Hope Diamond is one of the biggest diamonds in the world, and is one of the most cursed objects in the world. Its curse is said to have killed 13 people.',
    level: '3'
  },
}

module.exports = {
    allartifacts: allartifacts,
	data: new SlashCommandBuilder()
		.setName('artifacts')
		.setDescription('Shows info about artifacts')
    .addSubcommand(subcommand =>
  		subcommand
  			.setName('view')  
  			.setDescription('See artifacts that you own')
            .addStringOption(option => option
                .setName("artifact")
                .setDescription("Get more info on a specific artifact")
            )
  ),

  	async execute(interaction, client) {
      let user = await db.get(interaction.user.id)
      let userID = interaction.user.id

      msg = ''
      console.log(user.artifacts)
      
      if (interaction.options.getSubcommand() == "view") {
          console.log(user.artifacts, user.artifacts == 0)
        if (interaction.options.getString("artifact")) {
            let artifact = interaction.options.getString("artifact")
            
            if (!allartifacts[artifact.toLowerCase().replace(" ", "")]) {
                await interaction.reply({content: "That artifact does not exist!"})
                return
            }

            artifact = allartifacts[artifact.toLowerCase().replace(" ", "")]
            
            await interaction.reply({content: `**${artifact.name} ${artifact.emoji}**\n\n${artifact.desc}\nLevel: ${artifact.level}`})
            return
        }
          
        if (user.artifacts == 0) {
            console.log("SDJFKLDSJFLDSJFLDSJFDSJFDSJFLJ")
          await interaction.reply({ content: 'You don\'t have any artifacts, redeem points to get more'})
            return
      }
        for (i of user.artifacts) {
          console.log(user.artifacts[i.artifact.toLowerCase().replace(" ", "")])
          name = i.artifact
          emoji = allartifacts[i.artifact.toLowerCase().replace(" ", "")].emoji
          amount = i.count
          msg += `${emoji} **${name}** (x${amount})\n`
        }
        await interaction.reply({content: msg})
      }
      
    }
  
}
