import { PermissionsBitField, type GuildTextBasedChannel, type GuildMember } from "discord.js";
import { getPlayer } from "@/utils/commands";
import { panelReply } from "@/utils/discord";
import { hasTopggVote } from "@/utils/topgg";
import type { NexaClient } from "@/types";

export default function registerInteractionCreate(client: NexaClient): void {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.inGuild()) {
      return;
    }

    if (interaction.isButton() && interaction.customId.startsWith("player_")) {
      const member = interaction.member as GuildMember;
      const guild = interaction.guild!;
      const player = getPlayer(client, interaction.guildId);

      if (!player) {
        await interaction.reply(panelReply({
          ephemeral: true,
          panel: {
            eyebrow: "Playback",
            title: "No active player",
            description: "There is no active player in this server.",
          },
        }));
        return;
      }

      const memberChannelId = member.voice.channelId;
      const botChannelId = guild.members.me?.voice.channelId ?? null;

      if (!memberChannelId || (botChannelId && memberChannelId !== botChannelId)) {
        await interaction.reply(panelReply({
          ephemeral: true,
          panel: {
            eyebrow: "Voice required",
            title: "Wrong voice channel",
            description: "You must be in the same voice channel as the bot to use player controls.",
          },
        }));
        return;
      }

      if (interaction.customId === "player_toggle_pause") {
        await player.pause(!player.paused);
        await interaction.reply(panelReply({
          ephemeral: true,
          panel: {
            eyebrow: "Playback",
            title: player.paused ? "Playback paused" : "Playback resumed",
            description: player.paused ? "The current track is paused." : "The current track resumed.",
          },
        }));
        return;
      }

      if (interaction.customId === "player_skip") {
        const skippedTitle = player.current?.info.title ?? "current track";
        await player.stop();
        await interaction.reply(panelReply({
          ephemeral: true,
          panel: {
            eyebrow: "Playback",
            title: "Track skipped",
            description: `Skipped ${skippedTitle}.`,
          },
        }));
        return;
      }

      if (interaction.customId === "player_stop") {
        player.queue.clear();
        await player.destroy();
        await interaction.reply(panelReply({
          ephemeral: true,
          panel: {
            eyebrow: "Playback",
            title: "Playback stopped",
            description: "Stopped playback, cleared the queue, and disconnected from voice.",
          },
        }));
        return;
      }

      if (interaction.customId === "player_queue") {
        const lines = player.queue.length > 0
          ? player.queue.slice(0, 10).map((track, index) => `${index + 1}. ${track.info.title} - ${track.info.author}`)
          : ["No tracks are waiting in the queue."];

        await interaction.reply(panelReply({
          ephemeral: true,
          panel: {
            eyebrow: "Queue",
            title: "Current Queue",
            lines: [`Now playing: ${player.current?.info.title ?? "Nothing"}`, `Queue size: ${player.queue.length}`, ...lines],
          },
        }));
      }

      return;
    }

    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) {
      await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Request rejected", title: "Unknown command", description: `The command ${interaction.commandName} is not available in this build.` } }));
      return;
    }

    try {
      const guild = interaction.guild!;
      const member = interaction.member as GuildMember;
      const player = getPlayer(client, interaction.guildId);
      const memberChannelId = member.voice.channelId;
      const botChannelId = guild.members.me?.voice.channelId ?? null;
      const permissionChannel = interaction.channel as GuildTextBasedChannel | null;

      if (command.developerOnly && !client.config.developers.includes(interaction.user.id)) {
        await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Restricted", title: "Developer only", description: `/${interaction.commandName} is reserved for bot developers.` } }));
        return;
      }

      if (command.voteOnly) {
        const voted = await hasTopggVote(client, interaction.user.id);
        if (!voted) {
          await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Vote required", title: "Top.gg vote required", description: "Vote for the bot on Top.gg to unlock this command." } }));
          return;
        }
      }

      if (command.userPermissions?.length) {
        const permissions = PermissionsBitField.resolve(command.userPermissions);
        if (!permissionChannel?.permissionsFor(member)?.has(permissions)) {
          await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Permissions", title: "Missing permissions", description: `You need these permissions: ${command.userPermissions.join(", ")}.` } }));
          return;
        }
      }

      if (command.clientPermissions?.length) {
        const permissions = PermissionsBitField.resolve(command.clientPermissions);
        const me = guild.members.me;
        if (!me || !permissionChannel?.permissionsFor(me)?.has(permissions)) {
          await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Permissions", title: "Bot permissions missing", description: `I need these permissions: ${command.clientPermissions.join(", ")}.` } }));
          return;
        }
      }

      if (command.category === "music") {
        const me = guild.members.me;
        const voicePermissions = member.voice.channel && me ? member.voice.channel.permissionsFor(me) : null;
        const textPermissions = permissionChannel && me ? permissionChannel.permissionsFor(me) : null;
        const missingVoice = !voicePermissions?.has([
          PermissionsBitField.Flags.Connect,
          PermissionsBitField.Flags.Speak,
          PermissionsBitField.Flags.ViewChannel,
        ]);
        const missingText = !textPermissions?.has([
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.EmbedLinks,
        ]);

        if (missingVoice || missingText) {
          await interaction.reply(panelReply({
            ephemeral: true,
            panel: {
              eyebrow: "Permissions",
              title: "Missing music permissions",
              description: "I need ViewChannel, SendMessages, EmbedLinks, Connect, and Speak permissions to run music commands.",
            },
          }));
          return;
        }
      }

      if (command.inVoice && !memberChannelId) {
        await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Voice required", title: "Join a voice channel", description: "You must be in a voice channel before using this command." } }));
        return;
      }

      if (command.sameVoice && botChannelId && memberChannelId !== botChannelId) {
        await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Voice required", title: "Wrong voice channel", description: "You must join the same voice channel as the bot." } }));
        return;
      }

      if (command.player && !player) {
        await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Playback", title: "No active player", description: "There is no active player in this server." } }));
        return;
      }

      if (command.current && !player?.current) {
        await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Playback", title: "Nothing is playing", description: "Start playback before using this command." } }));
        return;
      }

      await command.run(client, interaction);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp(panelReply({ ephemeral: true, panel: { eyebrow: "Runtime error", title: "Command failed", description: message } }));
        return;
      }

      await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Runtime error", title: "Command failed", description: message } }));
    }
  });
}
