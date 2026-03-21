import { createEmbed } from "@/utils/discord";
import { getPlayer } from "@/utils/commands";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "leave",
  description: "Leave the bot from your voice channel",
  inVoice: true,
  sameVoice: true,
  player: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId);

    if (!player) {
      await interaction.reply({
        embeds: [createEmbed(client, "Music Player Not Found", "There is no active player in this server.", "Red")],
        ephemeral: true,
      });
      return;
    }

    const voiceChannelId = player.voiceChannel;
    await player.destroy();

    await interaction.reply({
      embeds: [createEmbed(client, "Disconnected", `Successfully left <#${voiceChannelId}>.`)],
    });
  },
};

export default command;
