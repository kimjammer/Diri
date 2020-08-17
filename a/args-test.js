module.exports = {
	name: 'args-test',
	description: 'Test if the arguments are working!',
	guildOnly: false,
	execute(message,args) {
		args.forEach(element => {
			message.channel.send(element);
		});
		message.channel.send("Done!");
	}
};