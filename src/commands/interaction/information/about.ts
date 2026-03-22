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
  name: "about",
  description: "Show an overview of the bot and its current reach.",

  async run(client, interaction) {
    const guilds = client.guilds.cache.size;
    const users = client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0);
    const players = client.riffy.players.size;
    const runtimeNodes = Array.from(((client.riffy as typeof client.riffy & {
      nodeMap?: Map<string, { connected?: boolean; isConnected?: boolean }>;
    }).nodeMap ?? new Map()).values());
    const connectedNodes = runtimeNodes.filter((node) => node.connected ?? node.isConnected).length;
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Nexa Music",
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
