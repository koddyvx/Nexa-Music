import { createEmbed } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "ping",
  description: "Check bot latency and uptime.",

  async run(client, interaction) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    await interaction.reply({
      embeds: [
        createEmbed(
          client,
          "Nexa Music Status",
          `Gateway Ping: ${client.ws.ping}ms\nUptime: ${hours}h ${minutes}m ${seconds}s\nNode Version: ${process.version}`,
        ),
      ],
    });
  },
};

export default command;
