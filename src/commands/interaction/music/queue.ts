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
import { formatDuration, panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "queue",
  description: "Show the active queue and the next tracks.",
  inVoice: true,
  sameVoice: true,
  player: true,
  current: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId)!;
    const queue = player.queue.length > 10 ? player.queue.slice(0, 10) : player.queue;
    const upcoming = queue.length > 0
      ? queue.map((track, index) => `${index + 1}. ${track.info.title} - ${track.info.author}`).join("\n")
      : "No tracks are waiting in the queue.";

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Queue",
        title: "Playback queue",
        imageUrl: player.current?.info.thumbnail,
        lines: [
          `Now playing: ${player.current!.info.title}`,
          `Duration: ${formatDuration(player.current!.info.length)}`,
          `Queue size: ${player.queue.length}`,
          `Loop mode: ${player.loop}`,
          "Upcoming tracks",
          upcoming,
        ],
      },
    }));
  },
};

export default command;
