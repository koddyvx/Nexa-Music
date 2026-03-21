import { ActivityType, Events } from "discord.js";
import type { NexaClient } from "@/types";

export default function registerReady(client: NexaClient): void {
  client.on(Events.ClientReady, (readyClient) => {
    client.riffy.init(readyClient.user.id);
    console.log(`[INFO] Logged in as ${readyClient.user.tag}`);

    readyClient.user.setPresence({
      activities: [
        {
          name: "Nexa Music | /help",
          type: ActivityType.Playing,
        },
      ],
      status: "idle",
    });
  });
}
