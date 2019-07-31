module.exports = {
	name: 'ping',
	description: 'Will pong a ping',
	execute(message,args,client) {
		message.channel.send(`pong! The ping time is ${client.ping}.`);
	}
};