import { getPlayer } from "@/utils/commands";
import { panelReply, voiceMention } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "stop",
  description: "Stop playback and disconnect the bot.",
  inVoice: true,
  sameVoice: true,
  player: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId)!;
    const channelId = player.voiceChannel;

    player.queue.clear();
    await player.destroy();

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Playback",
        title: "Playback stopped",
        description: `Playback stopped and the bot left ${voiceMention(channelId)}.`,
      },
    }));
  },
};

export default command;
