module.exports = {
	name: 'ping',
	description: 'Will pong a ping',
	guildOnly: false,
	execute(message,args,client) {
		message.channel.send(`pong! The ping time is ${client.ws.ping}.`);
	}
};
