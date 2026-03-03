const {
  ApplicationCommandOptionType,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require("discord.js");

module.exports = {
  name: "volume",
  description: "Set the volume of the player.",
  inVc: true,
  sameVc: true,
  player: true,

  options: [
    {
      name: "volume",
      description: "The volume you want to set",
      type: ApplicationCommandOptionType.Number,
      required: true,
      min_value: 0,
      max_value: 100,
    },
  ],

  run: async (client, interaction) => {
    const player = client.riffy.players.get(interaction.guild.id);

    if (!player || !player.current) {
      const noTrack = new ContainerBuilder()
        .setAccentColor(0xff0000)
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
            "There is no active track to adjust the volume."
          )
        );

      return interaction.reply({
        components: [noTrack],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
      });
    }

    if (interaction.user.id !== player.current.info.requester?.id) {
      return interaction.reply({
        content:
          "You are not allowed to change the volume because the current song was requested by another user.",
        ephemeral: true,
      });
    }

    const volume = interaction.options.getNumber("volume", true);
    player.setVolume(volume);

    const success = new ContainerBuilder()
      .setAccentColor(client.config.color || 0x2b2d31)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("### Volume Updated")
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Volume has been set to **${volume}%**.`
        )
      );

    return interaction.reply({
      components: [success],
      flags: MessageFlags.IsComponentsV2,
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