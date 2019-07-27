module.exports = {
	name: 'points',
	description: 'See your points!',
	execute(message,args,client) {
		const userScore = client.getPoints.get(message.author.id,message.guild.id);
		message.channel.send(`You have ${userScore.points} points and are level ${userScore.level}!`);
	}
};