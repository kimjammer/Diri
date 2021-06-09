module.exports = {
    name: 'catFact',
    description: 'A random fact about cats will be given',
    usage: `?catFact`,
    category: "fun",
    guildOnly: false,
    execute(message,args,client) {
        message.channel.send("Getting a cat fact...")

        const sendResult = (result) => {
            //Check that api actually returned a response
            if (!result.text) {
                message.channel.send(`I couldn't get a cat fact. Try Again!`);
                return;
            }

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
