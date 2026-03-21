import { readdirSync } from "node:fs";
import path from "node:path";
import type { BotEventHandler, NexaClient } from "@/types";
import { log } from "@/utils/logger";

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
          log("warn", "events", `${file} does not export a function`);
          continue;
        }

        await handler(client);
        eventCount += 1;
      } catch (error) {
        log("error", "events", `Failed to load ${file}`, error);
      }
    }
  }

  log("success", "events", `Loaded ${eventCount} Discord events`);
}
