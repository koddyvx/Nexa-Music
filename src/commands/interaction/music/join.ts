/**
 * Project: Nexa Music
 * Author: KoDdy, Razi
 * Organization: Infinity
 *
 * This project is open-source and free to use, modify, and distribute.
 * If you encounter any issues, errors, or have questions,
 * please contact us through the official support server:
 * https://discord.gg/fbu64BmPFD
 */

import { ApplicationCommandType, type GuildMember } from "discord.js";
import { panelReply, voiceMention } from "@/utils/discord";
import { ensurePlayerConnection, getPlayer } from "@/utils/commands";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "join",
  description: "Connect the bot to your current voice channel.",
  type: ApplicationCommandType.ChatInput,

  async run(client, interaction) {
    if (!interaction.inGuild()) {
      await interaction.reply(panelReply({
        ephemeral: true,
        panel: {
          eyebrow: "Voice required",
          title: "Server only",
          description: "This command can only be used in a server.",
        },
      }));
      return;
    }

    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply(panelReply({
        ephemeral: true,
        panel: {
          eyebrow: "Voice required",
          title: "Join a voice channel",
          description: "You must join a voice channel before using this command.",
        },
      }));
      return;
    }

    const existingPlayer = getPlayer(client, interaction.guildId);
    const botChannelId = interaction.guild!.members.me?.voice.channelId ?? null;

    if (existingPlayer && existingPlayer.connected && botChannelId === voiceChannel.id) {
      await interaction.reply(panelReply({
        ephemeral: true,
        panel: {
          eyebrow: "Voice state",
          title: "Already connected",
          description: `I am already connected to ${voiceMention(existingPlayer.voiceChannel)}.`,
        },
      }));
      return;
    }

    await ensurePlayerConnection(client, interaction.guildId, voiceChannel.id, interaction.channelId);

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Voice state",
        title: "Connected",
        description: `Joined ${voiceMention(voiceChannel.id)} successfully.`,
      },
    }));
  },
};

export default command;
