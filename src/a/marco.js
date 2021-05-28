module.exports = {
	name: 'marco',
	description: 'Will respond polo',
	usage: `?marco`,
	category: "fun",
	guildOnly: false,
	execute (message,args) {
		message.channel.send('Polo!');
	}
};
