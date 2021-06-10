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
            if (!result) {
                message.channel.send(`I couldn't get a cat fact. Try Again!`);
                return;
            }

            message.channel.send(`\`${result.fact}\``);
        };

        const getCatFact = () => {
            const xhr = new client.XMLHttpRequest();
            const url = "https://catfact.ninja/fact"

            xhr.responseType = 'json';

            xhr.onreadystatechange = () => {
                if (xhr.readyState === client.XMLHttpRequest.DONE) {
                    sendResult(xhr.response);
                }
            };

            xhr.open('GET',url);
            xhr.send();
        }

        getCatFact();

    }
};
