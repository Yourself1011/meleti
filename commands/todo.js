const { SlashCommandBuilder } = require('@discordjs/builders');
const {db, newUser} = require("../db.js");
const {addPoints} = require("./points.js")
const wait = require('node:timers/promises').setTimeout;
const calendarLink = require('calendar-link').google;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('todo')
		.setDescription('To-do list of your tasks, assignments, and reminders.')
  	.addSubcommand(subcommand =>
  		subcommand
  			.setName('view')
  			.setDescription('Shows all of your upcoming tasks.')
    )
    .addSubcommand(subcommand =>
  		subcommand
  			.setName('add')
  			.setDescription('Add tasks to your to-do list.')
        
        .addStringOption(option =>
        option
            .setName('date')
            .setDescription('The date that the task will be set on MM DD YYYY')
      			.setRequired(true))
      
        .addStringOption(option =>
          option
            .setName('time')
            .setDescription('The time that the task will be set on HH:MM, 24 hour clock')
            .setRequired(true))

        .addStringOption(option =>
        option.setName('name')
            .setDescription('The name of the task')
      			.setRequired(true))
    )
  	.addSubcommand(subcommand =>
  		subcommand
  			.setName('delete')
  			.setDescription('Deletes a task.')
            .addStringOption(option => 
              option
                .setName("task")
                .setDescription("the task to delete")
                .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("complete")
            .setDescription("Completes a task.")
            .addStringOption(option => 
              option
                .setName("task")
                .setDescription("the task to delete")
                .setRequired(true)
        )
    )
    ,

	async execute(interaction) {
    let userID = interaction.user.id
        
    if (interaction.options.getSubcommand() == "delete"){
        let user = await db.get(userID)
        let task = interaction.options.getString("task")

        if (!user || user.tasks == 0) {
            await interaction.reply({content: "You don't have any tasks to delete!"})
        } else if (!user.tasks.find(x => x.name == task)) {
            await interaction.reply({content: "You don't have a task with that name"})
        } else {
            let dtb = await db.get(userID)
            dtb.tasks = dtb.tasks.filter(x => x.name != task)
            db.set(userID, dtb)
            await interaction.reply({content: `Succesfully removed the task with the name \`${task}\``})
        }
    }

    if (interaction.options.getSubcommand() == "complete") {
        let user = await db.get(userID)
        let task = interaction.options.getString("task")

        if (!user || user.tasks == 0) {
            await interaction.reply({content: "You don't have any tasks to complete"})
        } else if (!user.tasks.find(x => x.name == task)) {
            await interaction.reply({content: "You don't have a task with that name"})
        } else {
            let dtb = await db.get(userID)
            dtb.tasks = dtb.tasks.filter(x => x.name != task)
            db.set(userID, dtb)
            await interaction.reply({content: `Succesfully completed the task with the name \`${task}\`! :partying_face:`})
            await addPoints(interaction.user, 10, interaction, reason = "completing a task", doFollowUp = true)
        }
    }
                            
    if (interaction.options.getSubcommand() == "view") {
        let user = await db.get(userID)
        
        if (!user || user.tasks == 0) {
            await interaction.reply({content: "Tasks all done! Go relax! NOW!"})
        } else {
            let tasks = user.tasks
            let content = ""
            let date
            
            for (i of tasks){
                date = Math.floor(new Date(i.date).getTime()/1000)
                content += `**${i.name}**\nComplete before: <t:${date}:f> (<t:${date}:R>)\n\n`
            }
            
            await interaction.reply({content: content + "In your timezone"})
        }
    }

    if (interaction.options.getSubcommand() == 'add') {
      
      edate = interaction.options.getString('date')
      time = interaction.options.getString('time')
      name = interaction.options.getString('name')

    let date = new Date(edate + " " + time)
        
      if (date == "Invalid Date") {
        await interaction.reply({ content: 'Enter a valid date please.' })
      }
        
      id = interaction.user.id
      if (!await db.get(id)) {
          await newUser(id)
      }

      // date = new Date(`${month}/${day}/${year}`)
      // dateStr = date.toString();

        let dtb = await db.get(id)
        
      dtb.tasks.push(
        {
          name: name,
          date: date,
        }

      );
      await db.set(id, dtb)
      await interaction.reply({ content: `<@${interaction.user.id}> has created a new task called ${name}, which should be done before <t:${Math.floor(date.getTime()/1000)}:f> (your timezone)`})

			await interaction.followUp({ content: 'Here is a link to add this task to your Google Calendar. ' + calendarLink({
				title: name,
				start: date
			})})

        let difference = date.getTime() - Date.now()
        let elapsed = 0

        // console.log(difference)
        
        if (difference >= 24*60*60*1000){
            // console.log(difference - 24*60*60*1000)
            
            await wait(difference - 24*60*60*1000)
            elapsed += difference - 24*60*60*1000
            await interaction.channel.send({content: `<@${id}> 24 hours until \`${name}\``})
            // console.log("24h")

            user = await db.get(id)
            if (!user.tasks.find(x => x.name == name)) {
                return
            }
        }
        if (difference >= 6*60*60*1000){
            // console.log(difference - 6*60*60*1000 - elapsed)
            
            await wait(difference - 6*60*60*1000 - elapsed)
            elapsed += difference - 6*60*60*1000
            await interaction.channel.send({content: `<@${id}> 6 hours until \`${name}\``})
            // console.log("6h")

                user = await db.get(id)
            if (!user.tasks.find(x => x.name == name)) {
                return
            }
        }
        if (difference >= 60*60*1000){
            // console.log(difference - 60*60*1000 - elapsed)
            
            await wait(difference - 60*60*1000 - elapsed)
            elapsed += difference - 60*60*1000
            await interaction.channel.send({content: `<@${id}> 1 hours until \`${name}\``})
            // console.log("1h")

                user = await db.get(id)
            if (!user.tasks.find(x => x.name == name)) {
                return
            }
        }
        
        await wait(difference - elapsed)
        await interaction.channel.send({content: `<@${id}> \`${name}\` must be done NOW!`})
            // console.log("0h")

                user = await db.get(id)
            if (!user.tasks.find(x => x.name == name)) {
                return
            }
    }
  }
}