module.exports = {
	name: 'points',
	description: 'See your points!',
	execute(message,args,client) {
		if(args[0]){
			const mentionedUserId = args[0].slice(2,20);
			if (client.getPoints.get(mentionedUserId,message.guild.id)){
				const userScore = client.getPoints.get(mentionedUserId,message.guild.id);
				message.channel.send(`${userScore.username} has ${userScore.points} points and are level ${userScore.level}!`);
			}else{
				message.channel.send('That person doesn\'t seem to have points yet in this server! Send a messages to get points.')
			}
			
		}else{
			const userScore = client.getPoints.get(message.author.id,message.guild.id);
			message.channel.send(`You have ${userScore.points} points and are level ${userScore.level}!`);
		}
	}
};