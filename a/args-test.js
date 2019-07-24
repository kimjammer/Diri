module.exports = {
	name: 'args-test',
	description: 'Test if the arguments are working!',
	execute(message,args) {
		args.ForEach(element => {
			message.channel.send(element);
		});
		message.channel.send("Done!");
	}
};