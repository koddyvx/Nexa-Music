const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require("discord.js");
const { getLyrics } = require("genius-lyrics-api");

function chunkLyrics(text, linesPerChunk = 6) {
  const lines = text.split("\n").filter(Boolean);
  const chunks = [];
  for (let i = 0; i < lines.length; i += linesPerChunk) {
    chunks.push(lines.slice(i, i + linesPerChunk).join("\n"));
  }
  return chunks;
}

module.exports = {
  name: "lyrics",
  description: "Auto-updating lyrics for the current track",

  run: async (client, interaction) => {
    const player = client.riffy.players.get(interaction.guild.id);

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

    await interaction.deferReply({
      flags: MessageFlags.IsComponentsV2
    });

    const track = player.current;

    const lyrics = await getLyrics({
      apiKey: client.config.geniusToken,
      title: track.info.title,
      artist: track.info.author,
      optimizeQuery: true
    });

    if (!lyrics) {
      const notFound = new ContainerBuilder()
        .setAccentColor(0xFF0000)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("### Lyrics Not Found")
        )
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "Unable to find lyrics for the current track."
          )
        );

      return interaction.editReply({
        components: [notFound]
      });
    }

    const chunks = chunkLyrics(lyrics);
    let index = 0;

    const createContainer = (content) =>
      new ContainerBuilder()
        .setAccentColor(client.config.color || 0x2B2D31)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`### ${track.info.title}`)
        )
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(content)
        );

    const message = await interaction.editReply({
      components: [createContainer(chunks[index])]
    });

    const interval = setInterval(async () => {
      if (!player.playing || player.current !== track) {
        clearInterval(interval);
        return;
      }

      index++;
      if (!chunks[index]) {
        clearInterval(interval);
        return;
      }

      await message.edit({
        components: [createContainer(chunks[index])]
      });
    }, 5000);
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