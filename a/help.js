module.exports = {
	name: 'help',
	description: 'See the commands',
	execute(message,args,client) {
		let reply = 'Commands:'
		for (let i=0; i <= client.listOfCommands.length; i++){
			reply = reply + `\n ${i+1}. ${client.commands.get(client.listofCommands[i]).name} - ${client.commands.get(client.listofCommands[i]).description} `
		}
	}
};