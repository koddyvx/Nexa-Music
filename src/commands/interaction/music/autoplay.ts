import { createEmbed } from "@/utils/discord";
import { getPlayer } from "@/utils/commands";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "autoplay",
  description: "Toggle autoplay for the current music player.",
  inVoice: true,
  sameVoice: true,
  player: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId);

    if (!player) {
      await interaction.reply({
        embeds: [createEmbed(client, "Music Player Not Found", "There is no active music player for this server.", "Red")],
        ephemeral: true,
      });
      return;
    }

    player.isAutoplay = !player.isAutoplay;

    await interaction.reply({
      embeds: [createEmbed(client, "Autoplay Updated", `Autoplay is now ${player.isAutoplay ? "enabled" : "disabled"}.`)],
      ephemeral: true,
    });
  },
};

export default command;
