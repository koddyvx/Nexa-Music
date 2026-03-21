import { ApplicationCommandOptionType, type GuildMember } from "discord.js";
import { createEmbed } from "@/utils/discord";
import { getPlayer } from "@/utils/commands";
import type { ExtendedPlayer, ExtendedTrack, SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "play",
  description: "Play a track",
  inVoice: true,
  options: [
    {
      name: "query",
      description: "The query to search for",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  async run(client, interaction) {
    if (!interaction.inGuild()) {
      await interaction.reply({ embeds: [createEmbed(client, "Guild Only", "This command can only be used in a server.", "Red")], ephemeral: true });
      return;
    }

    const query = interaction.options.getString("query", true);
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply({
        embeds: [createEmbed(client, "Voice Channel Required", "You must be connected to a voice channel to use this command.", "Red")],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    let player = getPlayer(client, interaction.guildId);

    if (!player) {
      player = (await client.riffy.createConnection({
        guildId: interaction.guildId,
        voiceChannel: voiceChannel.id,
        textChannel: interaction.channelId,
        deaf: true,
      })) as ExtendedPlayer;
    }

    const resolve = await client.riffy.resolve({
      query,
      requester: member,
    });

    const tracks = resolve.tracks as ExtendedTrack[];

    if (tracks.length === 0) {
      await interaction.editReply({
        embeds: [createEmbed(client, "No Results Found", "There were no results found for your query.", "Red")],
      });
      return;
    }

    if (resolve.loadType === "playlist") {
      for (const track of tracks) {
        track.info.requester = member;
        player.queue.add(track);
      }

      await interaction.editReply({
        embeds: [createEmbed(client, "Playlist Added", `Added ${tracks.length} tracks from ${resolve.playlistInfo.name ?? "the playlist"} to the queue.`)],
      });
    } else {
      const track = tracks.shift();

      if (!track) {
        await interaction.editReply({
          embeds: [createEmbed(client, "No Results Found", "There were no results found for your query.", "Red")],
        });
        return;
      }

      track.info.requester = member;
      player.queue.add(track);

      const embed = createEmbed(
        client,
        "Track Enqueued",
        `**[${track.info.title}](${track.info.uri})**\nby **${track.info.author}**\n\nPosition in queue: #${player.queue.size}`,
      );

      if (track.info.thumbnail) {
        embed.setThumbnail(track.info.thumbnail);
      }

      await interaction.editReply({ embeds: [embed] });
    }

    if (!player.playing && !player.paused) {
      await player.play();
    }
  },
};

export default command;
