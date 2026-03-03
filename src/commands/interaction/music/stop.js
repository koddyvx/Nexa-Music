const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require("discord.js");

module.exports = {
  name: "stop",
  description: "Stop the music and disconnect the bot",
  inVc: true,
  sameVc: true,
  player: true,

  run: async (client, interaction) => {
    const player = client.riffy.players.get(interaction.guildId);

    if (!player) {
      const noPlayer = new ContainerBuilder()
        .setAccentColor(0xFF0000)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("### No Active Player")
        )
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "There is no active music session in this server."
          )
        );

      return interaction.reply({
        components: [noPlayer],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
      });
    }

    const voiceChannelId = player.voiceChannel;

    player.destroy();

    const stopped = new ContainerBuilder()
      .setAccentColor(client.config.color || 0x2B2D31)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("### Playback Stopped")
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Music playback has been stopped and disconnected from <#${voiceChannelId}>.`
        )
      );

    return interaction.reply({
      components: [stopped],
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