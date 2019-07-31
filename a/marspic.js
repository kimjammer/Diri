module.exports = {
	name: 'MarsPic',
	description: 'A random picture from one of the mars rovers',
	execute(message,args,client) {
		message.channel.send('Looking for a picture...')
		const randomRoverNum = Math.floor(Math.random()*3);
		let rover;
		let queryInfo = {};
		if (randomRoverNum === 0){
			rover = "curiosity";
			queryInfo.sol = Math.floor(Math.random()*5200);
			queryInfo.cam = 'mast';
		}else if (randomRoverNum === 1){
			rover = "opportunity";
			queryInfo.sol = Math.floor(Math.random()*2300);
			queryInfo.cam = 'pancam';
		}else{
			rover = "spirit";
			queryInfo.sol = Math.floor(Math.random()*1800);
			queryInfo.cam = 'pancam'
		}
		let pictureInfo;
		client.nasa.MarsPhotos.fetch(rover,{
			sol: queryInfo.sol,
			camera: queryInfo.cam
		})
		.then(data => {	
			let picNum = Math.floor(Math.random()*5)
			const attachment = new client.attachment(data.photos[picNum].img_src);
			message.channel.send(attachment);
			message.channel.send(`This is from the ${data.photos[picNum].rover.name} rover on sol ${data.photos[picNum].sol}. Taken on the ${data.photos[picNum].camera.full_name}.`)
		}).catch(err => {
			console.log(err)
			message.channel.send('I couldn\'t retrieve a picture. Try again!')
		});
	}
};