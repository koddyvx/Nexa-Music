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
 * Author: KoDdy
 * Company: Infinity
 * This code is the property of Infinity and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/fbu64BmPFD

 */
