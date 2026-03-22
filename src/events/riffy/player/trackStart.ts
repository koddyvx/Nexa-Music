import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { formatTrackDuration, panelMessage, truncate } from "@/utils/discord";
import type { ExtendedPlayer, ExtendedTrack, NexaClient } from "@/types";

function controlsRow(paused = false): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("player_toggle_pause").setLabel(paused ? "Resume" : "Pause").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("player_skip").setLabel("Skip").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("player_stop").setLabel("Stop").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("player_queue").setLabel("Queue").setStyle(ButtonStyle.Secondary),
  );
}

export default function registerTrackStart(client: NexaClient): void {
  client.riffy.on("trackStart", async (rawPlayer, rawTrack) => {
    const player = rawPlayer as ExtendedPlayer;
    const track = rawTrack as ExtendedTrack;
    const channel = client.channels.cache.get(player.textChannel);

    if (!channel || !("send" in channel) || typeof channel.send !== "function") {
      return;
    }

    const message = await channel.send(
      panelMessage({
        panel: {
          eyebrow: "Nexa Music",
          title: "Now Playing",
          imageUrl: track.info.thumbnail,
          lines: [
            `[${truncate(track.info.title || "Unknown title", 70)}](${track.info.uri})`,
            `Artist: ${truncate(track.info.author || "Unknown artist", 48)}`,
            `Duration: ${formatTrackDuration(track)}`,
            `Requested by: ${track.info.requester?.user.username ?? "Unknown user"}`,
          ],
        },
        components: [controlsRow(player.paused)],
      }),
    );

    player.message = message as never;
  });
}
