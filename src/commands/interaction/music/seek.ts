import { ApplicationCommandOptionType } from "discord.js";
import { getPlayer } from "@/utils/commands";
import { convertHmsToMs } from "@/utils/convert";
import { formatDuration, panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "seek",
  description: "Jump to a specific position in the current track.",
  inVoice: true,
  sameVoice: true,
  player: true,
  current: true,
  options: [
    {
      name: "position",
      description: "A timestamp such as 1:30 or 00:02:10",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId)!;
    const rawPosition = interaction.options.getString("position", true);
    const position = convertHmsToMs(rawPosition);
    const max = player.current!.info.length;

    if (Number.isNaN(position) || position < 0 || position > max) {
      await interaction.reply(panelReply({
        ephemeral: true,
        panel: {
          eyebrow: "Playback",
          title: "Invalid seek position",
          description: `Use a timestamp between 0:00 and ${formatDuration(max)}.`,
        },
      }));
      return;
    }

    player.seek(position);
    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Playback",
        title: "Position updated",
        description: `Moved playback to ${formatDuration(position)}.`,
      },
    }));
  },
};

export default command;
