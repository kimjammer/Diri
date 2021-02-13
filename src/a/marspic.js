module.exports = {
	name: 'MarsPic',
	description: 'A random picture from one of the mars rovers',
	usage: `?marsPic [optional: curiosity/opportunity/spirit]`,
	category: "fun",
	guildOnly: false,
	async execute (message,args,client) {
		message.channel.send('Looking for a picture...')
		const randomRoverNum = Math.floor(Math.random()*3);
		let rover = "";
		let queryInfo = {};
		//This variable counts the number of times that Diri tries to get a picture. If it exceeds 15 attempts, it will stop trying.
		let trycount = 0;

		//If there is a rover specified, get a random day to get a picture from specified rover.
		if (args[0] && args[0] != "debug") {
			/*Basically, diri picks a random number with the max being the latest sol the rover has lived on mars.
			Then, it makes a request to the nasa api and gets all the pictures taken that day with a specific camera,
			one that I know has good pictures. It looks at the recieved info and sees if there were any pictures taken
			with the camera on that day. If there wasn't, then it will pick a new random number and try again, with
			the maximum number of tries being 15. After that, it will give up.
			*/
			//Wrapping the if-else statements in the do-while loop increases the number of comparisons done, but reduces repeated code.
			do {
				trycount++;

				if (args[0] == "curiosity") {
					rover = "curiosity";
					queryInfo.sol = Math.floor(Math.random()*3023);
					queryInfo.cam = 'mast';
				}else if (args[0] == "opportunity") {
					rover = "opportunity";
					queryInfo.sol = Math.floor(Math.random()*5111);
					queryInfo.cam = 'pancam';
				}else if(args[0] == "spirit") {
					rover = "spirit";
					queryInfo.sol = Math.floor(Math.random()*2208);
					queryInfo.cam = 'pancam';
				}else{
					message.channel.send("Please use a valid rover name. curiosity, spirit, opportunity. `?MarsPic Curiosity/Spirit/Opportunity`")
					return;
				}
			} while (await pictureExistsOnSol(queryInfo.sol,queryInfo.cam,rover) == "no" && trycount < 15);

		}else { //if no rover argument, then choose a rover randomly
			do {
				trycount++;

				if (randomRoverNum === 0){
					rover = "curiosity";
					queryInfo.sol = Math.floor(Math.random()*3023);
					queryInfo.cam = 'mast';
				}else if (randomRoverNum === 1){
					rover = "opportunity";
					queryInfo.sol = Math.floor(Math.random()*5111);
					queryInfo.cam = 'pancam';
				}else{
					rover = "spirit";
					queryInfo.sol = Math.floor(Math.random()*2208);
					queryInfo.cam = 'pancam';
				}

			} while (await pictureExistsOnSol(queryInfo.sol,queryInfo.cam,rover) == "no" && trycount < 15) ;
		}

		function pictureExistsOnSol (sol,cam,RoverName) {
			return new Promise (exists => {
				client.nasa.MarsPhotos.fetch(RoverName, {
					sol: sol,
					camera: cam
				}).then(data => {
					if (data.photos[1] == null) {
						exists("no");
					}else{
						exists("yes");
					}
				})
			})
		}

		client.nasa.MarsPhotos.fetch(rover,{
			sol: queryInfo.sol,
			camera: queryInfo.cam
		})
		.then(data => {
			let picNum = 1
			message.channel.send(new client.attachment(data.photos[picNum].img_src));
			message.channel.send(`This is from the ${data.photos[picNum].rover.name} rover on sol ${data.photos[picNum].sol}. Taken on the ${data.photos[picNum].camera.full_name}.`)
			if (client.debugMode) {
				message.channel.send((`DEBUG MODE: This picture took ${trycount} tries.`))
			}
		}).catch(err => {
			console.log(err)
			if (trycount >= 15) {
				message.channel.send('I couldn\'t retrieve a picture within 15 tries. Try again!')
				if (client.debugMode) {
					message.channel.send((`DEBUG MODE: This picture took ${trycount} tries.`))
				}
			}else {
				message.channel.send(`I couldn\`t retrieve a picture.`);
				if (client.debugMode) {
					message.channel.send((`DEBUG MODE: This picture took ${trycount} tries. Error: ${err}`))
				}
			}
		});
	}
};