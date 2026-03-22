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
  name: "loop",
  description: "Change the loop mode for the player.",
  inVoice: true,
  sameVoice: true,
  player: true,
  options: [
    {
      name: "mode",
      description: "Loop mode to apply",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Off", value: "none" },
        { name: "Track", value: "track" },
        { name: "Queue", value: "queue" },
      ],
    },
  ],

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId)!;
    const mode = interaction.options.getString("mode", true) as "none" | "track" | "queue";

    await player.setLoop(mode);
    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Playback",
        title: "Loop mode updated",
        description: `Loop mode is now set to ${mode}.`,
      },
    }));
  },
};

export default command;
