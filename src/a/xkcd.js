const { SlashCommandBuilder } = require('@discordjs/builders');

const cmdName = 'xkcd';
const cmdDescription = 'Returns today\'s comic, a random comic, or a specific comic by id.';

module.exports = {
	name: cmdName,
	description: cmdDescription,
	usage: `?xkcd [optional: comic number/random to get a random comic]`,
	category: "fun",
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName(cmdName)
		.setDescription(cmdDescription)
		.addStringOption(option =>
			option.setName('random')
				.setDescription('Select to get a random comic')
				.addChoice('Yes', 'random'))
		.addIntegerOption(option =>
			option.setName('id')
				.setDescription('The id of a specific xkcd comic.')),

	async execute(interaction) {
		await interaction.deferReply();

		const sendResult = (result) => {
			const embed = new interaction.client.MessageEmbed() //this is Discord.MessageEmbed but put into client for easy access
				.setAuthor('Diri','https://kimjammer.github.io/Portfolio/img/Diri.png','https://diri-robot.web.app/')
				.setColor(0xfc6f03)
				.setTitle(result.safe_title)
				.setImage(result.img)
				.addField(`Comics by Randall Munroe`,`Comic from: [https://xkcd.com/${result.num}](https://xkcd.com/${result.num})`)
				.setFooter(result.alt)

			interaction.editReply({embeds: [embed]});
		};

		async function getxkcd (xkcdUrl, isNumCheck, isGetLatestNum = false) { //Yeah, yeah, having three args to change what the function does is dumb. I don't have the effort to do it properly right now.
			const response = await interaction.client.fetch(xkcdUrl);
			const data = await response.json();

			if (isNumCheck) {
				await determineXkcdNumValidity (data.num);
			}else if (isGetLatestNum) {
				await sendRandomComic(data.num);
			}else {
				sendResult(data);
			}
		}

		async function determineXkcdNumValidity (latestXkcdNum) {
			if (comicIdOpt <= latestXkcdNum && comicIdOpt !== 404) {
				xkcdUrl = `https://xkcd.com/${comicIdOpt}/info.0.json`
				await getxkcd(xkcdUrl, false);
			}else {
				await interaction.editReply("That xkcd comic doesn't exist!")
			}
		}

		async function sendRandomComic (maxXkcdNum) {
			//Get a random comic number and make sure it isn't 404 since that crashes the bot.
			let randomXkcdNum = 404;
			do {
				//Choose a random number from 1 to the latest xkcd number
				randomXkcdNum = Math.floor(Math.random() * maxXkcdNum) + 1;
			} while (randomXkcdNum === 404)

			//Create the xkcd url with the random number
			xkcdUrl = `https://xkcd.com/${randomXkcdNum}/info.0.json`;
			//Get and send the results
			await getxkcd(xkcdUrl,false);
			//Tell the user what their random number was
			await interaction.followUp(`Your random comic was number ${randomXkcdNum}`);
		}

		let xkcdUrl;

		//If there are arguments, ie a comic number is specified or it says random comic.
		const randomOpt = interaction.options.getString('random');
		const comicIdOpt = interaction.options.getInteger('id');

		if (comicIdOpt || randomOpt) {
			if (randomOpt === "random") {
				//This gets the latest comic's number and passes it to the sendRandomComic function
				await getxkcd("https://xkcd.com/info.0.json",false,true);
			}else{
				//call getxkcd, but with the isNumCheck on. This will tell it to check the num, and call itself again if the number is valid.
				await getxkcd("https://xkcd.com/info.0.json", true);
			}
		}else {
			xkcdUrl = "https://xkcd.com/info.0.json"
			await getxkcd(xkcdUrl, false);
		}
	}
};
