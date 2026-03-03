const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {
  client.riffy.on("queueEnd", async (player) => {
    if (player.message) {
      player.message.delete().catch(() => {});
    }

    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    if (player.isAutoplay) {
      if (typeof player.autoplay === "function") {
        player.autoplay(player);
      }
    } else {
      player.destroy();

      const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription(
          `Queue ended`
        );

      channel.send({ embeds: [embed] }).catch(() => {});
    }
  });
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
