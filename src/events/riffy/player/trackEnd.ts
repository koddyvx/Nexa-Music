import { panelMessage } from "@/utils/discord";
import type { ExtendedPlayer, ExtendedTrack, NexaClient } from "@/types";

export default function registerTrackEnd(client: NexaClient): void {
  client.riffy.on("trackEnd", async (rawPlayer, rawTrack, rawReason) => {
    const player = rawPlayer as ExtendedPlayer;
    const track = rawTrack as ExtendedTrack | undefined;
    const reason = typeof rawReason === "string" ? rawReason : "finished";
    const channel = client.channels.cache.get(player.textChannel);

    if (!channel || !("send" in channel) || typeof channel.send !== "function") {
      return;
    }

    await channel.send(
      panelMessage({
        panel: {
          eyebrow: "Nexa Music",
          title: "Track Ended",
          lines: [
            `Track: ${track?.info.title ?? "Unknown track"}`,
            `Reason: ${reason}`,
            `Remaining queue: ${player.queue.length}`,
          ],
          subtle: true,
        },
      }),
    ).catch(() => undefined);
  });
}

