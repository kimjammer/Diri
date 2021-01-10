module.exports = {
    name: 'xkcd',
    description: 'Returns today\'s comic or a specific one by id.',
    usage: `?xkcd [optional: comic number/random to get a random comic]`,
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

        const getxkcd = (xkcdUrl, isNumCheck, isGetLatestNum = false) => { //Yeah, yeah, having three args to change what the function does is dumb. I don't have the effort to do it properly right now.
            const xhr = new client.XMLHttpRequest();

            xhr.responseType = 'json';

            xhr.onreadystatechange = () => {
                if (xhr.readyState === client.XMLHttpRequest.DONE) {
                	if (isNumCheck) {
                        determineXkcdNumValidity (xhr.response.num);
                	}else if (isGetLatestNum){
                	    sendRandomComic(xhr.response.num);
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

        function sendRandomComic (maxXkcdNum) {
            //Choose a random number from 1 to the latest xkcd number
            let randomXkcdNum = Math.floor(Math.random() * maxXkcdNum) + 1;
            //Create the xkcd url with the random number
            xkcdUrl = `http://xkcd.com/${randomXkcdNum}/info.0.json`;
            //Get and send the results
            getxkcd(xkcdUrl,false);
            //Tell the user what their random number was
            message.channel.send(`Your random comic was number ${randomXkcdNum}`);
        }

        let xkcdUrl;

        //If there are arguments, ie a comic number is specified or it says random comic.
        if (args[0]) {
            if (args[0] == "random") {
                //This gets the latest comic's number and passes it to the sendRandomComic function
                getxkcd("http://xkcd.com/info.0.json",false,true);
            }else{
                //call getxkcd, but with the isNumCheck on. This will tell it to check the num, and call itself again if the number is valid.
                getxkcd("http://xkcd.com/info.0.json", true);
            }
        }else {
            xkcdUrl = "http://xkcd.com/info.0.json"
            getxkcd(xkcdUrl, false);
        }
    }
};
