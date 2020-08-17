module.exports = {
	name: 'help',
	description: 'See the commands',
	guildOnly: false,
	execute(message,args,client) {
		let reply;
		if (args[0] == undefined) { //If it is just ?help with no arguments
			reply = 'Commands:';
			let i = 1
			for (let value of client.commands.values()) {
				reply = reply + `\n ${i}. ${value.name} - ${value.description} `;
				i++
			}
		}else { //If there are arguments and it is asking for info on a specific command
			if (client.commands.has(args[0])) {
				reply = client.commands.get(args[0]).name + ": " + client.commands.get(args[0]).description;
			}else{
				reply = "That command doesn't exist!"
			}
		}
		message.channel.send(reply);
	}
};