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

import type { NexaClient } from "@/types";
import { log } from "@/utils/logger";

export default function registerNodeError(client: NexaClient): void {
  client.riffy.on("nodeError", (node, error) => {
    log("error", "riffy", `Node error: ${(node as { name?: string }).name ?? "unknown"}`, error);
  });
}
