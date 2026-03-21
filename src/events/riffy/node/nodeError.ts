import type { NexaClient } from "@/types";
import { log } from "@/utils/logger";

export default function registerNodeError(client: NexaClient): void {
  client.riffy.on("nodeError", (node, error) => {
    log("error", "riffy", `Node error: ${(node as { name?: string }).name ?? "unknown"}`, error);
  });
}
