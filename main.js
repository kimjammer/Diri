const Discord = require('discord.js');
const client = new Discord.Client();

const sql = require('sqlite3')

const {token} = require('./config.json')
const prefix = "?"

client.commands = new Map();
const ListOfCommands = ['ping','foo']
let command;
for (i=0; i<ListOfCommands.length; i++) {
	commandToRequire = require(`./a/${ListOfCommands[i]}.js`);
	client.commands.set(commandToRequire.name, commandToRequire);
}


client .on('ready', () => {
	console.log('Diri is online');
});

client.on('message',message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	let msgContents = message.content.slice(prefix.length).split(/ +/);
	let commandName = msgContents.shift().toLowerCase();
	let command = client.commands.get(commandName);
	let args = msgContents.map(element => {return element.toLowerCase();});

	let reply = ''

	if (msgContents.find(element => {return element == command;})) return;

	try {
		command.execute(message,args); //message is the message object so the code can call message.channel.send() or etc
	}catch(err){
		console.log(err);
		reply = 'Something went wrong. :('
		message.channel.send(reply);
	}

});

client.login(token);