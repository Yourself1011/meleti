// paths and stuff for pathing for comma nonds and stuff
const fs = require('node:fs');
const path = require('node:path');

console.log('Starting bot...')

// Require the necessary discord.js classes
const { Client, Intents, Collection } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
  
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

console.log('Commands finished loading!')

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('BOT ON GET TO WORK NERDS\n\n');

	client.user.setActivity('people study', { type: 'WATCHING' })
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    const command = client.commands.get(interaction.commandName);
    
    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.channel.send({ content: 'There was an error while executing this command!', ephemeral: true });
    }
})

// Login to Discord with bot token
client.login(process.env['BOT_TOKEN']);