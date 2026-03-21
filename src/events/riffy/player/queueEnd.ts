import { createEmbed, isSendableChannel } from "@/utils/discord";
import type { ExtendedPlayer, NexaClient } from "@/types";

export default function registerQueueEnd(client: NexaClient): void {
  client.riffy.on("queueEnd", async (rawPlayer) => {
    const player = rawPlayer as ExtendedPlayer;

    if (player.message) {
      await player.message.delete().catch(() => undefined);
    }

    const channel = client.channels.cache.get(player.textChannel);
    if (!isSendableChannel(channel)) {
      return;
    }

    if (player.isAutoplay && typeof player.autoplay === "function") {
      await player.autoplay(player);
      return;
    }

    await player.destroy();
    await channel.send({
      embeds: [createEmbed(client, "Queue Ended", "The queue ended and the player has disconnected.")],
    }).catch(() => undefined);
  });
}
