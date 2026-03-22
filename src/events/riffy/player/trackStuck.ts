import { panelMessage } from "@/utils/discord";
import type { ExtendedPlayer, ExtendedTrack, NexaClient } from "@/types";

export default function registerTrackStuck(client: NexaClient): void {
  client.riffy.on("trackStuck", async (rawPlayer, rawTrack, thresholdMs) => {
    const player = rawPlayer as ExtendedPlayer;
    const track = rawTrack as ExtendedTrack | undefined;
    const channel = client.channels.cache.get(player.textChannel);

    if (!channel || !("send" in channel) || typeof channel.send !== "function") {
      return;
    }

    await channel.send(
      panelMessage({
        panel: {
          eyebrow: "Nexa Music",
          title: "Track Stuck",
          lines: [
            `Track: ${track?.info.title ?? "Unknown track"}`,
            `Threshold: ${typeof thresholdMs === "number" ? `${thresholdMs}ms` : "Unavailable"}`,
          ],
        },
      }),
    ).catch(() => undefined);
  });
}

