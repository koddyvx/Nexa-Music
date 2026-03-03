const { ActivityType, Events } = require("discord.js");

module.exports = (client) => {
client.on(Events.ClientReady, async () => {
    client.riffy.init(client.user.id);
    console.log(`[INFO] Logged in as ${client.user.tag}`);

    client.user.setPresence({
        activities: [
            {
                name: "Nexa Music | /help",
                type: ActivityType.Custom
            },
             {
                name: "Powered By Infinity",
                type: ActivityType.Custom
            }
        ],
        status: "idle"
    })
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
