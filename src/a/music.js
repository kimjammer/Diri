const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, NoSubscriberBehavior, createAudioResource, StreamType,
	entersState, AudioPlayerStatus
} = require('@discordjs/voice');
const {MusicSubscription} = require('../classes/musicSubscription.js');

const cmdName = 'music';
const cmdDescription = 'Plays music in the voice channel you are in!';

module.exports = {
	name: cmdName,
	description: cmdDescription,
	usage: `?music [start (optional:jazz or youtube link),pause,resume,end,volume (0-150)]`,
	category: "general",
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName(cmdName)
		.setDescription(cmdDescription)
		.addSubcommandGroup(subcommandGroup =>
			subcommandGroup.setName('start')
				.setDescription('Start a song.')
				.addSubcommand(subcommand =>
					subcommand
						.setName('youtube')
						.setDescription('Play a youtube video')
						.addStringOption(option =>
							option
								.setName('url')
								.setDescription('The URL of the youtbe video')
								.setRequired(true)))
				.addSubcommand(subcommand =>
					subcommand
						.setName('jazz')
						.setDescription('Play a random jazz song')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('pause')
				.setDescription('Pause the music'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('play')
				.setDescription('Resume the music'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('end')
				.setDescription('End the music stream')),

	async execute (interaction) {
		await interaction.deferReply();

		//Dark regular expression magic that will check if a string is a youtube video link.
		let ytLinkRegex = new RegExp('(?:.+?)?(?:\\/v\\/|watch\\/|\\?v=|\\&v=|youtu\\.be\\/|\\/v=|^youtu\\.be\\/|watch\\%3Fv\\%3D)([a-zA-Z0-9_-]{11})+')
		let targetCommand = interaction.options.getSubcommand()

		//If there is a existing music stream, it will grab it here.
		let existingSubscription = interaction.client.musicStreams.get(interaction.guildId)

		if (targetCommand == "youtube" || targetCommand == "jazz") {
			/*
			//If there is a active music stream in this server, tell them that and don't play anything.
			//The client.musicStreams object stores key:[musicStream,voiceChannel] pairs which represent music streams
			//and the voice channel they're in. {guildID: [musicStream,voiceChannel], guildID: [musicStream,voiceChannel]}
			if (interaction.client.musicStreams[`${interaction.guild.id}`]) {
				message.channel.send("There is already a music stream in this server!");
				return;
			}*/
			let connection;
			let audioPlayer;

			// Join the voice channel the message sender is in.
			if (interaction.member.voice.channel) {
				 connection = joinVoiceChannel({
					channelId: interaction.member.voice.channelId,
					guildId: interaction.guild.id,
					adapterCreator: interaction.member.guild.voiceAdapterCreator,
				 });
			} else {
				await interaction.followUp({content: 'You need to join a voice channel first.',ephemeral:true});
				return;
			}

			if (targetCommand == "jazz") {
				try {
					const playlist = await interaction.client.ytfps('PL_pFtRZACW0Yy2D-J5MRWAer2Ii6xQIst');

					//Pick random number
					let randomJazzNumber = Math.floor(Math.random()*playlist.video_count);

					let randomJazzSong = playlist.videos[randomJazzNumber]

					//Play the random jazz music
					const audioStream = interaction.client.ytdl(`${randomJazzSong.url}`, { filter: 'audioonly' })
					const audioResource = createAudioResource(audioStream, {
						inputType: StreamType.Arbitrary,
					})
					audioPlayer = createAudioPlayer({
						behaviors: {
							noSubscriber: NoSubscriberBehavior.Pause
						}
					})
					audioPlayer.play(audioResource);
					await entersState(audioPlayer, AudioPlayerStatus.Playing, 5_000);
					const subscription = new MusicSubscription(
						interaction.guild.id,
						interaction.member.voice.channelId,
						connection,
						audioPlayer,
						audioResource)

					//Adds a property:item pair - guildID: MusicSubscription to the musicStreams object so it can be accessed later.
					interaction.client.musicStreams.set(interaction.guildId, subscription);

					//Tell the user
					await interaction.followUp(`Playing the random jazz song: `+"<"+`${randomJazzSong.title}`+">"+`. It is ${randomJazzSong.length} long. ${randomJazzSong.url}`)
				}catch(err) {
					throw err;
					return;
				};
			}else if (ytLinkRegex.test(interaction.options.getString('url'))) {
				const youtubeURL = interaction.options.getString('url')
				try {
					// Find the song
					const songInfo = await interaction.client.ytdl.getInfo(youtubeURL);
				} catch (error) {
					await interaction.followUp({content: "Couldn't find that youtube video",ephemeral:true});
					return;
				}

				//Play the youtube video
				const audioStream = interaction.client.ytdl(`${youtubeURL}`, { filter: 'audioonly' })
				const audioResource = createAudioResource(audioStream, {
					inputType: StreamType.Arbitrary,
				})
				audioPlayer = createAudioPlayer({
					behaviors: {
						noSubscriber: NoSubscriberBehavior.Pause
					}
				})
				audioPlayer.play(audioResource);

				interaction.client.musicStreams.set(interaction.guildId, {
					channelId: interaction.member.voice.channel,
					voiceConnection: connection,
					audioPlayer: audioPlayer,
				})
				const subscription = new MusicSubscription(
					interaction.guild.id,
					interaction.member.voice.channelId,
					connection,
					audioPlayer,
					audioResource)
				//Adds a property:item pair - guildID: MusicSubscription to the musicStreams object so it can be accessed later.
				interaction.client.musicStreams.set(interaction.guildId, subscription);

				//Tell the user
				await interaction.followUp(`Playing the youtube video: `+"<"+`${youtubeURL}`+">");
			}else {
				await interaction.followUp({content:"That's not a valid option or youtube link!",ephemeral:true});
				return;
			}

			//When song is finished, delete dispatcher and leave.
			audioPlayer.on(AudioPlayerStatus.Idle, () => {
				//Destroy music dispatcher
				audioPlayer.stop();
			})

		}else if (targetCommand == "pause") {
			//Check if there isn't a music stream in this server
			if (!existingSubscription) {
				await interaction.followUp({content: "There is no currently playing music stream to pause!",ephemeral:true});
				return;
			}

			//Pause the music stream
			existingSubscription.audioPlayer.pause();
			await interaction.followUp("Music Paused");
		}else if (targetCommand == "play"){
			//Check if there isn't a music stream in this server
			if (!existingSubscription) {
				await interaction.followUp({content: "There is no paused music stream to resume!",ephemeral:true});
				return;
			}

			//Resume the music stream
			existingSubscription.audioPlayer.unpause();
			await interaction.followUp("Music Resumed");
		}else if (targetCommand == "end"){
			//Check if there isn't a music stream in this server
			if (!existingSubscription) {
				await interaction.followUp({content: "There is no music stream to end!",ephemeral:true});
				return;
			}

			//Destroy the music dispatcher
			existingSubscription.voiceConnection.destroy();

			//Delete the guildID:[musicStream,voiceChannel] pair from the client.musicStreams object
			interaction.client.musicStreams.delete(interaction.guildId);
			await interaction.followUp({content: "Music ended",ephemeral:true})
		}else{
			await interaction.followUp({content: "That's not a valid music command!", ephemeral:true});
		}
	}
};
