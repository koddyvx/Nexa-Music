import { createEmbed, formatTrackDuration, isSendableChannel, truncate } from "@/utils/discord";
import type { ExtendedPlayer, ExtendedTrack, NexaClient } from "@/types";

export default function registerTrackStart(client: NexaClient): void {
  client.riffy.on("trackStart", async (rawPlayer, rawTrack) => {
    const player = rawPlayer as ExtendedPlayer;
    const track = rawTrack as ExtendedTrack;
    const channel = client.channels.cache.get(player.textChannel);

    if (!isSendableChannel(channel)) {
      return;
    }

    const embed = createEmbed(
      client,
      "Now Playing",
      `**[${truncate(track.info.title || "Unknown", 60)}](${track.info.uri})**\nAuthor: ${truncate(track.info.author || "Unknown", 40)}\nDuration: ${formatTrackDuration(track)}`,
    );

    if (track.info.thumbnail) {
      embed.setThumbnail(track.info.thumbnail);
    }

    const message = await channel.send({ embeds: [embed] });
    player.message = message as never;
  });
}
