import { getPlayer } from "@/utils/commands";
import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "resume",
  description: "Resume the current track.",
  inVoice: true,
  sameVoice: true,
  player: true,
  current: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId)!;

    if (!player.paused) {
      await interaction.reply(panelReply({
        ephemeral: true,
        panel: {
          eyebrow: "Playback",
          title: "Already playing",
          description: "The player is already running.",
        },
      }));
      return;
    }

    await player.pause(false);
    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Playback",
        title: "Playback resumed",
        description: "The current track has resumed.",
      },
    }));
  },
};

export default command;
