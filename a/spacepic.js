module.exports = {
	name: 'SpacePic',
	description: 'Nasa\'s Astronomy Picture of the Day.',
	execute(message,args,client) {
		let pictureInfo;
		client.nasa.APOD.fetch()
		.then(data => {
			pictureInfo = data;
			const attachment = new client.attachment(pictureInfo.url);
			message.channel.send(attachment);
		}).catch(err => {
			console.log(err)
			message.channel.send('I couldn\'t retrieve the picture.')
		});
	}
};