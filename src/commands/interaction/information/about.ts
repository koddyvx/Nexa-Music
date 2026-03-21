import { createEmbed } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "about",
  description: "View information and statistics about Nexa Music.",

  async run(client, interaction) {
    const guilds = client.guilds.cache.size;
    const users = client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0);
    const players = client.riffy.players.size;
    const nodes = Array.from(client.riffy.nodes.values()).filter((node) => node.isConnected).length;
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    const embed = createEmbed(
      client,
      "About Nexa",
      [
        "High-performance Discord music bot powered by Lavalink v4 and Riffy.",
        "",
        `Servers: ${guilds}`,
        `Users: ${users}`,
        `Active Players: ${players}`,
        `Connected Nodes: ${nodes}`,
        "",
        `Uptime: ${days}d ${hours}h ${minutes}m`,
        `Ping: ${client.ws.ping}ms`,
        `Node.js: ${process.version}`,
        "Discord.js: v14",
        "",
        "Use /help to explore all available commands.",
      ].join("\n"),
    );

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
