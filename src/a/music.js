module.exports = {
	name: 'Music',
	description: 'Plays music in the voice channel you are in!',
	usage: `?music [start (optional:jazz or youtube link),pause,resume,end,volume (0-150)]`,
	category: "general",
	guildOnly: true,
	async execute (message,args,client) {
		let connection;
		//Dark regular expression magic that will check if a string is a youtube video link.
		let ytLinkRegex = new RegExp('(?:.+?)?(?:\\/v\\/|watch\\/|\\?v=|\\&v=|youtu\\.be\\/|\\/v=|^youtu\\.be\\/|watch\\%3Fv\\%3D)([a-zA-Z0-9_-]{11})+')

		if (args[0] == "start") {
			//If there is a active music stream in this server, tell them that and don't play anything.
			//The client.musicStreams object stores key:[musicStream,voiceChannel] pairs which represent music streams
			//and the voice channel they're in. {guildID: [musicStream,voiceChannel], guildID: [musicStream,voiceChannel]}
			if (client.musicStreams[`${message.guild.id}`]) {
				message.channel.send("There is already a music stream in this server!");
				return;
			}

			// Join the voice channel the message sender is in.
			if (message.member.voice.channel) {
				connection = await message.member.voice.channel.join();
			} else {
				message.reply('You need to join a voice channel first.');
				return;
			}

			if (args[1] == "jazz") {
				//Adds a property:item pair - guildID: [musicStream,voiceChannel] to the musicStreams object so it can be accessed later.
				client.ytfps('PL_pFtRZACW0Yy2D-J5MRWAer2Ii6xQIst').then(playlist => {
					//Pick random number
					let randomJazzNumber = Math.floor(Math.random()*playlist.video_count);

					let randomJazzSong = playlist.videos[randomJazzNumber]

					//Play the random jazz music
					client.musicStreams[`${message.guild.id}`] = [connection.play(client.ytdl(`${randomJazzSong.url}`, { filter: 'audioonly' })), message.member.voice.channel];

					//Tell the user
					message.channel.send(`Playing the random jazz song: `+"<"+`${randomJazzSong.title}`+">"+`. It is ${randomJazzSong.length} long. ${randomJazzSong.url}`)
				}).catch(err => {
					throw err;
				});
			}else if (ytLinkRegex.test(args[1])) {
				//Play the youtube video
				client.musicStreams[`${message.guild.id}`] = [connection.play(client.ytdl(`${args[1]}`, { filter: 'audioonly' })), message.member.voice.channel];

				//Tell the user
				message.channel.send(`Playing the youtube video: `+"<"+`${args[1]}`+">")
			}else {
				message.channel.send("That's not a valid option or youtube link!");
			}

		}else if (args[0] == "pause") {
			//Check if there isn't a music stream in this server
			if (client.musicStreams[`${message.guild.id}`][0].paused) {
				message.channel.send("There is no currently playing music stream to pause!");
				return;
			}

			//Pause the music stream
			client.musicStreams[`${message.guild.id}`][0].pause();
			message.channel.send("Music Paused");

		}else if (args[0] == "resume" || args[0] == "play"){
			//Check if there isn't a music stream in this server
			if (!client.musicStreams[`${message.guild.id}`][0].paused) {
				message.channel.send("There is no paused music stream to resume!");
				return;
			}

			//Resume the music stream
			client.musicStreams[`${message.guild.id}`][0].resume();
			message.channel.send("Music Resumed");

		}else if (args[0] == "end"||args[0] == "stop"){
			//Check if there isn't a music stream in this server
			if (!client.musicStreams[`${message.guild.id}`]) {
				message.channel.send("There is no music stream to end!");
				return;
			}

			//Destroy the music dispatcher
			client.musicStreams[`${message.guild.id}`][0].destroy();

			//Leave the voice channel
			client.musicStreams[`${message.guild.id}`][1].leave();

			//Delete the guildID:[musicStream,voiceChannel] pair from the client.musicStreams object
			delete client.musicStreams[`${message.guild.id}`];
		} else if (args[0] == "volume") {
			//Quick check to make sure the argument inputted is a number and not too large to prevent eardrum destruction.
			//Tries to convert the argument into a number (since arugments are always string), then checks if it succeeded.
			//I don't know why the .toString() is needed - even when it's (parseFloat(args[1]) == NaN) (with no quotes) it doesn't work.
			if (parseFloat(args[1]).toString() == 'NaN'){
				message.channel.send("The volume must be a number");
				return;
			}else if (parseFloat(args[1]) > 150 || parseFloat(args[1]) <= 0) {
				message.channel.send("The volume must be more than 0% and less than 150%.");
				return;
			}else {
				//Divide volume by a hundred, since in discord.js 1 is 100%
				client.musicStreams[`${message.guild.id}`][0].setVolume(parseFloat(args[1])/100);
				message.channel.send(`Volume set to ${parseFloat(args[1])}%.`);
			}
		}else{
			message.channel.send("That's not a valid music command!");
		}

		//When song is finished, delete dispatcher and leave.
		client.musicStreams[`${message.guild.id}`][0].on("finish", () => {
			//Destroy music dispatcher
			client.musicStreams[`${message.guild.id}`][0].destroy();
			//Leave voice channel
			client.musicStreams[`${message.guild.id}`][1].leave();
			//Delete musicStream entry from client.musicStreams
			delete client.musicStreams[`${message.guild.id}`]
		})
	}
};
