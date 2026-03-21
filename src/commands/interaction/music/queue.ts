import prettyMs from "pretty-ms";
import { createEmbed } from "@/utils/discord";
import { getPlayer } from "@/utils/commands";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "queue",
  description: "Shows the current queue",
  inVoice: true,
  sameVoice: true,
  player: true,
  current: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId);

    if (!player?.current) {
      await interaction.reply({
        embeds: [createEmbed(client, "Nothing Playing", "There is no active player in this server.", "Red")],
        ephemeral: true,
      });
      return;
    }

    const queue = player.queue.length > 9 ? player.queue.slice(0, 9) : player.queue;
    const upNext =
      queue.length > 0
        ? queue.map((track, index) => `${index + 1}. [${track.info.title}](${track.info.uri})`).join("\n")
        : "No upcoming tracks in the queue.";

    const embed = createEmbed(
      client,
      "Queue",
      [
        `Now playing: **[${player.current.info.title}](${player.current.info.uri})**`,
        `Duration: ${prettyMs(player.current.info.length)}`,
        `Queue length: ${player.queue.length} tracks`,
        "",
        "Up next:",
        upNext,
      ].join("\n"),
    );

    if (player.current.info.thumbnail) {
      embed.setThumbnail(player.current.info.thumbnail);
    }

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
