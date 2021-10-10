const { SlashCommandBuilder } = require('@discordjs/builders');
const {nasa_token} = require("../config.json");

const cmdName = 'marspic';
const cmdDescription = 'A random picture from one of the mars rovers';

module.exports = {
	name: cmdName,
	description: cmdDescription,
	usage: `?marsPic [optional: curiosity/opportunity/spirit/perseverance]`,
	category: "fun",
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName(cmdName)
		.setDescription(cmdDescription)
		.addStringOption(option =>
		 	option.setName('rover')
				.setDescription('Select a rover to see pictures from.')
				.addChoice('Curiosity','curiosity')
				.addChoice('Opportunity', 'opportunity')
				.addChoice('Spirit', 'spirit')
				.addChoice('Perseverance', 'perseverance')),

	async execute (interaction) {
		interaction.deferReply();

		const {nasa_token} = require('../config.json');

		const roverOpt = interaction.options.getString('rover');

		const randomRoverNum = Math.floor(Math.random()*4);
		let rover = "";
		let queryInfo = {};
		//These next four variables hold a so called "cache" of the latest Sol for each rover, refreshed at command call,
		//so it doesn't request them each time it attempts to get a picture.
		let curiosityMaxSol = 0;
		let opportunityMaxSol = 0;
		let spiritMaxSol = 0;
		let perseveranceMaxSol = 0;
		//This variable counts the number of times that Diri tries to get a picture. If it exceeds 15 attempts, it will stop trying.
		let trycount = 0;

		//If there is a rover specified, get a random day to get a picture from specified rover.
		if (roverOpt) {
			/*Basically, diri picks a random number with the max being the latest sol the rover has lived on mars.
			Then, it makes a request to the nasa api and gets all the pictures taken that day with a specific camera,
			one that I know has good pictures. It looks at the received info and sees if there were any pictures taken
			with the camera on that day. If there wasn't, then it will pick a new random number and try again, with
			the maximum number of tries being 15. After that, it will give up.
			*/
			//Wrapping the if-else statements in the do-while loop increases the number of comparisons done, but reduces repeated code.
			do {
				trycount++;

				if (roverOpt == "curiosity") {
					rover = "curiosity";
					if (curiosityMaxSol == 0) {
						curiosityMaxSol = await latestRoverSol('curiosity')
					}
					queryInfo.sol = Math.floor(Math.random()*curiosityMaxSol);
					queryInfo.cam = 'mast';
				}else if (roverOpt == "opportunity") {
					rover = "opportunity";
					if (opportunityMaxSol == 0) {
						opportunityMaxSol = await latestRoverSol('opportunity')
					}
					queryInfo.sol = Math.floor(Math.random()*opportunityMaxSol);
					queryInfo.cam = 'pancam';
				}else if(roverOpt == "spirit") {
					rover = "spirit";
					if (spiritMaxSol == 0) {
						spiritMaxSol = await latestRoverSol('spirit')
					}
					queryInfo.sol = Math.floor(Math.random()*spiritMaxSol);
					queryInfo.cam = 'pancam';
				}else if (roverOpt == "perseverance") {
					rover = "perseverance"
					if (perseveranceMaxSol == 0) {
						perseveranceMaxSol = await latestRoverSol('perseverance')
					}
					queryInfo.sol = Math.floor(Math.random()*perseveranceMaxSol);
					if (Math.floor(Math.random()*2) == 0) {
						queryInfo.cam = 'mcz_right';
					}else {
						queryInfo.cam = 'mcz_left';
					}
				}
			} while (await pictureExistsOnSol(queryInfo.sol,queryInfo.cam,rover) == "no" && trycount < 15);

		}else { //if no rover argument, then choose a rover randomly
			do {
				trycount++;

				if (randomRoverNum === 0){
					rover = "curiosity";
					if (curiosityMaxSol == 0) {
						curiosityMaxSol = await latestRoverSol('curiosity')
					}
					queryInfo.sol = Math.floor(Math.random()*curiosityMaxSol);
					queryInfo.cam = 'mast';
				}else if (randomRoverNum === 1){
					rover = "opportunity";
					if (opportunityMaxSol == 0) {
						opportunityMaxSol = await latestRoverSol('opportunity')
					}
					queryInfo.sol = Math.floor(Math.random()*opportunityMaxSol);
					queryInfo.cam = 'pancam';
				}else if (randomRoverNum === 2){
					rover = "spirit";
					if (spiritMaxSol == 0) {
						spiritMaxSol = await latestRoverSol('spirit')
					}
					queryInfo.sol = Math.floor(Math.random()*spiritMaxSol);
					queryInfo.cam = 'pancam';
				}else{
					rover = "perseverance";
					if (perseveranceMaxSol == 0) {
						perseveranceMaxSol = await latestRoverSol('perseverance')
					}
					queryInfo.sol = Math.floor(Math.random()*perseveranceMaxSol);
					if (Math.floor(Math.random()*2) == 0) {
						queryInfo.cam = 'mcz_right';
					}else {
						queryInfo.cam = 'mcz_left';
					}
				}

			} while (await pictureExistsOnSol(queryInfo.sol,queryInfo.cam,rover) == false && trycount < 15) ;
		}

		async function pictureExistsOnSol (sol,cam,RoverName) {
			const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${RoverName}/photos?api_key=${nasa_token}&sol=${sol}&camera=${cam}`;
			const response = await interaction.client.fetch(url);
			const data = await response.json();
			if (data.photos[1] == null) {
				return false;
			}else{
				return true;
			}
		}

		async function latestRoverSol (RoverName) {
			const url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${RoverName}?api_key=${nasa_token}`;
			const response = await interaction.client.fetch(url);
			const data = await response.json();
			return data.photo_manifest.max_sol;
		}

		const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?api_key=${nasa_token}&sol=${queryInfo.sol}&camera=${queryInfo.cam}`;

		try {
			const response = await interaction.client.fetch(url);
			const data = await response.json();

			let picNum = 1
			await interaction.followUp({content:`This is from the ${data.photos[picNum].rover.name} rover on sol ${data.photos[picNum].sol}. Taken on the ${data.photos[picNum].camera.full_name}.`,
				files: [data.photos[picNum].img_src]});
			if (interaction.client.debugMode) {
				interaction.client.debugMode = false;
				await interaction.followUp(`DEBUG MODE: This picture took ${trycount} tries.`);
			}
		}catch (e) {
			console.log(e)
			if (trycount >= 15) {
				await interaction.followUp('I couldn\'t retrieve a picture within 15 tries. Try again!');
				if (interaction.client.debugMode) {
					interaction.client.debugMode = false;
					await interaction.followUp(`DEBUG MODE: This picture took ${trycount} tries.`);
				}
			}else {
				await interaction.followUp(`I couldn\`t retrieve a picture.`);
				if (interaction.client.debugMode) {
					interaction.client.debugMode = false;
					await interaction.client.followUp(`DEBUG MODE: This picture took ${trycount} tries. Error: ${e}`);
				}
			}
		}
	}
};
