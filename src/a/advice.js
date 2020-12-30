module.exports = {
    name: 'advice',
    description: 'Gives some good advice',
    usage: `?advice`,
    category: "fun",
    guildOnly: false,
    execute(message,args,client) {
        message.channel.send("Getting advice...")

        const sendResult = (result) => {
            message.channel.send(`\`${result.slip.advice}\``)
        };

        const getAdvice = () => {
            const xhr = new client.XMLHttpRequest();
            const adviceUrl = "https://api.adviceslip.com/advice"

            xhr.responseType = 'json';

            xhr.onreadystatechange = () => {
                if (xhr.readyState === client.XMLHttpRequest.DONE) {
                    sendResult(xhr.response);
                }
            };

            xhr.open('GET',adviceUrl);
            xhr.send();
        }

        getAdvice();

    }
};
