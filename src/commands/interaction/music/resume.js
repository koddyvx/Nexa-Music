const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require("discord.js");

module.exports = {
  name: "resume",
  description: "Resumes the current track",
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
            "There is no active track to resume."
          )
        );

      return interaction.reply({
        components: [noTrack],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
      });
    }

    if (!player.paused) {
      const alreadyPlaying = new ContainerBuilder()
        .setAccentColor(0xF1C40F)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("### Already Playing")
        )
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "The player is already playing the current track."
          )
        );

      return interaction.reply({
        components: [alreadyPlaying],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
      });
    }

    player.pause(false);

    const resumed = new ContainerBuilder()
      .setAccentColor(client.config.color || 0x2B2D31)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("### Playback Resumed")
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          "The current track has been resumed."
        )
      );

    return interaction.reply({
      components: [resumed],
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