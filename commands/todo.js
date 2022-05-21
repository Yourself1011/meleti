const { SlashCommandBuilder } = require('@discordjs/builders');


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
    )
    ,

	async execute(interaction) {
    if (interaction.options.getSubcommand() == "view") {
      await interaction.reply({ content: 'lol' })
    }

    if (interaction.options.getSubcommand() == 'add') {
      
      edate = interaction.options.getString('date')
      time = interaction.options.getString('time')
      name = interaction.options.getString('name')

      // try { //make sure they have their stuff formatted properly
      //   datecopy = date.split(' ')
      //   day = datecopy[0]
      //   month = datecopy[1]
      //   year = datecopy[2]

      //   timecopy = time.split(':')
      //   hour = timecopy[0]
      //   minute = timecopy[1]
      // } catch {
      //   await interaction.reply({ content: 'Please make sure you have it formatted it as follows: DD MM YYYY, HH:MM (24 hour clock)' })
      // }

    let date = new Date(edate + " " + time)
        
      if (
        date == "Invalid Date"
      ) {
        await interaction.reply({ content: 'Enter a valid date' })
      }

      // if ( //check if they are all numbers
      //   !isNaN(day) ||
      //   !isNaN(month) ||
      //   !isNaN(year) ||
      //   !isNaN(hour) ||
      //   !isNaN(minute)
      // ) {
      //   await interaction.reply({ content: 'Make sure to use numbers' })
      // }

      // if ( //check if time is formatted properly
      //   !parseint(hour) > 23 ||
      //   !parseint(hour) < 0 ||
      //   !parseint(minute) > 59 ||
      //   !parseint(minute) < 0
      // ) {
      //   await interaction.reply({ content: 'Please put an actual time'})
      // }

    
        
      id = interaction.user.id
      try {
        person = db.get(id)
      } catch {
        db.set(interaction.user.id, {  
          tasks: []
        })
      }

      date = new Date(`${month}/${day}/${year}`)
      date = date.toString();
      
      db.get(id).tasks.push(
        {
          name: name,
          time: time,
          date: date
        }
      );
      await interaction.reply({ content: `${interaction.user.mention} has created a new task called ${name}, which should be done before ${date}, ${time}`})
		}
  }
}