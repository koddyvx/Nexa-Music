import { ActivityType, Events } from "discord.js";
import type { NexaClient } from "@/types";
import { log } from "@/utils/logger";
import { postTopggStats } from "@/utils/topgg";

export default function registerReady(client: NexaClient): void {
  client.on(Events.ClientReady, async (readyClient) => {
    client.riffy.init(readyClient.user.id);
    readyClient.user.setPresence({
      activities: [{ name: "Nexa Music | /help", type: ActivityType.Listening }],
      status: "online",
    });
    await postTopggStats(client);
    log("success", "client", `Logged in as ${readyClient.user.tag}`);
  });
}
