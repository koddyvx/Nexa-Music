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
  name: "ping",
  description: "Show current latency and process uptime.",

  async run(client, interaction) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Nexa Music",
        title: "Connection status",
        lines: [
          `Gateway latency: ${client.ws.ping}ms`,
          `Uptime: ${hours}h ${minutes}m ${seconds}s`,
          `Node.js: ${process.version}`,
        ],
      },
    }));
  },
};

export default command;
