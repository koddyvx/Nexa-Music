const { GatewayDispatchEvents } = require("discord.js");

module.exports = (client) => {
client.on("raw", (d) => {
    if (![GatewayDispatchEvents.VoiceStateUpdate, GatewayDispatchEvents.VoiceServerUpdate,].includes(d.t)) return;
    client.riffy.updateVoiceState(d);
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
