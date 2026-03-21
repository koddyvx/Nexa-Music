import type { NexaClient } from "@/types";

export default function registerNodeReconnect(client: NexaClient): void {
  client.riffy.on("nodeReconnect", (node) => {
    const identifier = (node as { options?: { identifier?: string } }).options?.identifier ?? "unknown";
    console.log(`[RIFFY] Node "${identifier}" reconnecting`);
  });
}
