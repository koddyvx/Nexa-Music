import { readdirSync } from "node:fs";
import path from "node:path";
import type { BotEventHandler, NexaClient } from "@/types";

export default async function loadEvents(client: NexaClient): Promise<void> {
  let eventCount = 0;
  const basePath = path.join(__dirname, "../events/bot");

  for (const directory of readdirSync(basePath)) {
    const directoryPath = path.join(basePath, directory);
    const eventFiles = readdirSync(directoryPath).filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      try {
        const imported = require(path.join(directoryPath, file)) as { default?: BotEventHandler } | BotEventHandler;
        const handler = typeof imported === "function" ? imported : imported.default;

        if (typeof handler !== "function") {
          console.log(`[WARNING] Event ${file} does not export a function.`);
          continue;
        }

        await handler(client);
        eventCount += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(`[ERROR] Couldn't load the event ${file}, error: ${message}`);
      }
    }
  }

  console.log(`[EVENTS] Successfully loaded ${eventCount} events.`);
}
