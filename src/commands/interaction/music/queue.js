const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "queue",
  description: "Shows the current queue",
  inVoice: true,
  sameVoice: true,
  player: true,

  run: async (client, interaction) => {
    const player = client.riffy.players.get(interaction.guild.id);

    if (!player || !player.current) {
      const noPlayer = new ContainerBuilder()
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
            "There is no active player in this server."
          )
        );

      return interaction.reply({
        components: [noPlayer],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
      });
    }

    const queue = player.queue.length > 9
      ? player.queue.slice(0, 9)
      : player.queue;

    const nowPlayingText =
      `**[${player.current.info.title}](${player.current.info.uri})**\n` +
      `Duration: ${ms(player.current.info.length)}\n\n` +
      `Queue Length: ${player.queue.length} tracks`;

    let upNextText = "";

    if (queue.length) {
      upNextText = queue
        .map(
          (track, index) =>
            `${index + 1}. [${track.info.title}](${track.info.uri})`
        )
        .join("\n");
    } else {
      upNextText = "No upcoming tracks in the queue.";
    }

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
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(nowPlayingText)
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("### Up Next")
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(upNextText)
      );

    if (player.current.info.thumbnail) {
      container.setThumbnail(player.current.info.thumbnail);
    }

    return interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};

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