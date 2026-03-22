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
  name: "uptime",
  description: "Show bot uptime.",

  async run(client, interaction) {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Utility",
        title: "Process uptime",
        lines: [
          `Days: ${days}`,
          `Hours: ${hours}`,
          `Minutes: ${minutes}`,
          `Seconds: ${seconds}`,
          `Guilds: ${client.guilds.cache.size}`,
        ],
      },
    }));
  },
};

export default command;
