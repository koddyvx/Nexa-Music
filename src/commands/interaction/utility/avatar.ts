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
import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "avatar",
  description: "Show a user's avatar.",
  options: [{ name: "user", description: "User to inspect", type: ApplicationCommandOptionType.User, required: false }],
  async run(_client, interaction) {
    const user = interaction.options.getUser?.("user") ?? interaction.user;
    await interaction.reply(panelReply({ panel: { eyebrow: "Utility", title: `${user.username}'s avatar`, imageUrl: user.displayAvatarURL({ size: 1024 }), lines: [`User ID: ${user.id}`] } }));
  },
};

export default command;
