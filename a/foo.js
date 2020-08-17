module.exports = {
	name: 'foo',
	description: 'bar',
	guildOnly: false,
	execute (message,args) {
		message.channel.send('bar');
	}
};