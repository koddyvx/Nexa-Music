import type { GuildTextBasedChannel } from "discord.js";
import { PermissionsBitField } from "discord.js";
import { getPrefixCommand, ensureMessageContent } from "@/utils/commands";
import { createEmbed } from "@/utils/discord";
import type { NexaClient } from "@/types";

export default function registerMessageCreate(client: NexaClient): void {
  client.on("messageCreate", async (message) => {
    try {
      const args = ensureMessageContent(message, client.config.prefix);

      if (!args || !message.guild) {
        return;
      }

      const commandName = args.shift()?.toLowerCase();

      if (!commandName) {
        return;
      }

      const command = getPrefixCommand(client, commandName);

      if (!command) {
        return;
      }

      const permissionChannel = message.channel as GuildTextBasedChannel;

      if (command.developerOnly && !client.config.developers.includes(message.author.id)) {
        await message.channel.send({ embeds: [createEmbed(client, "Developer Only", `${command.name} is a developer-only command.`, "Red")] });
        return;
      }

      if (command.userPermissions?.length && message.member) {
        const permissions = PermissionsBitField.resolve(command.userPermissions);
        if (!permissionChannel.permissionsFor(message.member)?.has(permissions)) {
          await message.channel.send({ embeds: [createEmbed(client, "Missing Permissions", `You need: ${command.userPermissions.join(", ")}`, "Red")] });
          return;
        }
      }

      if (command.clientPermissions?.length && message.guild.members.me) {
        const permissions = PermissionsBitField.resolve(command.clientPermissions);
        if (!permissionChannel.permissionsFor(message.guild.members.me)?.has(permissions)) {
          await message.channel.send({ embeds: [createEmbed(client, "Missing Bot Permissions", `I need: ${command.clientPermissions.join(", ")}`, "Red")] });
          return;
        }
      }

      await command.run(client, message, args);
    } catch (error) {
      console.error("An error occurred while executing the messageCreate event:", error);
      await message.channel.send({ embeds: [createEmbed(client, "Message Error", String(error), "Red")] });
    }
  });
}
