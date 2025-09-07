module.exports = (client) => {
    client.riffy.on("nodeDisconnect", (node, reason) => {
        console.log(`[RIFFY] Node "${node.options.identifier}" disconnected`, reason);
    });
};

/**
 * Project: Nexa Music
 * Author: KoDdy, Razi
 * Company: Infinity
 * This code is the property of Infinity and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/fbu64BmPFD

 */
