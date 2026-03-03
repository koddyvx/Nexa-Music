const { EmbedBuilder } = require("discord.js")
const { convertTime } = require("../../../utils/convert");

module.exports = (client) => {
client.riffy.on("trackStart", async (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);

    const formatString = (str, maxLength) => (str.length > maxLength ? str.substr(0, maxLength - 3) + "..." : str);
    const trackTitle = formatString(track.info.title || "Unknown", 30).replace(/ - Topic$/, "");
    const trackAuthor = formatString(track.info.author || "Unknown", 25).replace(/ - Topic$/, "");
    const trackDuration = track.info.isStream ? "LIVE" : convertTime(track.info.length);

    const embed = new EmbedBuilder()
        .setAuthor({name: 'Now playing'})
        .setColor(client.config.color)
        .setThumbnail(track.info.thumbnail)
        .setDescription(`### [${trackTitle}](${track.info.uri})`)
        .addFields([
            { name: `Author:`, value: `${trackAuthor}`, inline: true },
            { name: `Duration:`, value: `${trackDuration}`, inline: true },
        ]);

    channel.send({ embeds: [embed] });
    });
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
