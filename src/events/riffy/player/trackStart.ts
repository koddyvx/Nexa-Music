import { formatTrackDuration, panelMessage, truncate } from "@/utils/discord";
import type { ExtendedPlayer, ExtendedTrack, NexaClient } from "@/types";

export default function registerTrackStart(client: NexaClient): void {
  client.riffy.on("trackStart", async (rawPlayer, rawTrack) => {
    const player = rawPlayer as ExtendedPlayer;
    const track = rawTrack as ExtendedTrack;
    const channel = client.channels.cache.get(player.textChannel);

    if (!channel || !("send" in channel) || typeof channel.send !== "function") {
      return;
    }

    const message = await channel.send(panelMessage({
      panel: {
        eyebrow: "Playback",
        title: "Now playing",
        imageUrl: track.info.thumbnail,
        lines: [
          `[${truncate(track.info.title || "Unknown title", 70)}](${track.info.uri})`,
          `Artist: ${truncate(track.info.author || "Unknown artist", 48)}`,
          `Duration: ${formatTrackDuration(track)}`,
          `Requested by: ${track.info.requester?.user.username ?? "Unknown user"}`,
        ],
      },
    }));

    player.message = message as never;
  });
}
