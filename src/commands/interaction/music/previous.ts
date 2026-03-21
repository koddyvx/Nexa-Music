import { getPlayer } from "@/utils/commands";
import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "previous",
  description: "Replay the previous track if one exists.",
  inVoice: true,
  sameVoice: true,
  player: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId)!;
    const previous = player.previous;

    if (!previous) {
      await interaction.reply(panelReply({
        ephemeral: true,
        panel: {
          eyebrow: "Playback",
          title: "No previous track",
          description: "There is no previous track stored for this player.",
        },
      }));
      return;
    }

    player.queue.unshift(player.current ?? previous);
    player.queue.unshift(previous);
    await player.stop();

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Playback",
        title: "Replaying previous track",
        description: `Queued ${previous.info.title} to play again.`,
      },
    }));
  },
};

export default command;
