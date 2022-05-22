const { SlashCommandBuilder } = require('@discordjs/builders');
const {addPoints} = require("./points.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('focustimer')
		.setDescription('Timer that uses the pomodoro method to enhance your studying efficiency. ')
    .addSubcommand(subcommand =>
  		subcommand
  			.setName('quickstart')  
  			.setDescription('Easiest way to start the timer')
        .addStringOption(option =>
            option
          .setName('time')
          .setDescription('How long you plan to study for, in minutes, with 5 minute breaks')
          .setRequired(true)))
    .addSubcommand(subcommand =>
  		subcommand
  			.setName('custom')
  			.setDescription('Customize study lengths, break lengths, and intervals')
        .addStringOption(option =>
            option
          .setName('time')
          .setDescription('How long you plan to study for, in minutes, with 5 minute breaks')
          .setRequired(true))),
  
	async execute(interaction, client) {
   
    if (interaction.options.getSubcommand() == "quickstart") {
      time = interaction.options.getString('time')
      if (
        isNaN(time) //||
      ) {
        await interaction.reply({ content: 'gotta be a number, no decimal, more than 0'}); return
      }

      if (
        time.includes('.') ||
        parseInt(time) < 0
      ) {
        await interaction.reply({ content: 'gotta be a number, no decimal, more than 0'}); return
      }
      
      time = parseInt(time)
      breaktime = 5
      breakamount = 0
      studytime = 0
      intervals = 1

      if (time < 30) {studytime = time}
      
      if (
        time > 30
      ) {
        breaktime = 5
        breakamount = Math.floor(time/35) 
        console.log(time-breaktime, breakamount+1)
        studytime = (time - breaktime)/(breakamount+1)
        intervals = breakamount+breakamount+1
      }
     
      await interaction.reply({ content: `<@${interaction.user.id}>  **Started a focus session**\n\nTotal study time: **${time} mins**\nBreak time per break: **${breaktime} mins**\nNumber of breaks: **${breakamount} breaks**\nLength of each session: **${studytime} mins**`})

      intervallist = []
      for (let i = 0; i < intervals; i++) {
        if (i % 2 == 0) {
          intervallist.push([0, studytime])
        } else {
          intervallist.push([1, 5])
        }
      }

      await interaction.followUp({ content: `A focus session ${intervallist[0][1]} mins long is starting! You will be notified when it ends.` })

      for (let j = 0; j < intervallist.length; j++) {
        setTimeout(
          async function() {
            if (intervallist[j][0] == 0 && j+1 < intervallist.length) {
            await interaction.followUp(`<@${interaction.user.id}> Your focus session has ended! Now begins a 5 minute break.`) }
            if (intervallist[j][0] == 1) {
            await interaction.followUp(`<@${interaction.user.id}> Your 5 minute break has ended! Get back to focusing!`)
            }
                     },
          
          (intervallist[j][1])*60000)
        }

      await interaction.followUp(`<@${interaction.user.id}> you just completed ${time} minutes of studying! You earned ${time} points!`)
      addPoints(interaction.user, time, interaction, reason = `focusing for ${time} minutes`, doFollowUp = true)
      
    }
	},
};