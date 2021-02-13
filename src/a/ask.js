module.exports = {
	name: 'ask',
	description: 'Ask anything!',
	usage: `?ask [question]`,
	category: "general",
	guildOnly: false,
	execute(message,args,client) {
		message.channel.send('Looking for an answer...')
		let input = '';
		for (let i = 0; i<args.length; i++){
			input = input + " " + args[i];
		}
		client.wolfram.query(input, function(err, result) {
 			if(err) {
 				console.log(err);
 				message.channel.send("I couldn't find an answer. Perhaps your question is misspelled or malformed?")
 				return;
 			}
 			try{
 				const embed = new client.MessageEmbed() //this is Discord.MessageEmbed but put into client for easy access
 					.setAuthor('Diri','https://kimjammer.github.io/Portfolio/img/Diri.png','https://kimjammer-diri.glitch.me/')
					.setColor(11200869)
					.setTitle('Your Answer')
					.setDescription(`You asked: ${result[0].subpods[0].value} and the answer is ${result[1].subpods[0].value}.`)
					.setFooter('Powered by Wolfram Alpha.','https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/WolframCorporateLogo.svg/220px-WolframCorporateLogo.svg.png')
					.setImage(result[1].subpods[0].image)
					.setThumbnail(result[0].subpods[0].image)

				message.channel.send(embed);
			}catch(err){
				console.log(err);
				message.channel.send("I couldn't find an answer. Perhaps your question is misspelled or malformed?")
			}
		})
	}
};