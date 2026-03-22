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

import { ApplicationCommandOptionType } from "discord.js";
import { getPlayer } from "@/utils/commands";
import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "volume",
  description: "Set the playback volume.",
  inVoice: true,
  sameVoice: true,
  player: true,
  current: true,
  options: [
    {
      name: "volume",
      description: "A value between 0 and 100",
      type: ApplicationCommandOptionType.Number,
      required: true,
      min_value: 0,
      max_value: 100,
    },
  ],

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId)!;
    const volume = interaction.options.getNumber("volume", true);

    await player.setVolume(volume);
    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Playback",
        title: "Volume updated",
        description: `Volume is now set to ${volume} percent.`,
      },
    }));
  },
};

export default command;
