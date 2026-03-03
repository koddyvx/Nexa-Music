const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require("discord.js");

module.exports = {
  name: "leave",
  description: "Leave the bot from your voice channel",
  inVc: true,
  sameVc: true,
  player: true,

  run: async (client, interaction) => {
    const player = client.riffy.players.get(interaction.guildId);

    if (!player) {
      const noPlayer = new ContainerBuilder()
        .setAccentColor(0xFF0000)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("### Music Player Not Found")
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

    const voiceChannelId = player.voiceChannel;

    player.destroy();

    const left = new ContainerBuilder()
      .setAccentColor(client.config.color || 0x2B2D31)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("### Disconnected")
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Successfully left <#${voiceChannelId}>.`
        )
      );

    return interaction.reply({
      components: [left],
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