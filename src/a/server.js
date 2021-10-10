const { SlashCommandBuilder } = require('@discordjs/builders');

const cmdName = 'server';
const cmdDescription = 'Provides interesting information about the server';

module.exports = {
    name: cmdName,
    description: cmdDescription,
    usage: `?server`,
    category: "general",
    guildOnly: true,

    data: new SlashCommandBuilder()
        .setName(cmdName)
        .setDescription(cmdDescription),

    async execute(interaction) {
        const date_obj = new Date();
        let crr_guild = interaction.guild;

        let guild_general_info = `Created on: ${crr_guild.createdAt.toDateString()} 
        ID: ${crr_guild.id}
        Owner ID/: ${crr_guild.ownerId}`;

        let guild_channels_info = `Categories: ${crr_guild.channels.cache.filter(channel => channel.type === "category").size}
        Text Channels: ${crr_guild.channels.cache.filter(channel => channel.type === "text").size}
        Voice Channels: ${crr_guild.channels.cache.filter(channel => channel.type === "voice").size}`

        let guild_nitro_info = `Nitro Level: ${crr_guild.premiumTier}
        Boosts:  ${crr_guild.premiumSubscriptionCount}`

        await crr_guild.members.fetch();
        let guild_members_info = `All Members: ${crr_guild.memberCount}
        ${interaction.client.emojis.cache.get("745043815232045117")} - ${crr_guild.members.cache.filter(member => member.user.client.presence.status === "online").size}
        ${interaction.client.emojis.cache.get("745043815064141935")} - ${crr_guild.members.cache.filter(member => member.user.client.presence.status === "offline").size}
        ${interaction.client.emojis.cache.get("745043815282245704")} - ${crr_guild.members.cache.filter(member => member.user.client.presence.status === "idle").size}
        ${interaction.client.emojis.cache.get("745043815416725675")} - ${crr_guild.members.cache.filter(member => member.user.client.presence.status === "dnd").size}`

        const embed = new interaction.client.MessageEmbed() //this is Discord.MessageEmbed but put into client for easy access
            .setAuthor('Diri','https://kimjammer.github.io/Portfolio/img/Diri.png','https://diri-robot.web.app/')
            .setColor(0x003ea1)
            .setTitle(`Information about ${crr_guild}`)
            .addField("General Info", guild_general_info, false)
            .addField("Channel Count", guild_channels_info, false)
            .addField("Nitro Info", guild_nitro_info, false)
            .addField("Member Info", guild_members_info, false)
            .setFooter(`Information fetched on: ${date_obj.toDateString()}`,crr_guild.iconURL())
            .setThumbnail(crr_guild.iconURL())

        interaction.reply({embeds:[embed]});
    }
};
