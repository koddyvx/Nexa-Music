import { createEmbed, formatDuration, progressBar } from "@/utils/discord";
import { getPlayer } from "@/utils/commands";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "nowplaying",
  description: "Shows the currently playing track",
  inVoice: true,
  sameVoice: true,
  player: true,
  current: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId);

    if (!player?.current) {
      await interaction.reply({
        embeds: [createEmbed(client, "Nothing Playing", "There is no active track in this server.", "Red")],
        ephemeral: true,
      });
      return;
    }

    const track = player.current;
    const currentTime = player.position;
    const totalTime = track.info.length;
    const embed = createEmbed(
      client,
      "Now Playing",
      [
        `**[${track.info.title}](${track.info.uri})**`,
        `by **${track.info.author}**`,
        "",
        `\`${formatDuration(currentTime)}\` ${progressBar(currentTime, totalTime)} \`${formatDuration(totalTime)}\``,
        `Requested by ${track.info.requester?.user.username ?? "Unknown"}`,
      ].join("\n"),
    );

    if (track.info.thumbnail) {
      embed.setThumbnail(track.info.thumbnail);
    }

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
