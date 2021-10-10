const { SlashCommandBuilder } = require('@discordjs/builders');

const cmdName = 'plutopic';
const cmdDescription = 'A picture of pluto. Added by popular request.';

module.exports = {
	name: cmdName,
	description: cmdDescription,
	usage: `?plutoPic`,
	category: "fun",
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName(cmdName)
		.setDescription(cmdDescription),

	async execute (interaction) {
		await interaction.deferReply();
		let randomPlutoNum = Math.floor(Math.random()*3);

		if (randomPlutoNum == 0) {
			await interaction.editReply({content: "This is a true color picture of pluto, taken by the New Horizons flyby of pluto.",
				files:["https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pluto_in_True_Color_-_High-Res.jpg/768px-Pluto_in_True_Color_-_High-Res.jpg"]});
		}else if (randomPlutoNum == 1) {
			await interaction.editReply({content: "This is a false color picture of pluto, taken by the New Horizons flyby of pluto. The different colors represent different surface compositions.",
				files:["https://cdn.uanews.arizona.edu/s3fs-public/styles/uaqs_large/public/story-images/Pluto%20whole%20color.png"]});
		}else{
			await interaction.editReply({content: "This is a picture of pluto taken by the Hubble space telescope. This was humanity's best picture, before New Horizons flew by Pluto and took pictures.",
				files:["https://upload.wikimedia.org/wikipedia/commons/b/bd/PIA18179_d-Pluto270-Hubble2003-20100204.jpg"]});
		}

	}
};
