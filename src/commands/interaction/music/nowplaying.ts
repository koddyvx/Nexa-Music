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

import { getPlayer } from "@/utils/commands";
import { formatDuration, panelReply, progressBar, requesterName } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "nowplaying",
  description: "Show the current track and playback progress.",
  inVoice: true,
  sameVoice: true,
  player: true,
  current: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId)!;
    const track = player.current!;

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Playback",
        title: "Now playing",
        imageUrl: track.info.thumbnail,
        lines: [
          `[${track.info.title}](${track.info.uri})`,
          `Artist: ${track.info.author}`,
          `Progress: ${formatDuration(player.position)} ${progressBar(player.position, track.info.length)} ${formatDuration(track.info.length)}`,
          `Requested by: ${requesterName(track)}`,
          `Loop mode: ${player.loop}`,
          `Autoplay: ${player.isAutoplay ? "enabled" : "disabled"}`,
        ],
      },
    }));
  },
};

export default command;
