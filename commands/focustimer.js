const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('focustimer')
		.setDescription('Timer that uses the pomodoro method to enhance your studying efficiency. ')
    .addSubcommand(subcommand =>
  		subcommand
  			.setName('quick start')
  			.setDescription('Easiest way to start the timer'))
        .addStringOption(option =>
            option
              .setName('time')
              .setDescription('How long you plan to study for, in minutes, with 5 minute breaks')
              .setRequired(true)),
  
	async execute(interaction, client) {
   
    if (interaction.options.getSubcommand() == "quick start") {
      time = interaction.options.getString('time')
      if (
        !isNaN(time) ||
        !parseInt(time).isInteger() ||
        parseInt(time) < 0
      ) {
        await interaction.reply({ content: 'gotta be a number, no decimal, more than 0' })
      }

      time = parseInt(time) //total time 
      breaktime = 5
      breakamount = 0
      studytime = 0
      
      if (
        time > 30
      ) {
        breaktime = 5
        breakamount = Math.floor(time/35) 
        studytime = (time - breaktime)/30 
      }
     
      await interaction.reply({ content: `Total time: ${time}\nBreak time: ${breaktime}\nNumber of breaks: ${breakamount}\nLength of each session: ${studytime}`})
    }
	},
};