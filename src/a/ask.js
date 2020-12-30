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
 					.setAuthor('Diri','https://lh3.googleusercontent.com/QTVkH9Hi8pZT4HaCCRgN2u1uWq5f4ztiCGJHg-TlXt8N2B6gKhbQOntX2-PgJTbWY2qV1Hl9SadnFQ2qbeBB7bdxVzKnhp4NKMGxPYTe7_png8rN_JY_i8qQDh1E6FG-8ZRM8hr80n05qzjxdJiaAiWGCBRww7VWL7uY_9JQkf28gmIP5eRN_o_l_6XdiH530uKeC6q0pVOPm3EarWpv0ZzFNFaPVlwL6GZShRW2vkeNe9u9yzEr4KmgBN2BpADQCJ38fbnSJcoa5a0t5B_nFBsde5yUL4oEOUM12UguGQCHtBjcDv9v4LmVI9ILz6mk1UY8B_rT36U0GUjTw2Zor_ZWBdGYYX13K8c-x-9k2Uko3sO9mnZtVkhXsGLe1541kUpDauUszwZHT4z23ff-vROfKqvrnRy5hGz5XMwljHgSkRcYuIc9Fmo5-mGN6cScGkYlSr2sGVrO7x8YGEoueiickUtljAz6PkoXz-4UAlOWZcpZt3PpH2gPfCSEd-oXT4-2EuTClsVAHzW1bpJrkUbzAqaluJSwdwz0wkB6zjEqXucJQPLZeQxMtl6-D0BYqS1_qnJddveXIdngpabiUoyxNn6kO1tzz-qX13_ZJrj7tYZyreWcLTf4k04jBurGDKqcArD9e29z0rWBZQs-NT_TWmYZkyo=s316-no','https://kimjammer-diri.glitch.me/')
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