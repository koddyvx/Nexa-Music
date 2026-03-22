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
import { is247Enabled } from "@/storage/guildSettings";
import type { ExtendedPlayer, NexaClient } from "@/types";

export default function registerQueueEnd(client: NexaClient): void {
  client.riffy.on("queueEnd", async (rawPlayer) => {
    const player = rawPlayer as ExtendedPlayer;

    if (player.message) {
      await player.message.delete().catch(() => undefined);
    }

    const channel = client.channels.cache.get(player.textChannel);
    if (!channel || !("send" in channel) || typeof channel.send !== "function") {
      return;
    }

    if (player.isAutoplay && typeof player.autoplay === "function") {
      await player.autoplay(player);
      return;
    }

    if (is247Enabled(player.guildId)) {
      await channel.send(panelMessage({
        panel: {
          eyebrow: "Nexa Music",
          title: "Queue Ended",
          description: "24/7 mode is enabled, so I will stay connected and wait for new tracks.",
        },
      })).catch(() => undefined);
      return;
    }

    await player.destroy();
    await channel.send(panelMessage({
      panel: {
        eyebrow: "Nexa Music",
        title: "Queue Ended",
        description: "The queue finished and the player disconnected.",
      },
    })).catch(() => undefined);
  });
}
