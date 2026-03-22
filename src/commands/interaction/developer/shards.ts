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

import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "shards",
  description: "Show shard information.",
  developerOnly: true,

  async run(client, interaction) {
    const shardId = client.shard?.ids.join(", ") ?? "0";
    const shardCount = client.shard?.count ?? 1;

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Developer",
        title: "Shard status",
        lines: [
          `Current shard ids: ${shardId}`,
          `Total shards: ${shardCount}`,
          `Guilds on this shard: ${client.guilds.cache.size}`,
          `Users cached on this shard: ${client.users.cache.size}`,
        ],
      },
    }));
  },
};

export default command;
