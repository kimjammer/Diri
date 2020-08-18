module.exports = {
    name: 'stats',
    description: 'Provides interesting information about the bot',
    guildOnly: false,
    execute(message,args,client) {
        const date_obj = new Date();

        function msToHumanReadable( ms ) {
            // 1- Convert to seconds:
            let seconds = ms / 1000;
            // 2 - Extract days
            let days = parseInt(seconds / 86400);
            seconds = seconds % 86400;
            // 3- Extract hours:
            let hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
            seconds = seconds % 3600; // seconds remaining after extracting hours
            // 4- Extract minutes:
            let minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
            // 5- Keep only seconds not extracted to minutes:
            seconds = Math.floor(seconds % 60);
            return( days + " d: " + hours+" h: "+minutes+" m: "+seconds +" s");
        }


        let stats_general_info = `Created on: ${client.user.createdAt.toDateString()} 
        ID: ${client.user.id}
        Number of Commands: ${client.commands.size}
        Version: 1.1.0
        Creator: KimJammer#4819`;

        let stats_usage_info = `Servers: ${client.guilds.cache.size}
        Channels: ${client.channels.cache.size}`

        let stats_softwareHardware_info = `Discord.js Version: 12.3.1
        Node Version: 12.18.3
        Operating System: Ubuntu Server 20.04 LTS
        Uptime: ${msToHumanReadable(client.uptime)}`

        const embed = new client.MessageEmbed() //this is Discord.MessageEmbed but put into client for easy access
            .setAuthor('Diri','https://kimjammer.github.io/Portfolio/img/Diri.png','https://diri-robot.web.app/')
            .setColor(0x003ea1)
            .setTitle(`Statistics about Diri`)
            .addField("General Info", stats_general_info, false)
            .addField("Usage Info", stats_usage_info, false)
            .addField("Software & Hardware Info", stats_softwareHardware_info, false)
            .setFooter(`Information fetched on: ${date_obj.toDateString()}`)
            .setThumbnail("https://kimjammer.github.io/Portfolio/img/Diri.png")

        message.channel.send(embed);
    }
};
