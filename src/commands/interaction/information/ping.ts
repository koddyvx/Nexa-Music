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
        eyebrow: "Reddish status",
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
