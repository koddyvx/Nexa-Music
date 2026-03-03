module.exports = (client) => {
    client.riffy.on('nodeConnect', (node) => {
        console.log(`[RIFFY] Node connected: ${node.name}`);
    });
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
