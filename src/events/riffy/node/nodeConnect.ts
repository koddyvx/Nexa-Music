import type { NexaClient } from "@/types";

export default function registerNodeConnect(client: NexaClient): void {
  client.riffy.on("nodeConnect", (node) => {
    const nodeName = (node as { name?: string }).name ?? "unknown";
    console.log(`[RIFFY] Node connected: ${nodeName}`);
  });
}
