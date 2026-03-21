import type { NexaClient } from "@/types";

export default function registerNodeError(client: NexaClient): void {
  client.riffy.on("nodeError", (node, error) => {
    const nodeName = (node as { name?: string }).name ?? "unknown";
    const message = error instanceof Error ? error.message : String(error);
    console.log(`[RIFFY] Node error on ${nodeName}: ${message}`);
  });
}
