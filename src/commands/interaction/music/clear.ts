import { getPlayer } from "@/utils/commands";
import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "clear",
  description: "Clear every track waiting in the queue.",
  inVoice: true,
  sameVoice: true,
  player: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId)!;
    const removed = player.queue.length;
    player.queue.clear();

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Queue",
        title: "Queue cleared",
        description: removed === 0 ? "The queue was already empty." : `Removed ${removed} queued track${removed === 1 ? "" : "s"}.`,
      },
    }));
  },
};

export default command;
