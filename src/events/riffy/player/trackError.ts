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

import { panelMessage } from "@/utils/discord";
import type { ExtendedPlayer, ExtendedTrack, NexaClient } from "@/types";

export default function registerTrackError(client: NexaClient): void {
  client.riffy.on("trackError", async (rawPlayer, rawTrack, errorPayload) => {
    const player = rawPlayer as ExtendedPlayer;
    const track = rawTrack as ExtendedTrack | undefined;
    const channel = client.channels.cache.get(player.textChannel);

    if (!channel || !("send" in channel) || typeof channel.send !== "function") {
      return;
    }

    const message = errorPayload instanceof Error ? errorPayload.message : String(errorPayload ?? "Unknown playback error");

    await channel.send(
      panelMessage({
        panel: {
          eyebrow: "Nexa Music",
          title: "Track Error",
          lines: [`Track: ${track?.info.title ?? "Unknown track"}`, `Error: ${message}`],
        },
      }),
    ).catch(() => undefined);
  });
}

