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

import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "nexa",
  description: "Hybrid command example for slash and prefix.",
  slashcmd: true,
  prefixcmd: true,
  aliases: ["nx"],

  async run(_client, interaction) {
    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Nexa Music",
        title: "Hybrid Command",
        lines: [
          "This command works in both systems.",
          "Slash: /nexa",
          "Prefix: -nexa or -nx",
          "Flags: slashcmd=true, prefixcmd=true",
        ],
      },
    }));
  },
};

export default command;

