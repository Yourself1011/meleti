const { SlashCommandBuilder } = require('@discordjs/builders');
const {db, newUser} = require("../db.js");

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
    .addSubcommand(subcommand =>
        subcommand
            .setName("complete")
            .setDescription("Completes a task.")
    )
    ,

	async execute(interaction) {

    
                            
    if (interaction.options.getSubcommand() == "view") {
        let userID = interaction.user.id
        let user = await db.get(userID)
        
        if (!user || !user.tasks) {
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
        
      if (
        date == "Invalid Date"
      ) {
        await interaction.reply({ content: 'Enter a valid date' })
      }
        
      id = interaction.user.id
      if (!await db.get(id)){
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
		}
    
 
  }
}