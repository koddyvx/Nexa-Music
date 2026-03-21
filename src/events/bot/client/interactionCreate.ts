import type { GuildTextBasedChannel } from "discord.js";
import { PermissionsBitField, type GuildMember } from "discord.js";
import { createEmbed } from "@/utils/discord";
import { getPlayer } from "@/utils/commands";
import type { NexaClient } from "@/types";

export default function registerInteractionCreate(client: NexaClient): void {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand() || !interaction.inGuild()) {
      return;
    }

    const command = client.slashCommands.get(interaction.commandName);

    if (!command) {
      await interaction.reply({
        embeds: [createEmbed(client, "Invalid Command", `${interaction.commandName} is not a valid command.`, "Red")],
        ephemeral: true,
      });
      return;
    }

    try {
      const guild = interaction.guild!;
      const member = interaction.member as GuildMember;
      const player = getPlayer(client, interaction.guildId);
      const memberChannelId = member.voice.channelId;
      const clientChannelId = guild.members.me?.voice.channelId ?? null;
      const permissionChannel = interaction.channel as GuildTextBasedChannel | null;

      if (command.developerOnly && !client.config.developers.includes(interaction.user.id)) {
        await interaction.reply({
          embeds: [createEmbed(client, "Developer Only", `${interaction.commandName} is a developer-only command.`, "Red")],
          ephemeral: true,
        });
        return;
      }

      if (command.userPermissions?.length) {
        const permissions = PermissionsBitField.resolve(command.userPermissions);
        if (!permissionChannel?.permissionsFor(member)?.has(permissions)) {
          await interaction.reply({
            embeds: [createEmbed(client, "Missing Permissions", `You need: ${command.userPermissions.join(", ")}`, "Red")],
            ephemeral: true,
          });
          return;
        }
      }

      if (command.clientPermissions?.length) {
        const permissions = PermissionsBitField.resolve(command.clientPermissions);
        const me = guild.members.me;
        if (!me || !permissionChannel?.permissionsFor(me)?.has(permissions)) {
          await interaction.reply({
            embeds: [createEmbed(client, "Missing Bot Permissions", `I need: ${command.clientPermissions.join(", ")}`, "Red")],
            ephemeral: true,
          });
          return;
        }
      }

      if (command.inVoice && !memberChannelId) {
        await interaction.reply({
          embeds: [createEmbed(client, "Voice Channel Required", "You must be in a voice channel to use this command.", "Red")],
          ephemeral: true,
        });
        return;
      }

      if (command.sameVoice && memberChannelId !== clientChannelId) {
        await interaction.reply({
          embeds: [createEmbed(client, "Wrong Voice Channel", "You must be in the same voice channel as the bot.", "Red")],
          ephemeral: true,
        });
        return;
      }

      if (command.player && !player) {
        await interaction.reply({
          embeds: [createEmbed(client, "No Active Player", "No music is currently playing.", "Red")],
          ephemeral: true,
        });
        return;
      }

      if (command.current && !player?.current) {
        await interaction.reply({
          embeds: [createEmbed(client, "Nothing Playing", "I am not playing anything right now.", "Red")],
          ephemeral: true,
        });
        return;
      }

      await command.run(client, interaction);
    } catch (error) {
      console.error("An error occurred while processing a slash command:", error);

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          embeds: [createEmbed(client, "Command Error", `An error occurred: ${String(error)}`, "Red")],
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        embeds: [createEmbed(client, "Command Error", `An error occurred: ${String(error)}`, "Red")],
        ephemeral: true,
      });
    }
  });
}
