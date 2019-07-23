const Discord = require('discord.js');
const client = new Discord.Client();

const sql = require('sqlite3')

const {token} = require('./config.json')
const prefix = "!"

const commands = ['ping']
for (i=0; i<commands.length; i++) {
	let command = require(`./a/${commands[i]}`);
}
console.log(command);
client .on('ready', () => {
	console.log('Diri is online');
});

client.on('message',message => {
	if (message.content === 'ping') {
		message.channel.send('pong');
	};
});

client.login(config.token);