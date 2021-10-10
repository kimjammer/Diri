const { SlashCommandBuilder } = require('@discordjs/builders');

const cmdName = 'advice';
const cmdDescription = 'Gives some good advice';

module.exports = {
	name: cmdName,
	description: cmdDescription,
	usage: `?advice`,
	category: "fun",
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName(cmdName)
		.setDescription(cmdDescription),

	async execute(interaction) {
		await interaction.deferReply();

		const sendResult = (result) => {
			interaction.followUp({content:`\`${result.slip.advice}\``})

			if (interaction.client.debugMode && interaction.user.id === interaction.client.botAuthor) {
				interaction.followUp(`DEBUG MODE: Advice slip ID is ${result.slip.id}`)
				interaction.client.debugMode = false;
			}
		};

		async function getAdvice() {
			const response = await interaction.client.fetch('https://api.adviceslip.com/advice');
			const data = await response.json();

			sendResult(data);
		}

		await getAdvice();
	}
};
