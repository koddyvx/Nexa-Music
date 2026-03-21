import { createPrefixAdapter } from "@/utils/prefixAdapter";
import type { NexaClient } from "@/types";
import { log } from "@/utils/logger";

export default function loadPrefixCommands(client: NexaClient): void {
  client.commands.clear();
  client.aliases.clear();

  for (const slashCommand of client.slashCommands.values()) {
    const prefixCommand = createPrefixAdapter(slashCommand);
    client.commands.set(prefixCommand.name, prefixCommand);

    for (const alias of prefixCommand.aliases ?? []) {
      client.aliases.set(alias, prefixCommand.name);
    }
  }

  log("success", "prefix", `Loaded ${client.commands.size} prefix command adapters`);
}
