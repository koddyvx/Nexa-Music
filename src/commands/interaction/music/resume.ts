import { createEmbed } from "@/utils/discord";
import { getPlayer } from "@/utils/commands";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "resume",
  description: "Resumes the current track",
  inVoice: true,
  sameVoice: true,
  player: true,
  current: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId);

    if (!player?.current) {
      await interaction.reply({ embeds: [createEmbed(client, "Nothing Playing", "There is no active track to resume.", "Red")], ephemeral: true });
      return;
    }

    if (!player.paused) {
      await interaction.reply({ embeds: [createEmbed(client, "Already Playing", "The player is already playing.", "Yellow")], ephemeral: true });
      return;
    }

    await player.pause(false);
    await interaction.reply({ embeds: [createEmbed(client, "Playback Resumed", "The current track has been resumed.")] });
  },
};

export default command;
