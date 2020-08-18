module.exports = {
    name: 'xkcd',
    description: 'Returns today\'s comic or a specific one by id.',
    guildOnly: false,
    execute(message,args,client) {
        message.channel.send("Fetching comic")

        let xkcdUrl;

        if (args[0]) {
            xkcdUrl = `http://xkcd.com/${args[0]}/info.0.json`
        }else {
            xkcdUrl = "http://xkcd.com/info.0.json"
        }


        const sendResult = (result) => {
            const embed = new client.MessageEmbed() //this is Discord.MessageEmbed but put into client for easy access
                .setAuthor('Diri','https://kimjammer.github.io/Portfolio/img/Diri.png','https://diri-robot.web.app/')
                .setColor(0xfc6f03)
                .setTitle(result.safe_title)
                .setImage(result.img)
                .addField(`Comics by Randall Munroe`,`Comic from: [https://xkcd.com/${result.num}](https://xkcd.com/${result.num})`)
                .setFooter(result.alt)

            message.channel.send(embed);
        };

        const getxkcd = () => {
            const xhr = new client.XMLHttpRequest();

            xhr.responseType = 'json';

            xhr.onreadystatechange = () => {
                if (xhr.readyState === client.XMLHttpRequest.DONE) {
                    sendResult(xhr.response);
                }
            };
            xhr.open('GET',xkcdUrl);
            xhr.send();
        }

        getxkcd();

    }
};
