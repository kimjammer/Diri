const { SlashCommandBuilder } = require('@discordjs/builders');

const cmdName = 'debug';
const cmdDescription = 'Turn on debug mode for next command.';

module.exports = {
	name: cmdName,
	description: cmdDescription,
	usage: `?debug`,
	category: "general",
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName(cmdName)
		.setDescription(cmdDescription),

	async execute (interaction) {
		if (interaction.client.botAuthor === interaction.user.id) {
			interaction.reply(`Debug mode turned on.`);
			interaction.client.debugMode = true;
		} else {
			interaction.reply(`Permission Denied.`)
		}

	}
};
