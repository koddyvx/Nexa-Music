const { readdirSync } = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

module.exports = async (client) => {
    const slash = [];
    let commandCount = 0;

    readdirSync('./src/commands/interaction/').forEach((dir) => {
        const commands = readdirSync(`./src/commands/interaction/${dir}`).filter((file) => file.endsWith(".js"));

        for (const file of commands) {
            try {
                const pull = require(`../commands/interaction/${dir}/${file}`);

                if (!pull.name || !pull.description) {
                    console.log(`Missing a name or description in ${file} slash command.`);
                    continue;
                }

                const data = {};
                for (const key in pull) {
                    data[key.toLowerCase()] = pull[key];
                }

                slash.push(data);
                pull.category = dir;
                client.slashCommands.set(pull.name, pull);

                commandCount++;
              //  console.log(`[SLASH] Loaded command: ${pull.name}`);

            } catch (err) {
                console.log(`Couldn't load the slash command ${file}, error: ${err}`);
                console.log(err);
                continue;
            }
        }
    });

    console.log(`[CMD] Total slash commands loaded: ${commandCount}`);

    if (!client.config.clientid) {
        console.log("Couldn't find the client ID in the config file.");
        return process.exit();
    }

    const rest = new REST({ version: '10' }).setToken(client.config.token);

    try {
        await rest.put(
            Routes.applicationCommands(client.config.clientid),
            { body: slash }
        );
        console.log("[CMD] Successfully registered application commands.");
    } catch (err) {
        console.log("Couldn't register application commands.");
        console.log(err);
    }
};

/**
 * Project: Nexa Music
 * Author: KoDdy, Razi
 * Organization: Infinity
 *
 * This project is open-source and free to use, modify, and distribute.
 * If you encounter any issues, errors, or have questions,
 * please contact us through the official support server:
 * https://discord.gg/fbu64BmPFD
 */
