import type { NexaClient } from "@/types";
import { log } from "@/utils/logger";

export default function registerNodeReconnect(client: NexaClient): void {
  client.riffy.on("nodeReconnect", (node) => {
    const identifier = (node as { options?: { identifier?: string } }).options?.identifier ?? "unknown";
    log("info", "riffy", `Node reconnecting: ${identifier}`);
  });
}
