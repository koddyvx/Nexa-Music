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
import { panelReply, voiceMention } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "leave",
  description: "Disconnect the bot from the current voice channel.",
  inVoice: true,
  sameVoice: true,
  player: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId)!;
    const channelId = player.voiceChannel;

    player.queue.clear();
    await player.destroy();

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Voice state",
        title: "Disconnected",
        description: `Left ${voiceMention(channelId)} and cleared the queue.`,
      },
    }));
  },
};

export default command;
