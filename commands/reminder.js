const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const parseDate = require('date.js')
const cron = require('node-cron')
const parseToCron = require('friendly-node-cron');

const wait = require('node:timers/promises').setTimeout;

const reminders = {}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reminder')
		.setDescription('Creates a repeating reminder.')
		.addSubcommand(subcommand => subcommand
			.setName('add')
			.setDescription('Adds a reminder or replaces an existing one.')
			.addStringOption(option => option
				.setName('name')
				.setDescription('The name of the reminder.')
				.setRequired(true)
			)
			.addStringOption(option => option
				.setName('time')
				.setDescription('The interval at which the reminder will repeat (eg. `every 3 hours`).')
				.setRequired(true)
			)
		)
		.addSubcommand(subcommand => subcommand
			.setName('delete')
			.setDescription('Deletes a task.')
			.addStringOption(option => option
				.setName('name')
				.setDescription('The name of the reminder to delete.')
				.setRequired(true)
			)
		)
		.addSubcommand(subcommand => subcommand
			.setName('list')
			.setDescription('Provides a list of all reminders.')
		),

	async execute(interaction, client) {

		const subcommand = interaction.options.getSubcommand();
		if (subcommand === 'add') {
			let cronString;
			const name = interaction.options.getString('name');
			const time = interaction.options.getString('time');

			try {
				cronString = parseToCron(time)
			}
			catch (error) {
				console.log(error.stack)
				return interaction.reply({ content: 'You entered an invalid time! Try something like `every five minutes` or `on Saturday`' })
			}

			if (!reminders[interaction.user.id]) {
				reminders[interaction.user.id] = {}
			}

			if (reminders[interaction.user.id][name]) {
				return interaction.reply({ content: 'A task with this name already exists! To change it, delete it first then add it again.' })
			}

			await interaction.reply({
				embeds: [new MessageEmbed({
					title: ':white_check_mark: Reminder set!',
					description: `**Task**: ${name}\n**Interval**: ${time}`,
					color: '#22EE33'
				})]
			})

			console.log(cronString)

			const cronTask = cron.schedule(cronString, () => {
				interaction.user.send({
					embeds: [new MessageEmbed({
						title: 'You have a reoccuring reminder!',
						description: `**${name}**`,
						color: 'DDFFDD'
					})]
				})
			})

			reminders[interaction.user.id][name] = {
				name,
				time,
				cronTask
			}
		}
		else if (subcommand === 'delete') {
			const name = interaction.options.getString('name');

			if (!reminders[interaction.user.id][name]) return interaction.reply({
				content: `There is no reminder called ${name}.`
			})

			delete reminders[interaction.user.id][name]
			interaction.reply({ content: `Successfully deleted reminder called ${name}` })
		}
		else {
			const embed = new MessageEmbed()
				.setTitle('Reminders')
				.setColor('#22FF22')


			let description = '';

			if (reminders[interaction.user.id]) {
				Object.values(reminders[interaction.user.id]).forEach(reminder => {
					description += `**${reminder.name}**: ${reminder.time}\n`
				})
			}

			embed.setDescription(description || 'No reminders set.')
			interaction.reply({ embeds: [embed] })
		}
	},
};