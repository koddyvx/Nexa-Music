import { getPlayer } from "@/utils/commands";
import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "skip",
  description: "Skip the current track.",
  inVoice: true,
  sameVoice: true,
  player: true,
  current: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId)!;
    const title = player.current!.info.title;

    await player.stop();

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Playback",
        title: "Track skipped",
        description: `Skipped ${title}.`,
      },
    }));
  },
};

export default command;
