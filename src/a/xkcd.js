module.exports = {
    name: 'xkcd',
    description: 'Returns today\'s comic or a specific one by id.',
    usage: `?xkcd [optional: comic number]`,
    category: "fun",
    guildOnly: false,
    execute(message,args,client) {
        message.channel.send("Fetching comic")

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

        const getxkcd = (xkcdUrl, isNumCheck) => {
            const xhr = new client.XMLHttpRequest();

            xhr.responseType = 'json';

            xhr.onreadystatechange = () => {
                if (xhr.readyState === client.XMLHttpRequest.DONE) {
                	if (isNumCheck) {
                        determineXkcdNumValidity (xhr.response.num);
                	}else {
                		sendResult(xhr.response);
                	}
                }
            };
            xhr.open('GET',xkcdUrl);
            xhr.send();
        }

        function determineXkcdNumValidity (latestXkcdNum) {
            if (args[0] <= latestXkcdNum) {
                xkcdUrl = `http://xkcd.com/${args[0]}/info.0.json`
                getxkcd(xkcdUrl, false);
            }else {
                message.channel.send("That xkcd comic doesn't exist!")
            }
        }

        let xkcdUrl;

        if (args[0]) {
            //call getxkcd, but with the isNumCheck on. This will tell it to check the num, and call itself again if the number is valid.
            getxkcd("http://xkcd.com/info.0.json", true);
        }else {
            xkcdUrl = "http://xkcd.com/info.0.json"
            getxkcd(xkcdUrl, false);
        }
    }
};
