const Discord = require('discord.js');
const client = new Discord.Client();

const Database = require('better-sqlite3')
const db = new Database("Database.sqlite");

const {token} = require('./config.json')
const prefix = "?"

client.commands = new Map();
const ListOfCommands = ['ping','foo','args-test','points']
let command;
for (i=0; i<ListOfCommands.length; i++) {
	commandToRequire = require(`./a/${ListOfCommands[i]}.js`);
	client.commands.set(commandToRequire.name, commandToRequire);
}


client .on('ready', () => {
	console.log('Diri is online');

	const TableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='UserPoints';",(error,table) =>{
		if (error){
			console.log(error)
		}
			return table;
		});
	//console.log(!!TableExists.get())
	if (!TableExists.get()){
		const createTable = db.prepare("CREATE TABLE UserPoints (id INTEGER PRIMARY KEY NOT NULL, userId TEXT NOT NULL, guildId TEXT NOT NULL, username TEXT, points INTEGER, level INTEGER);", error => {
		console.log('Initilized!')
		if (error) {
			console.log(error)
		}
		});//end of prepare statement
		createTable.run();
	}else{
		//const createEntry = db.prepare('INSERT INTO UserPoints (id, userId, guildId, username, points, level) VALUES (1, 424546246980665344, 466942731583881226, "kimjammer#4819", 100, 1);',error =>{if (error){console.log(error)}});
		//createEntry.run();
	}



	client.getPoints = db.prepare("SELECT * FROM UserPoints WHERE userId = ? AND guildId = ? ;",(error) => {if (error){console.log(error)}});
    client.setPoints = db.prepare("INSERT OR REPLACE INTO UserPoints (id, userId, guildId, username, points, level) VALUES (@id, @userId, @guildId, @username, @points, @level);",error => {if (error){console.log(error)}});
    client.createUser = db.prepare("INSERT INTO UserPoints (id, userId, guildId, username, points, level) VALUES (@id, @userId, @guildId, @username, @points, @level);",error => {if(error){console.log(error)}});
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
		command.execute(message,args,client); //message is the message object so the code can call message.channel.send() or etc
	}catch(err){
		console.log(err);
		reply = 'Something went wrong. :('
		message.channel.send(reply);
	}

});

client.on('message',message => {
	if(message.author.bot) return;

	if(!message.guild) return;

	if(!client.getPoints.get(message.author.id,message.guild.id)){
		client.createUser.run(
			{
				id: message.guild.id-message.author.id,
				userId: message.author.id,
				guildId: message.guild.id,
				username: message.author.username,
				points: 0,
				level: 1
			});
	}//create new entry in database for new user in new server if none exists

	let userScore = client.getPoints.get(message.author.id,message.guild.id); //message author's entry as an object

	userScore.points += 1;

	if (userScore.points > userScore.level*100){
		userScore.points = 0;
		userScore.level += 1;
		message.channel.send(`Congrats ${userScore.username}, you leveled up to level ${userScore.level}!`)
	} //if points is greater than level times 100, add level and reset points.

	client.setPoints.run(userScore); //enter everything into database.
	

});

client.login(token);