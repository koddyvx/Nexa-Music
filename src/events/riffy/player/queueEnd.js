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
 * Company: Infinity
 * This code is the property of Infinity and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/fbu64BmPFD

 */
