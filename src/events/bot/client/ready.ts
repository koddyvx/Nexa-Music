import { Events } from "discord.js";
import type { NexaClient } from "@/types";
import { log } from "@/utils/logger";

export default function registerReady(client: NexaClient): void {
  client.on(Events.ClientReady, (readyClient) => {
    client.riffy.init(readyClient.user.id);
    log("success", "client", `Logged in as ${readyClient.user.tag}`);
  });
}
