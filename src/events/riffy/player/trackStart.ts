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

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";
import { buildPanel, formatTrackDuration, truncate } from "@/utils/discord";
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

    const panel = buildPanel({
      eyebrow: "Nexa Music",
      title: "Now Playing",
      imageUrl: track.info.thumbnail,
      lines: [
        `[${truncate(track.info.title || "Unknown title", 70)}](${track.info.uri})`,
        `Artist: ${truncate(track.info.author || "Unknown artist", 48)}`,
        `Duration: ${formatTrackDuration(track)}`,
        `Requested by: ${track.info.requester?.user.username ?? "Unknown user"}`,
      ],
    });

    panel.addActionRowComponents(controlsRow(player.paused));

    const message = await channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [panel] as any,
    });

    player.message = message as never;
  });
}
