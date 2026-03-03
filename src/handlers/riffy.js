const { readdirSync } = require('fs');
const path = require('path');

module.exports = (client) => {
    let eventCount = 0;

    readdirSync(path.join(__dirname, '../events/riffy')).forEach(dir => {
        const files = readdirSync(path.join(__dirname, '../events/riffy', dir)).filter(f => f.endsWith('.js'));

        for (const file of files) {
            try {
                const pull = require(path.join(__dirname, '../events/riffy', dir, file));

                const eventName = pull.name && typeof pull.name === 'string'
                    ? pull.name
                    : file.replace('.js', '');

                if (pull.name && typeof pull.name !== 'string') {
                    console.log(`[WARNING] Couldn't load the riffy event ${file}, error: Property 'name' should be a string.`);
                    continue;
                }

                if (typeof pull === 'function') {
                    pull(client);
                }

                eventCount++;
                //console.log(`[RIFFY] Loaded event: ${eventName}`);

            } catch (err) {
                console.log(`[ERROR] Couldn't load the riffy event ${file}, error: ${err.message}`);
            }
        }
    });

    console.log(`[RIFFY] Successfully loaded ${eventCount} riffy.`);
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
