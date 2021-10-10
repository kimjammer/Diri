const { SlashCommandBuilder } = require('@discordjs/builders');

const cmdName = 'spacepic';
const cmdDescription = 'Nasa\'s Astronomy Picture of the Day.';

module.exports = {
	name: cmdName,
	description: cmdDescription,
	usage: `?spacePic`,
	category: "fun",
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName(cmdName)
		.setDescription(cmdDescription),

	async execute(interaction) {
		interaction.deferReply();

		const {nasa_token} = require('../config.json');
		const url = `https://api.nasa.gov/planetary/apod?api_key=${nasa_token}`

		try {
			const response = await interaction.client.fetch(url);
			const data = await response.json();

			await interaction.editReply({files: [data.url]});
		}catch (e) {
			console.log(e);
			await interaction.editReply(`Couldn't retrieve today's picture. Please try again tomorrow.`);
		}
	}
};
