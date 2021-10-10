const { SlashCommandBuilder } = require('@discordjs/builders');

const cmdName = 'points';
const cmdDescription = 'See your points!';

module.exports = {
	name: cmdName,
	description: cmdDescription,
	usage: `?points`,
	category: "general",
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName(cmdName)
		.setDescription(cmdDescription)
		.addUserOption(option =>
			option.setName('user')
				.setDescription('User to see points of')),

	execute(interaction) {
		const targetUser = interaction.options.getUser('user');
		if(targetUser){
			const mentionedUserId = targetUser.id;

			if (interaction.client.getPoints.get(mentionedUserId,interaction.guild.id)){
				const userScore = interaction.client.getPoints.get(mentionedUserId,interaction.guild.id);
				interaction.reply(`${userScore.username} has ${userScore.points} points and are level ${userScore.level}!`);
			}else{
				interaction.reply('That person doesn\'t seem to have points yet in this server! Send a messages to get points.')
			}

		}else{
			const userScore = interaction.client.getPoints.get(interaction.user.id,interaction.guild.id);
			interaction.reply(`You have ${userScore.points} points and are level ${userScore.level}!`);
		}
	}
};
