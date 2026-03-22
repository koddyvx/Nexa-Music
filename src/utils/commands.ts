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

import type { Message } from "discord.js";
import type { ExtendedPlayer, NexaClient, PrefixCommand } from "@/types";

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

export function ensureMessageContent(message: Message, prefix: string): string[] | null {
  if (message.author.bot || !message.guild || !message.content.startsWith(prefix)) {
    return null;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/g).filter(Boolean);
  return args.length > 0 ? args : null;
}
