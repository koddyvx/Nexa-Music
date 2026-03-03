const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "stop",
    description: "Stop the music and disconnect the bot",
    inVc: true,
    sameVc: true,
    player: true,

    run: async (client, interaction) => {
        const player = client.riffy.players.get(interaction.guildId);

        if (!player) {
            return interaction.reply({
                content: "❌ | There is no music playing.",
                ephemeral: true,
            });
        }

        player.destroy();

        return interaction.reply({
            content: "⏹️ | Stopped the music and left the voice channel.",
        });
    },
};/**
 * Project: Nexa Music
 * Author: KoDdy, Razi
 * Organization: Infinity
 *
 * This project is open-source and free to use, modify, and distribute.
 * If you encounter any issues, errors, or have questions,
 * please contact us through the official support server:
 * https://discord.gg/fbu64BmPFD
 */

