import { ApplicationCommandOptionType } from "discord.js";
import { getPlayer } from "@/utils/commands";
import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "remove",
  description: "Remove a track from the queue by its position.",
  inVoice: true,
  sameVoice: true,
  player: true,
  options: [
    {
      name: "position",
      description: "The queue position to remove",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      min_value: 1,
    },
  ],

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId)!;
    const position = interaction.options.getInteger("position", true);

    if (position > player.queue.length) {
      await interaction.reply(panelReply({
        ephemeral: true,
        panel: {
          eyebrow: "Queue",
          title: "Position out of range",
          description: `The queue only has ${player.queue.length} track${player.queue.length === 1 ? "" : "s"}.`,
        },
      }));
      return;
    }

    const removed = player.queue.remove(position - 1);
    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Queue",
        title: "Track removed",
        description: `Removed ${removed.info.title} from the queue.`,
      },
    }));
  },
};

export default command;
