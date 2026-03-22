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

import { createPrefixAdapter } from "@/utils/prefixAdapter";
import type { NexaClient, SlashCommand } from "@/types";
import { log } from "@/utils/logger";

export default function loadPrefixCommands(client: NexaClient, commandList: SlashCommand[]): void {
  client.commands.clear();
  client.aliases.clear();

  for (const slashCommand of commandList) {
    if (slashCommand.prefixcmd === false) {
      continue;
    }

    const prefixCommand = createPrefixAdapter(slashCommand);
    client.commands.set(prefixCommand.name, prefixCommand);

    for (const alias of prefixCommand.aliases ?? []) {
      client.aliases.set(alias, prefixCommand.name);
    }
  }

  log("success", "prefix", `Loaded ${client.commands.size} prefix command adapters`);
}
