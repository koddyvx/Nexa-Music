import type { GuildTextBasedChannel } from "discord.js";
import { PermissionsBitField } from "discord.js";
import { ensureMessageContent, getPrefixCommand } from "@/utils/commands";
import { panelMessage } from "@/utils/discord";
import { hasTopggVote } from "@/utils/topgg";
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
        await message.channel.send(panelMessage({ panel: { eyebrow: "Restricted", title: "Developer only", description: `${command.name} is reserved for developers.` } }));
        return;
      }

      if (command.voteOnly) {
        const voted = await hasTopggVote(client, message.author.id);
        if (!voted) {
          await message.channel.send(panelMessage({ panel: { eyebrow: "Vote required", title: "Top.gg vote required", description: "Vote for the bot on Top.gg to unlock this command." } }));
          return;
        }
      }

      if (command.userPermissions?.length && message.member) {
        const permissions = PermissionsBitField.resolve(command.userPermissions);
        if (!permissionChannel.permissionsFor(message.member)?.has(permissions)) {
          await message.channel.send(panelMessage({ panel: { eyebrow: "Permissions", title: "Missing permissions", description: `You need these permissions: ${command.userPermissions.join(", ")}.` } }));
          return;
        }
      }

      if (command.clientPermissions?.length && message.guild.members.me) {
        const permissions = PermissionsBitField.resolve(command.clientPermissions);
        if (!permissionChannel.permissionsFor(message.guild.members.me)?.has(permissions)) {
          await message.channel.send(panelMessage({ panel: { eyebrow: "Permissions", title: "Bot permissions missing", description: `I need these permissions: ${command.clientPermissions.join(", ")}.` } }));
          return;
        }
      }

      await command.run(client, message, args);
    } catch (error) {
      const messageText = error instanceof Error ? error.message : String(error);
      await message.channel.send(panelMessage({ panel: { eyebrow: "Runtime error", title: "Message command failed", description: messageText } }));
    }
  });
}
