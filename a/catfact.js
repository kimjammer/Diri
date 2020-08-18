module.exports = {
    name: 'catFact',
    description: 'A random fact about cats will be given',
    guildOnly: false,
    execute(message,args,client) {
        message.channel.send("Getting a cat fact...")

        const sendResult = (result) => {
            message.channel.send(`\`${result.text}\``)
        };

        const getCatFact = () => {
            const xhr = new client.XMLHttpRequest();
            const adviceUrl = "https://cat-fact.herokuapp.com/facts/random"

            xhr.responseType = 'json';

            xhr.onreadystatechange = () => {
                if (xhr.readyState === client.XMLHttpRequest.DONE) {
                    sendResult(xhr.response);
                }
            };

            xhr.open('GET',adviceUrl);
            xhr.send();
        }

        getCatFact();

    }
};
