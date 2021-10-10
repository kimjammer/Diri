const { SlashCommandBuilder } = require('@discordjs/builders');

const cmdName = 'marco';
const cmdDescription = 'Will respond polo';

module.exports = {
	name: cmdName,
	description: cmdDescription,
	usage: `?marco`,
	category: "fun",
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName(cmdName)
		.setDescription(cmdDescription),

	async execute (interaction) {
		await interaction.reply("Polo!");
	}
};
