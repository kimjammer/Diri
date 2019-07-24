module.exports = {
	name: 'ping',
	description: 'Will pong a ping',
	execute(message,args) {
		message.channel.send('pong');
	}
};