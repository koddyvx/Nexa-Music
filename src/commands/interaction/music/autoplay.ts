import { getPlayer } from "@/utils/commands";
import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "autoplay",
  description: "Turn autoplay on or off for the current player.",
  inVoice: true,
  sameVoice: true,
  player: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId);

    if (!player) {
      await interaction.reply(panelReply({
        ephemeral: true,
        panel: {
          eyebrow: "Playback",
          title: "No active player",
          description: "Start playback before changing autoplay.",
        },
      }));
      return;
    }

    player.isAutoplay = !player.isAutoplay;

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Playback",
        title: "Autoplay updated",
        description: `Autoplay is now ${player.isAutoplay ? "enabled" : "disabled"}.`,
      },
      ephemeral: true,
    }));
  },
};

export default command;
