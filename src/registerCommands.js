const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId } = require('./config.json');
const fs = require('fs');

module.exports = {
	run (testGuildId = '')
	{
		const commands = [];
		const commandFiles = fs.readdirSync('./a').filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`./a/${file}`);
			commands.push(command.data.toJSON());
		}

		const rest = new REST({ version: '9' }).setToken(token);

		(async () => {
			try {
				console.log('Started refreshing application (/) commands.');

				//If a test guild was specified, add commands as guild commands.
				if (testGuildId) {
					await rest.put(
						Routes.applicationGuildCommands(clientId, testGuildId),
						{ body: commands },
					);
				}else{
					await rest.put(
						Routes.applicationCommands(clientId),
						{ body: commands },
					);
				}

				console.log('Successfully reloaded application (/) commands.');
			} catch (error) {
				console.error(error);
			}
		})();
	}
};
