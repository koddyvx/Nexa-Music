module.exports = (client) => {
    client.riffy.on('nodeError', (node, error) => {
        console.log(`[RIFFY] Node error on ${node.name}: ${error.message}`);
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
