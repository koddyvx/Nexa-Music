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
import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "shuffle",
  description: "Shuffle the remaining queue order.",
  inVoice: true,
  sameVoice: true,
  player: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId)!;

    if (player.queue.length < 2) {
      await interaction.reply(panelReply({
        ephemeral: true,
        panel: {
          eyebrow: "Queue",
          title: "Not enough tracks",
          description: "Add at least two tracks to the queue before shuffling.",
        },
      }));
      return;
    }

    player.queue.shuffle();
    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Queue",
        title: "Queue shuffled",
        description: `Shuffled ${player.queue.length} queued tracks.`,
      },
    }));
  },
};

export default command;
