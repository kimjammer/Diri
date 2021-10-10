const { SlashCommandBuilder } = require('@discordjs/builders');

const cmdName = 'catfact';
const cmdDescription = 'A random fact about cats will be given';

module.exports = {
    name: cmdName,
    description: cmdDescription,
    usage: `?catFact`,
    category: "fun",
    guildOnly: false,

    data: new SlashCommandBuilder()
        .setName(cmdName)
        .setDescription(cmdDescription),

    async execute(interaction) {
        interaction.deferReply();

        const sendResult = (result) => {
            //Check that api actually returned a response
            if (!result) {
                interaction.editReply(`I couldn't get a cat fact. Try Again!`);
                return;
            }

            interaction.editReply(`\`${result.fact}\``);
        };

        async function getCatFact() {
            const response = await interaction.client.fetch('https://catfact.ninja/fact');
            const data = await response.json();

            sendResult(data);
        }

        await getCatFact();
    }
};
