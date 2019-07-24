module.exports = {
	name: 'foo',
	description: 'bar',
	execute (message,args) {
		message.channel.send('bar');
	}
};