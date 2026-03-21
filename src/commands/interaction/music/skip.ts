import { createEmbed } from "@/utils/discord";
import { getPlayer } from "@/utils/commands";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "skip",
  description: "Skips the current track",
  inVoice: true,
  sameVoice: true,
  player: true,
  current: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId);

    if (!player?.current) {
      await interaction.reply({ embeds: [createEmbed(client, "Nothing Playing", "There is no active track to skip.", "Red")], ephemeral: true });
      return;
    }

    const skippedTrack = player.current.info.title;
    await player.stop();

    await interaction.reply({
      embeds: [createEmbed(client, "Track Skipped", `Skipped **${skippedTrack}** and moved to the next track.`)],
    });
  },
};

export default command;
