import { getPlayer } from "@/utils/commands";
import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "pause",
  description: "Pause the current track.",
  inVoice: true,
  sameVoice: true,
  player: true,
  current: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId)!;

    if (player.paused) {
      await interaction.reply(panelReply({
        ephemeral: true,
        panel: {
          eyebrow: "Playback",
          title: "Already paused",
          description: "The current track is already paused.",
        },
      }));
      return;
    }

    await player.pause(true);
    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Playback",
        title: "Playback paused",
        description: "The current track has been paused.",
      },
    }));
  },
};

export default command;
