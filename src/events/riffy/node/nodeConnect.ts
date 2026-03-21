import type { NexaClient } from "@/types";
import { log } from "@/utils/logger";

export default function registerNodeConnect(client: NexaClient): void {
  client.riffy.on("nodeConnect", (node) => {
    log("success", "riffy", `Node connected: ${(node as { name?: string }).name ?? "unknown"}`);
  });
}
