import { createEmbed } from "@/utils/discord";
import { getPlayer } from "@/utils/commands";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "pause",
  description: "Pauses the current track",
  inVoice: true,
  sameVoice: true,
  player: true,
  current: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId);

    if (!player?.current) {
      await interaction.reply({ embeds: [createEmbed(client, "Nothing Playing", "There is no active track to pause.", "Red")], ephemeral: true });
      return;
    }

    if (player.paused) {
      await interaction.reply({ embeds: [createEmbed(client, "Already Paused", "The player is already paused.", "Yellow")], ephemeral: true });
      return;
    }

    await player.pause(true);
    await interaction.reply({ embeds: [createEmbed(client, "Playback Paused", "The current track has been paused.")] });
  },
};

export default command;
