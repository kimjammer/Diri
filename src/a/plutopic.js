module.exports = {
	name: 'PlutoPic',
	description: 'A picture of pluto. Added by popular request.',
	usage: `?plutoPic`,
	category: "fun",
	guildOnly: false,
	execute (message,args,client) {
		message.channel.send('Looking for a picture...')
		const randomPlutoNum = Math.floor(Math.random()*3);

		if (randomPlutoNum == 0) {
			message.channel.send("This is a true color picture of pluto, taken by the New Horizons flyby of pluto.");
			message.channel.send("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pluto_in_True_Color_-_High-Res.jpg/768px-Pluto_in_True_Color_-_High-Res.jpg");
		}else if (randomPlutoNum == 1) {
			message.channel.send("This is a false color picture of pluto, taken by the New Horizons flyby of pluto. The different colors represent different surface compositions.");
			message.channel.send("https://cdn.uanews.arizona.edu/s3fs-public/styles/uaqs_large/public/story-images/Pluto%20whole%20color.png");
		}else{
			message.channel.send("This is a picture of pluto taken by the Hubble space telescope. This was humanity's best picture, before New Horizons flew by Pluto and took pictures.");
			message.channel.send("https://upload.wikimedia.org/wikipedia/commons/b/bd/PIA18179_d-Pluto270-Hubble2003-20100204.jpg");
		}

	}
};
