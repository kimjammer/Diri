const { SlashCommandBuilder } = require('@discordjs/builders');

const cmdName = 'args-test';
const cmdDescription = 'Test if the arguments are working!';

module.exports = {
	name: cmdName,
	description: cmdDescription,
	usage: `?args-test [arguments]`,
	category: "general",
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName(cmdName)
		.setDescription(cmdDescription)
		.addBooleanOption(option =>
			option.setName('bool')
				.setDescription('a required boolean input')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('string')
				.setDescription('an argument that is a string'))
		.addIntegerOption(option =>
			option.setName('integer')
				.setDescription('an integer input from a list of allowed options')
				.addChoice('Option 1',1)
				.addChoice('Option 2',2)
				.addChoice('Option 3',3)),

	async execute(interaction) {
		const stringOpt = interaction.options.getString('string');
		const intOpt = interaction.options.getInteger('integer');
		const boolOpt = interaction.options.getBoolean('bool');

		interaction.reply(`For the bool input, you selected ${boolOpt}, for string, you said: ${stringOpt}, and for the integer options, you selected ${intOpt}.`);
	}
};
