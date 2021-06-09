module.exports = {
	name: 'SpacePic',
	description: 'Nasa\'s Astronomy Picture of the Day.',
	usage: `?spacePic`,
	category: "fun",
	guildOnly: false,
	execute(message,args,client) {
		const {nasa_token} = require('../config.json');
		let pictureInfo;
		const xhr = new client.XMLHttpRequest();
		const url = `https://api.nasa.gov/planetary/apod?api_key=${nasa_token}`

		xhr.responseType = 'json';

		xhr.onreadystatechange = () => {
			if (xhr.readyState === client.XMLHttpRequest.DONE) {
				try {
					pictureInfo = xhr.response;
					message.channel.send(new client.attachment(pictureInfo.url));
					message.channel.send(`aa`)
				}catch (e) {
					console.log(e);
					message.channel.send(`Couldn't retrieve today's picture. Please try again tomorrow.`);
				}
			}
		};

		xhr.open('GET',url);
		xhr.send();
	}
};
