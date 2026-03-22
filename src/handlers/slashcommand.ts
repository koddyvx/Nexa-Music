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

import { readdirSync } from "node:fs";
import path from "node:path";
import { REST, Routes } from "discord.js";
import type { RESTGetAPIApplicationCommandsResult } from "discord.js";
import type { NexaClient, SlashCommand } from "@/types";
import loadPrefixCommands from "@/handlers/prefixcommand";
import { log } from "@/utils/logger";

async function cleanupOldCommands(rest: REST, clientId: string, validNames: Set<string>): Promise<void> {
  const existing = await rest.get(Routes.applicationCommands(clientId)) as RESTGetAPIApplicationCommandsResult;

  for (const command of existing) {
    if (!validNames.has(command.name)) {
      await rest.delete(Routes.applicationCommand(clientId, command.id));
      log("info", "commands", `Removed stale command ${command.name}`);
    }
  }
}

async function resetCommandsIfRequested(rest: REST, clientId: string): Promise<void> {
  if (process.env.RESET_SLASH_COMMANDS_ON_START !== "true") {
    return;
  }

  await rest.put(Routes.applicationCommands(clientId), { body: [] });
  log("warn", "commands", "Reset all global application commands before registration");
}

export default async function loadSlashCommands(client: NexaClient): Promise<void> {
  const commandsRoot = path.join(__dirname, "../commands/interaction");
  const slashCommands: SlashCommand[] = [];
  let commandCount = 0;

  for (const directory of readdirSync(commandsRoot)) {
    const directoryPath = path.join(commandsRoot, directory);
    const commandFiles = readdirSync(directoryPath).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      try {
        const moduleValue = require(path.join(directoryPath, file)) as SlashCommand | { default: SlashCommand };
        const command: SlashCommand = "default" in moduleValue ? moduleValue.default : moduleValue;

        if (!command.name || !command.description) {
          log("warn", "commands", `Skipping ${file} because it is missing name or description`);
          continue;
        }

        command.category = directory;
        slashCommands.push(command);
        client.slashCommands.set(command.name, command);
        commandCount += 1;
      } catch (error) {
        log("error", "commands", `Failed to load ${file}`, error);
      }
    }
  }

  loadPrefixCommands(client);
  log("success", "commands", `Loaded ${commandCount} slash commands`);

  if (!client.config.clientid) {
    throw new Error("Missing client ID in the bot configuration.");
  }

  const token = process.env.TOKEN;
  if (!token) {
    throw new Error("Missing TOKEN in environment variables.");
  }

  const rest = new REST({ version: "10" }).setToken(token);
  await resetCommandsIfRequested(rest, client.config.clientid);
  await cleanupOldCommands(rest, client.config.clientid, new Set(slashCommands.map((command) => command.name)));
  await rest.put(Routes.applicationCommands(client.config.clientid), { body: slashCommands });
  log("success", "commands", "Registered application commands with Discord");
}
