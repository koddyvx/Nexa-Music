const { readdirSync } = require('fs');
const path = require('path');

module.exports = (client) => {
    let eventCount = 0;

    readdirSync(path.join(__dirname, '../events/bot')).forEach(dir => {
        const events = readdirSync(path.join(__dirname, '../events/bot', dir))
            .filter(file => file.endsWith(".js"));

        for (const file of events) {
            try {
                const pull = require(path.join(__dirname, '../events/bot', dir, file));

                if (typeof pull === 'function') {
                    pull(client);
                    eventCount++;
                    
                } else {
                    console.log(`[WANING] Event ${file} does not export a function.`);
                }
            } catch (err) {
                console.log(`[ERROR] Couldn't load the event ${file}, error: ${err.message}`);
            }
        }
    });

    console.log(`[EVENTS] Successfully loaded ${eventCount} events.`);
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
