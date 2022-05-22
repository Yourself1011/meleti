const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed } = require('discord.js')
const {addPoints} = require("./points.js")
const wait = require('node:timers/promises').setTimeout;


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
          .setName('studylength')
          .setDescription('Length of each interval of studying')
          .setRequired(true))
  
        .addStringOption(option =>
      option
          .setName('breaklength')
          .setDescription('Length of each break')
          .setRequired(true))
    
      .addStringOption(option =>
        option
          .setName('amountofintervals')
          .setDescription('Total number of breaks and focus sessions')
          .setRequired(true))
),
  
	async execute(interaction, client) {
   
    if (interaction.options.getSubcommand() == "quickstart") {
      time = interaction.options.getString('time')
      if (
        isNaN(time) //||
      ) {
        await interaction.reply({ content: 'Has to be a number, no decimal, more than 0'}); return
      }

      if (
        time.includes('.') ||
        parseInt(time) < 0
      ) {
        await interaction.reply({ content: 'Has to be a number, no decimal, more than 0'}); return
      }
      
      time = parseInt(time)
      breaktime = 5
      breakamount = 0
      studytime = 0
      intervals = 1

      if (time <= 30) {studytime = time}
      
      if (
        time > 30
      ) {
        breaktime = 5
        breakamount = Math.floor(time/35) 
        console.log(time-breaktime, breakamount+1)
        studytime = (time - breaktime)/(breakamount+1)
        intervals = breakamount+breakamount+1
      }}

    if (interaction.options.getSubcommand() == 'custom') {
      breaktime = interaction.options.getString('breaklength')
      studytime = interaction.options.getString('studylength')
      intervals = interaction.options.getString('amountofintervals')
      breakamount = Math.floor(intervals/2)
      time = breakamount*breaktime + Math.ceil(intervals/2)*studytime
    }
     
      await interaction.reply({ embeds: [ new MessageEmbed({
				title: 'Focus session started',
				description: `Total study time: **${time} mins**\nBreak time per break: **${breaktime} mins**\nNumber of breaks: **${breakamount} breaks**\nLength of each session: **${studytime} mins**`,
				color: '#FF6346'
			}) ]});

      intervallist = []
      for (let i = 0; i < intervals; i++) {
        if (i % 2 == 0) {
          intervallist.push([0, studytime])
        } else {
          intervallist.push([1, breaktime])
        }
      }

      for (let j = 0; j < intervallist.length - 1; j += 2) {
        
        await wait(intervallist[j][1] * 60000)
        
        await interaction.followUp(`<@${interaction.user.id}> Your focus session has ended! Now begins a 5 minute break.`) 
        // timeoutstuff(interaction, intervallist, j)  
        await wait(intervallist[j+1][1] * 60000)

        await interaction.followUp(`<@${interaction.user.id}> Your break session has ended! Now begins a ${studytime} minute focus session.`) 
      }

    if (intervallist.length % 2){
        await wait(intervallist[intervallist.length - 1][1]*60000)
    }

      await interaction.followUp(`<@${interaction.user.id}> you just completed ${time} minutes of studying!`)
      addPoints(interaction.user, time, interaction, reason = `focusing for ${time} minutes`, doFollowUp = true)
      
    
	},
};