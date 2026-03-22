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

import { ApplicationCommandOptionType, type GuildMember } from "discord.js";
import { set247Enabled, is247Enabled } from "@/storage/guildSettings";
import { getPlayer } from "@/utils/commands";
import { panelReply, voiceMention } from "@/utils/discord";
import type { ExtendedPlayer, SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "247",
  description: "Enable or disable 24/7 mode in this server.",
  options: [
    {
      name: "mode",
      description: "Select on, off, or status",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "On", value: "on" },
        { name: "Off", value: "off" },
        { name: "Status", value: "status" },
      ],
    },
  ],

  async run(client, interaction) {
    if (!interaction.inGuild()) {
      await interaction.reply(panelReply({
        ephemeral: true,
        panel: {
          eyebrow: "Nexa Music",
          title: "Server only",
          description: "This command can only be used in a server.",
        },
      }));
      return;
    }

    const mode = interaction.options.getString("mode", true);
    const guildId = interaction.guildId;
    const enabled = is247Enabled(guildId);

    if (mode === "status") {
      await interaction.reply(panelReply({
        panel: {
          eyebrow: "Nexa Music",
          title: "24/7 Status",
          description: `24/7 mode is currently ${enabled ? "enabled" : "disabled"} in this server.`,
        },
      }));
      return;
    }

    if (mode === "off") {
      set247Enabled(guildId, false);
      await interaction.reply(panelReply({
        panel: {
          eyebrow: "Nexa Music",
          title: "24/7 Disabled",
          description: "The bot will now follow normal auto-leave behavior.",
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
          eyebrow: "Nexa Music",
          title: "Join a voice channel",
          description: "You must join a voice channel before enabling 24/7 mode.",
        },
      }));
      return;
    }

    set247Enabled(guildId, true, voiceChannel.id, interaction.channelId);

    let player = getPlayer(client, guildId);
    if (!player) {
      player = (await client.riffy.createConnection({
        guildId,
        voiceChannel: voiceChannel.id,
        textChannel: interaction.channelId,
        deaf: true,
      })) as ExtendedPlayer;
    } else {
      set247Enabled(guildId, true, player.voiceChannel, player.textChannel);
    }

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Nexa Music",
        title: "24/7 Enabled",
        lines: [
          "I will stay connected and auto-reconnect if disconnected.",
          `Voice channel: ${voiceMention(player.voiceChannel)}`,
        ],
      },
    }));
  },
};

export default command;
