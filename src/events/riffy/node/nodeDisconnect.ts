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

export default function registerNodeDisconnect(client: NexaClient): void {
  client.riffy.on("nodeDisconnect", (node, reason) => {
    const identifier = (node as { options?: { identifier?: string } }).options?.identifier ?? "unknown";
    log("warn", "riffy", `Node disconnected: ${identifier}`, reason);
  });
}
