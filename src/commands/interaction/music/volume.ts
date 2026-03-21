import { ApplicationCommandOptionType } from "discord.js";
import { createEmbed } from "@/utils/discord";
import { getPlayer } from "@/utils/commands";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "volume",
  description: "Set the volume of the player.",
  inVoice: true,
  sameVoice: true,
  player: true,
  current: true,
  options: [
    {
      name: "volume",
      description: "The volume you want to set",
      type: ApplicationCommandOptionType.Number,
      required: true,
      min_value: 0,
      max_value: 100,
    },
  ],

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId);

    if (!player?.current) {
      await interaction.reply({
        embeds: [createEmbed(client, "Nothing Playing", "There is no active track to adjust the volume.", "Red")],
        ephemeral: true,
      });
      return;
    }

    if (interaction.user.id !== player.current.info.requester?.id) {
      await interaction.reply({
        embeds: [createEmbed(client, "Not Allowed", "Only the requester of the current song can change the volume.", "Red")],
        ephemeral: true,
      });
      return;
    }

    const volume = interaction.options.getNumber("volume", true);
    await player.setVolume(volume);

    await interaction.reply({
      embeds: [createEmbed(client, "Volume Updated", `Volume has been set to **${volume}%**.`)],
    });
  },
};

export default command;
