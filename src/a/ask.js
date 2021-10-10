const { SlashCommandBuilder } = require('@discordjs/builders');

const cmdName = 'ask';
const cmdDescription = 'Ask anything!';

module.exports = {
	name: cmdName,
	description: cmdDescription,
	usage: `?ask [question]`,
	category: "general",
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName(cmdName)
		.setDescription(cmdDescription)
		.addStringOption(option =>
			option.setName('question')
				.setDescription('The question you want the answer to!')
				.setRequired(true)),

	async execute(interaction) {
		interaction.deferReply();

		const input = interaction.options.getString('question');

		const {wolfram_token} = require('../config.json');
		const url = `https://api.wolframalpha.com/v2/query?appid=${wolfram_token}&input=${encodeURIComponent(input)}&output=json`;


		const response = await interaction.client.fetch(url);
		const data = await response.json();

		//Check that wolfram alpha returned a answer, if not, tell them there was no answer
		if (!data || !data.queryresult.success || data.queryresult.pods.length === 0) {
			await interaction.editReply("I couldn't find an answer. Perhaps your question is misspelled or malformed?")
			return;
		}

		const embed = new interaction.client.MessageEmbed() //this is Discord.MessageEmbed but put into client for easy access
			.setAuthor('Diri','https://kimjammer.github.io/Portfolio/img/Diri.png','https://kimjammer-diri.glitch.me/')
			.setColor(11200869)
			.setTitle('Your Answer')
			.setDescription(`You asked: ${data.queryresult.pods[0].subpods[0].plaintext} and the answer is ${data.queryresult.pods[1].subpods[0].plaintext}.`)
			.setFooter('Powered by Wolfram Alpha.','https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/WolframCorporateLogo.svg/220px-WolframCorporateLogo.svg.png')
			.setImage(data.queryresult.pods[1].subpods[0].img.src)
			.setThumbnail(data.queryresult.pods[0].subpods[0].img.src);

		await interaction.editReply({embeds: [embed]});
	}
};
