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
  name: "serverinfo",
  description: "Show information about the current server.",
  guildOnly: true,

  async run(_client, interaction) {
    if (!interaction.inGuild()) {
      await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Utility", title: "Server only", description: "This command can only be used in a server." } }));
      return;
    }

    const guild = interaction.guild!;
    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Utility",
        title: guild.name,
        imageUrl: guild.iconURL() ?? undefined,
        lines: [`Guild ID: ${guild.id}`, `Members: ${guild.memberCount}`, `Channels: ${guild.channels.cache.size}`, `Roles: ${guild.roles.cache.size}`, `Created: ${guild.createdAt.toISOString()}`],
      },
    }));
  },
};

export default command;
