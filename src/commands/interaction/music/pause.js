const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require("discord.js");

module.exports = {
  name: "pause",
  description: "Pauses the current track",
  inVoice: true,
  sameVoice: true,
  player: true,

  run: async (client, interaction) => {
    const player = client.riffy.players.get(interaction.guild.id);

    if (!player || !player.current) {
      const noTrack = new ContainerBuilder()
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
            "There is no active track to pause."
          )
        );

      return interaction.reply({
        components: [noTrack],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
      });
    }

    if (player.paused) {
      const alreadyPaused = new ContainerBuilder()
        .setAccentColor(0xF1C40F)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("### Already Paused")
        )
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "The player is already paused."
          )
        );

      return interaction.reply({
        components: [alreadyPaused],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
      });
    }

    player.pause(true);

    const paused = new ContainerBuilder()
      .setAccentColor(client.config.color || 0x2B2D31)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("### Playback Paused")
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          "The current track has been paused."
        )
      );

    return interaction.reply({
      components: [paused],
      flags: MessageFlags.IsComponentsV2
    });
  },
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