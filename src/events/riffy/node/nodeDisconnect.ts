import type { NexaClient } from "@/types";

export default function registerNodeDisconnect(client: NexaClient): void {
  client.riffy.on("nodeDisconnect", (node, reason) => {
    const identifier = (node as { options?: { identifier?: string } }).options?.identifier ?? "unknown";
    console.log(`[RIFFY] Node "${identifier}" disconnected`, reason);
  });
}
