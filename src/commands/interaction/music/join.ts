import { ApplicationCommandType } from "discord.js";
import { createEmbed } from "@/utils/discord";
import { getPlayer } from "@/utils/commands";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "join",
  description: "Join your current voice channel",
  type: ApplicationCommandType.ChatInput,

  async run(client, interaction) {
    if (!interaction.inGuild()) {
      await interaction.reply({ embeds: [createEmbed(client, "Guild Only", "This command can only be used in a server.", "Red")], ephemeral: true });
      return;
    }

    const member = interaction.member;
    const voiceChannel = member && "voice" in member ? member.voice.channel : null;

    if (!voiceChannel) {
      await interaction.reply({
        embeds: [createEmbed(client, "Join a Voice Channel", "You must be in a voice channel to use this command.", "Red")],
        ephemeral: true,
      });
      return;
    }

    try {
      const existingPlayer = getPlayer(client, interaction.guildId);

      if (existingPlayer) {
        await interaction.reply({
          embeds: [createEmbed(client, "Already Connected", `I'm already connected to <#${existingPlayer.voiceChannel}>.`, "Yellow")],
          ephemeral: true,
        });
        return;
      }

      await client.riffy.createConnection({
        guildId: interaction.guildId,
        voiceChannel: voiceChannel.id,
        textChannel: interaction.channelId,
        deaf: true,
      });

      await interaction.reply({
        embeds: [createEmbed(client, "Connected", `Successfully joined <#${voiceChannel.id}>.`, "Green")],
      });
    } catch (error) {
      console.error("Join Error:", error);
      await interaction.reply({
        embeds: [createEmbed(client, "Connection Failed", "Failed to connect to the voice channel. Please try again.", "Red")],
        ephemeral: true,
      });
    }
  },
};

export default command;
