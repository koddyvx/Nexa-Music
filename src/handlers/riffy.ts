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
import type { BotEventHandler, NexaClient } from "@/types";
import { log } from "@/utils/logger";

export default async function loadRiffyEvents(client: NexaClient): Promise<void> {
  let eventCount = 0;
  const basePath = path.join(__dirname, "../events/riffy");

  for (const directory of readdirSync(basePath)) {
    const directoryPath = path.join(basePath, directory);
    const eventFiles = readdirSync(directoryPath).filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      try {
        const imported = require(path.join(directoryPath, file)) as { default?: BotEventHandler } | BotEventHandler;
        const handler = typeof imported === "function" ? imported : imported.default;

        if (typeof handler !== "function") {
          log("warn", "riffy", `${file} does not export a function`);
          continue;
        }

        await handler(client);
        eventCount += 1;
      } catch (error) {
        log("error", "riffy", `Failed to load ${file}`, error);
      }
    }
  }

  log("success", "riffy", `Loaded ${eventCount} Riffy events`);
}
