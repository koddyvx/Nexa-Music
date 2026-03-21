import type { NexaClient } from "@/types";
import { log } from "@/utils/logger";

export default function registerNodeDisconnect(client: NexaClient): void {
  client.riffy.on("nodeDisconnect", (node, reason) => {
    const identifier = (node as { options?: { identifier?: string } }).options?.identifier ?? "unknown";
    log("warn", "riffy", `Node disconnected: ${identifier}`, reason);
  });
}
