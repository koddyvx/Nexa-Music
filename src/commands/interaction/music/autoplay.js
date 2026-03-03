const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require("discord.js");

module.exports = {
  name: "autoplay",
  description: "Toggle autoplay for the current music player.",
  inVc: true,
  sameVc: true,

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
            "There is no active music player for this server."
          )
        );

      return interaction.reply({
        components: [noPlayer],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
      });
    }

    player.isAutoplay = !player.isAutoplay;

    if (typeof player.autoplay === "function") {
      player.autoplay(player);
    }

    const updated = new ContainerBuilder()
      .setAccentColor(client.config.color || 0x2B2D31)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("### Autoplay Updated")
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Autoplay mode is now \`${player.isAutoplay ? "enabled" : "disabled"}\`.`
        )
      );

    return interaction.reply({
      components: [updated],
      flags: MessageFlags.IsComponentsV2
    });
  },
};