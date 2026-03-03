const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  ApplicationCommandOptionType
} = require("discord.js");

module.exports = {
  name: "play",
  description: "Play a track",
  inVoice: true,
  options: [
    {
      name: "query",
      description: "The query to search for",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],

  run: async (client, interaction) => {
    const query = interaction.options.getString("query");
    const voiceChannel = interaction.member.voice?.channel;

    if (!voiceChannel) {
      const notInVC = new ContainerBuilder()
        .setAccentColor(0xFF0000)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("### Voice Channel Required")
        )
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "You must be connected to a voice channel to use this command."
          )
        );

      return interaction.reply({
        components: [notInVC],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
      });
    }

    await interaction.deferReply({
      flags: MessageFlags.IsComponentsV2
    });

    let player = client.riffy.players.get(interaction.guild.id);

    if (!player) {
      player = await client.riffy.createConnection({
        guildId: interaction.guild.id,
        voiceChannel: voiceChannel.id,
        textChannel: interaction.channel.id,
        deaf: true
      });
    }

    const resolve = await client.riffy.resolve({
      query,
      requester: interaction.member
    });

    const { loadType, tracks, playlistInfo } = resolve;

    if (!tracks || !tracks.length) {
      const noResults = new ContainerBuilder()
        .setAccentColor(0xFF0000)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("### No Results Found")
        )
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "There were no results found for your query."
          )
        );

      return interaction.editReply({
        components: [noResults],
        flags: MessageFlags.IsComponentsV2
      });
    }

    if (loadType === "playlist") {
      for (const track of tracks) {
        track.info.requester = interaction.member;
        player.queue.add(track);
      }

      const playlistContainer = new ContainerBuilder()
        .setAccentColor(client.config.color || 0x2B2D31)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("### Playlist Added")
        )
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `Added ${tracks.length} tracks from ${playlistInfo.name} to the queue.`
          )
        );

      await interaction.editReply({
        components: [playlistContainer],
        flags: MessageFlags.IsComponentsV2

      });

    } else {
      const track = tracks.shift();
      track.info.requester = interaction.member;

      player.queue.add(track);

      const position = player.queue.size;

      const trackContainer = new ContainerBuilder()
        .setAccentColor(client.config.color || 0x2B2D31)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("### Track Enqueued")
        )
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `**[${track.info.title}](${track.info.uri})**\n` +
            `by **${track.info.author}**\n\n` +
            `Position in queue: #${position}`
          )
        );

      if (track.info.thumbnail) {
        trackContainer.setThumbnail(track.info.thumbnail);
      }

      await interaction.editReply({
        components: [trackContainer],
        flags: MessageFlags.IsComponentsV2
      });
    }

    if (!player.playing && !player.paused) {
      player.play();
    }
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