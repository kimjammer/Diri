const { Client, Collection, Intents, MessageEmbed, Snowflake} = require('discord.js');

//Add required intents
const botIntents = new Intents();
botIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS)

const client = new Client({ intents: botIntents});

client.attachment = Client.MessageAttachment;
client.MessageEmbed = MessageEmbed;
client.ReactionCollector = Client.ReactionCollector;

const regCmds = require('./registerCommands.js');

//Your(the bot creator's) user ID here. Only used for debug mode.
client.botAuthor = "424546246980665344";

//ytdl so the bot can stream music to a voice channel
client.ytdl = require('ytdl-core');
//This object stores key:MusicSubscription pairs which is subscription information
client.musicStreams = new Map();

client.ytfps = require('ytfps');

const fs = require('fs');

const Database = require('better-sqlite3');

//This code checks whether diri is running in normal node.js or docker, so it knows where it should look for/put its database.
//Check if the path that is autocreated by docker exists.
let dblocation = '/dbs/Diri'; //This assumes that you don't have the folder Diri in folder dbs in your root directory.
let dirName = require('path').dirname(dblocation);
//If the path does not exist then we are running as node application!
if (!fs.existsSync(dirName)) {
	console.log("Running on basic Node.js detected.")
	//Now check if the file exists at predicted node location
	dblocation = '../databases/Database.sqlite'
	dirName = require('path').dirname(dblocation);
	//If the database doesn't exist, create it.
	if (!fs.existsSync(dirName)) {
		fs.mkdirSync(dirName, { recursive: true });
	}
}else{
	console.log("Running in docker detected.");
	//Now check if the file exists at the predicted docker location
	dblocation = '/dbs/Diri/Database.sqlite'
	dirName = require('path').dirname(dblocation);
	//If the database doesn't exist, create it.
	if (!fs.existsSync(dirName)) {
		fs.mkdirSync(dirName, {recursive: true});
	}
}
const db = new Database(dblocation);

const {token} = require('./config.json');

client.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

//Temporary April Fools joke
/* To activate, get translate on npm, or insert ["translate": "^1.2.3",] into package.json
const translate = require("translate");
translate.engine = "libre";
translate.url = "https://libretranslate.com/translate"
 */

//Get and save commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./a').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./a/${file}`);
	client.commands.set(command.data.name, command);
}

//Run script to register all slash commands
regCmds.run(/*'627627950228897819'*/);

client.on('ready', () => {
	console.log('Diri is online');
	client.user.setActivity("to you",{type: "LISTENING"})

	const TableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='UserPoints';",(error,table) =>{
		if (error){
			console.log(error)
		}
			return table;
		});
	if (!TableExists.get()){
		const createTable = db.prepare("CREATE TABLE UserPoints (id INTEGER PRIMARY KEY NOT NULL, userId TEXT NOT NULL, guildId TEXT NOT NULL, username TEXT, points INTEGER, level INTEGER);", error => {
		console.log('Initialized!')
		if (error) {
			console.log(error)
		}
		});//end of prepare statement
		createTable.run();
	}

	client.getPoints = db.prepare("SELECT * FROM UserPoints WHERE userId = ? AND guildId = ? ;",(error) => {if (error){console.log(error)}});
    client.setPoints = db.prepare("INSERT OR REPLACE INTO UserPoints (id, userId, guildId, username, points, level) VALUES (@id, @userId, @guildId, @username, @points, @level);",error => {if (error){console.log(error)}});
    client.createUser = db.prepare("INSERT INTO UserPoints (id, userId, guildId, username, points, level) VALUES (@id, @userId, @guildId, @username, @points, @level);",error => {if(error){console.log(error)}});
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


client.on('messageCreate',message => {
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

//Temporary April Fools Joke
/*
async function randomTranslate (message) {
	//Bypass translation for me if I want to
	if (message.author.id == 424546246980665344 && message.content.startsWith(".")) return;

	//English names of languages
	const languageNames = ["Spanish","Arabic","Chinese","French","German","Hindi","Irish","Italian","Japanese","Korean","Portuguese","Russian"]
	//Get text of original message
	let originalText = message.content;
	//Get random language to translate into
	let randomLanguageNum = Math.floor(Math.random()*11)
	let randomLanguage = ["es","ar","zh","fr","de","hi","ga","it","ja","ko","pt","ru"][randomLanguageNum];
	//Get translation of Message
	let translatedMessage = await translate(originalText,{to:randomLanguage});
	//Send translated message. "In random_language, @someone said: their_message"
	message.channel.send(`In ${languageNames[randomLanguageNum]}, <@${message.author.id}> said: ${translatedMessage}`)
	//Delete original message
	message.delete();
}
 */

client.login(token);

//Code to prevent the program from crashing with non-zero exit code.
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));
