const { Client, CommandInteraction } = require("discord.js")

module.exports = {
    name: "ping",
    description: "Obtain the bot's latency reading.",
    run: async (client, interaction) => {
        return interaction.reply(`${client.ws.ping}ms`)
    }
}
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
