import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "about",
  description: "Show an overview of the bot and its current reach.",

  async run(client, interaction) {
    const guilds = client.guilds.cache.size;
    const users = client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0);
    const players = client.riffy.players.size;
    const connectedNodes = Array.from(client.riffy.nodes.values()).filter((node) => node.isConnected).length;
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Reddish overview",
        title: "About Nexa Music",
        lines: [
          "Nexa Music is a Discord playback bot powered by Lavalink v4 and Riffy.",
          `Servers connected: ${guilds}`,
          `Users reached: ${users}`,
          `Active players: ${players}`,
          `Connected nodes: ${connectedNodes}`,
          `Uptime: ${days}d ${hours}h ${minutes}m`,
          `Gateway latency: ${client.ws.ping}ms`,
          `Runtime: ${process.version}`,
        ],
      },
    }));
  },
};

export default command;
