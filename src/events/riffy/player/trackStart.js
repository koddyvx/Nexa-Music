const {
    ContainerBuilder,
    TextDisplayBuilder,
    SectionBuilder,
    ThumbnailBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags
} = require("discord.js");

const { convertTime } = require("../../../utils/convert");

module.exports = (client) => {
    client.riffy.on("trackStart", async (player, track) => {

        const channel = client.channels.cache.get(player.textChannel);
        if (!channel) return;

        const formatString = (str, maxLength) =>
            str.length > maxLength
                ? str.substring(0, maxLength - 3) + "..."
                : str;

        const trackTitle = formatString(
            track.info.title || "Unknown",
            40
        ).replace(/ - Topic$/, "");

        const trackAuthor = formatString(
            track.info.author || "Unknown",
            30
        ).replace(/ - Topic$/, "");

        const trackDuration = track.info.isStream
            ? "LIVE"
            : convertTime(track.info.length);

        const thumbnail =
            track.info.thumbnail;

        const container = new ContainerBuilder()
                   .setAccentColor(client.config.color)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    "##  Now Playing"
                )
            )

            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(SeparatorSpacingSize.Small)
            )

            .addSectionComponents(
                new SectionBuilder()
                    .setThumbnailAccessory(
                        new ThumbnailBuilder().setURL(thumbnail)
                    )
                          .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            `### [${trackTitle}](${track.info.uri})\n\n` +
                            `**Author:** ${trackAuthor}\n` +
                            `**Duration:** ${trackDuration}`
                        )
                    )
            );

        await channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [container]
        });
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
