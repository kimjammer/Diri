module.exports = {
	name: 'MarsPic',
	description: 'A random picture from one of the mars rovers',
	usage: `?marsPic [optional: curiosity/opportunity/spirit]`,
	category: "fun",
	guildOnly: false,
	execute(message,args,client) {
		message.channel.send('Looking for a picture...')
		const randomRoverNum = Math.floor(Math.random()*3);
		let rover = "";
		let queryInfo = {};
		if (args[0]) {
			if (args[0] == "curiosity") {
				rover = "curiosity";
				queryInfo.sol = Math.floor(Math.random()*2463);
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
				message.channel.send("Please enter a valid rover name. curiosity, spirit, opportunity.")
				return;
			}
		}else { //if no rover argument, then choose randomly
			if (randomRoverNum === 0){
				rover = "curiosity";
				queryInfo.sol = Math.floor(Math.random()*2463);
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
		}
		
		let pictureInfo;
		client.nasa.MarsPhotos.fetch(rover,{
			sol: queryInfo.sol,
			camera: queryInfo.cam
		})
		.then(data => {	
			let picNum = 1 //Math.floor(Math.random()*5)
			//const attachment = new client.attachment(data.photos[picNum].img_src);
			message.channel.send(new client.attachment(data.photos[picNum].img_src));
			message.channel.send(`This is from the ${data.photos[picNum].rover.name} rover on sol ${data.photos[picNum].sol}. Taken on the ${data.photos[picNum].camera.full_name}.`)
		}).catch(err => {
			console.log(err)
			message.channel.send('I couldn\'t retrieve a picture. Try again!')
		});
	}
};