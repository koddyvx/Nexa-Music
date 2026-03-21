import { createEmbed } from "@/utils/discord";
import { getPlayer } from "@/utils/commands";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "stop",
  description: "Stop the music and disconnect the bot",
  inVoice: true,
  sameVoice: true,
  player: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId);

    if (!player) {
      await interaction.reply({
        embeds: [createEmbed(client, "No Active Player", "There is no active music session in this server.", "Red")],
        ephemeral: true,
      });
      return;
    }

    const voiceChannelId = player.voiceChannel;
    await player.destroy();

    await interaction.reply({
      embeds: [createEmbed(client, "Playback Stopped", `Music playback has been stopped and disconnected from <#${voiceChannelId}>.`)],
    });
  },
};

export default command;
