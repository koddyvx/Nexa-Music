import { PermissionFlagsBits, type GuildMember, type Message } from "discord.js";
import type { ExtendedPlayer, NexaClient, PrefixCommand, SlashCommand } from "@/types";

export function getPrefixCommand(client: NexaClient, input: string): PrefixCommand | undefined {
  const direct = client.commands.get(input);

  if (direct) {
    return direct;
  }

  const alias = client.aliases.get(input);
  return alias ? client.commands.get(alias) : undefined;
}

export function getPlayer(client: NexaClient, guildId: string | null): ExtendedPlayer | undefined {
  if (!guildId) {
    return undefined;
  }

  return client.riffy.players.get(guildId) as ExtendedPlayer | undefined;
}

export function hasVoiceFlags(command: SlashCommand): { inVoice: boolean; sameVoice: boolean } {
  return {
    inVoice: command.inVoice ?? false,
    sameVoice: command.sameVoice ?? false,
  };
}

export function hasRequiredPermissions(member: GuildMember, required: bigint[]): boolean {
  return required.length === 0 || member.permissions.has(required);
}

export const DEFAULT_USER_PERMISSIONS = [PermissionFlagsBits.ViewChannel];

export function commandDisplay(name: string): string {
  return `/${name}`;
}

export function ensureMessageContent(message: Message, prefix: string): string[] | null {
  if (message.author.bot || !message.guild || !message.content.startsWith(prefix)) {
    return null;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/g).filter(Boolean);
  return args.length > 0 ? args : null;
}
