/**
 * Project: Nexa Music
 * Author: KoDdy, Razi
 * Organization: Infinity
 *
 * This project is open-source and free to use, modify, and distribute.
 * If you encounter any issues, errors, or have questions,
 * please contact us through the official support server:
 * https://discord.gg/fbu64BmPFD
 */

import { getEnabled247Guilds, set247Enabled } from "@/storage/guildSettings";
import type { NexaClient } from "@/types";
import { log } from "@/utils/logger";

const restoringGuilds = new Set<string>();

export default function registerNodeConnect(client: NexaClient): void {
  client.riffy.on("nodeConnect", async (node) => {
    log("success", "riffy", `Node connected: ${(node as { name?: string }).name ?? "unknown"}`);

    for (const settings of getEnabled247Guilds()) {
      if (restoringGuilds.has(settings.guildId) || client.riffy.players.has(settings.guildId)) {
        continue;
      }

      if (!settings.voiceChannelId || !settings.textChannelId) {
        log("warn", "riffy", `Skipping 24/7 restore for ${settings.guildId}: missing saved channel ids`);
        continue;
      }

      const guild = client.guilds.cache.get(settings.guildId);
      const voiceChannel = guild?.channels.cache.get(settings.voiceChannelId);
      const textChannel = guild?.channels.cache.get(settings.textChannelId);

      if (!guild || !voiceChannel || !textChannel) {
        set247Enabled(settings.guildId, false);
        log("warn", "riffy", `Disabled 24/7 restore for ${settings.guildId}: saved channels are no longer available`);
        continue;
      }

      restoringGuilds.add(settings.guildId);

      try {
        await client.riffy.createConnection({
          guildId: settings.guildId,
          voiceChannel: settings.voiceChannelId,
          textChannel: settings.textChannelId,
          deaf: true,
        });
        log("info", "riffy", `Restored 24/7 voice connection for guild ${settings.guildId}`);
      } catch (error) {
        log("warn", "riffy", `Failed to restore 24/7 voice connection for guild ${settings.guildId}`, error);
      } finally {
        restoringGuilds.delete(settings.guildId);
      }
    }
  });
}
