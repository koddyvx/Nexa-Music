import { readdirSync } from "node:fs";
import path from "node:path";
import { REST, Routes } from "discord.js";
import type { NexaClient, SlashCommand } from "@/types";

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
          console.log(`Missing a name or description in ${file} slash command.`);
          continue;
        }

        command.category = directory;
        slashCommands.push(command);
        client.slashCommands.set(command.name, command);
        commandCount += 1;
      } catch (error) {
        console.log(`Couldn't load the slash command ${file}, error: ${String(error)}`);
      }
    }
  }

  console.log(`[CMD] Total slash commands loaded: ${commandCount}`);

  if (!client.config.clientid) {
    throw new Error("Couldn't find the client ID in the config file.");
  }

  const token = process.env.TOKEN;

  if (!token) {
    throw new Error("Missing TOKEN in environment variables.");
  }

  const rest = new REST({ version: "10" }).setToken(token);

  try {
    await rest.put(Routes.applicationCommands(client.config.clientid), {
      body: slashCommands,
    });
    console.log("[CMD] Successfully registered application commands.");
  } catch (error) {
    console.log("Couldn't register application commands.");
    console.log(error);
  }
}
