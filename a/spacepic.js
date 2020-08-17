module.exports = {
	name: 'SpacePic',
	description: 'Nasa\'s Astronomy Picture of the Day.',
	guildOnly: false,
	execute(message,args,client) {
		let pictureInfo;
		client.nasa.APOD.fetch()
		.then(data => {
			pictureInfo = data;
			message.channel.send(new client.attachment(pictureInfo.url));
		}).catch(err => {
			console.log(err)
			message.channel.send('I couldn\'t retrieve the picture.')
		});
	}
};