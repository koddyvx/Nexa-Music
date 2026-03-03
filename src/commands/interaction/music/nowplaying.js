const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  SectionBuilder
} = require("discord.js");

function formatTime(ms) {
  if (!ms || ms === 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}

function createProgressBar(current, total, size = 18) {
  const percent = total === 0 ? 0 : current / total;
  const progress = Math.round(size * percent);

  return "▬".repeat(progress) + "●" + "▬".repeat(size - progress);
}

module.exports = {
  name: "nowplaying",
  description: "Shows the currently playing track",
  inVc: true,
  sameVc: true,
  player: true,

  run: async (client, interaction) => {
    const player = client.riffy.players.get(interaction.guildId);

    if (!player || !player.current) {
      const nothingPlaying = new ContainerBuilder()
        .setAccentColor(0xFF0000)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("### Nothing Playing")
        )
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "There is no active track in this server."
          )
        );

      return interaction.reply({
        components: [nothingPlaying],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
      });
    }

    const track = player.current;
    const currentTime = player.position;
    const totalTime = track.info.length;

    const progressBar = createProgressBar(currentTime, totalTime, 18);
    const thumbnaila = track.info.thumbnail || "https://i.imgur.com/AfFp7pu.png";
    const container = new ContainerBuilder()
      .setAccentColor(client.config.color || 0x2B2D31)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("### Now Playing")
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(SeparatorSpacingSize.Small)
      )
      .addSectionComponents(new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `**[${track.info.title}](${track.info.uri})**\n` +
          `by **${track.info.author}**\n\n` +
          `\`${formatTime(currentTime)}\` ${progressBar} \`${formatTime(totalTime)}\`\n\n` +
          `Requested by ${track.info.requester?.username || "Unknown"}`
        )
      ).setThumbnailAccessory(th => th.setDescription('nexa').setURL(thumbnaila)));

   
    return interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};