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

import { ApplicationCommandOptionType, type GuildMember } from "discord.js";
import { ensurePlayerConnection } from "@/utils/commands";
import { panelEdit, panelReply } from "@/utils/discord";
import type { ExtendedTrack, SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "play",
  description: "Search for a track or playlist and add it to the queue.",
  inVoice: true,
  options: [{ name: "query", description: "A search term or direct URL", type: ApplicationCommandOptionType.String, required: true }],

  async run(client, interaction) {
    if (!interaction.inGuild()) {
      await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Voice required", title: "Server only", description: "This command can only be used in a server." } }));
      return;
    }

    const query = interaction.options.getString("query", true);
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Voice required", title: "Join a voice channel", description: "You must join a voice channel before playing music." } }));
      return;
    }

    await interaction.deferReply();

    const player = await ensurePlayerConnection(client, interaction.guildId, voiceChannel.id, interaction.channelId);

    const resolve = await client.riffy.resolve({ query, requester: member });
    const tracks = resolve.tracks as ExtendedTrack[];

    if (tracks.length === 0) {
      await interaction.editReply(panelEdit({ panel: { eyebrow: "Search", title: "No results found", description: "No tracks matched your request." } }));
      return;
    }

    if (resolve.loadType === "playlist") {
      for (const track of tracks) {
        track.info.requester = member;
        player.queue.add(track);
      }

      await interaction.editReply(panelEdit({ panel: { eyebrow: "Queue", title: "Playlist added", lines: [`Playlist: ${resolve.playlistInfo.name ?? "Unnamed playlist"}`, `Tracks queued: ${tracks.length}`, `Queue size: ${player.queue.size}`] } }));
    } else {
      const track = tracks.shift();
      if (!track) {
        await interaction.editReply(panelEdit({ panel: { eyebrow: "Search", title: "No results found", description: "No tracks matched your request." } }));
        return;
      }

      track.info.requester = member;
      player.queue.add(track);

      await interaction.editReply(panelEdit({ panel: { eyebrow: "Queue", title: "Track added", imageUrl: track.info.thumbnail, lines: [`[${track.info.title}](${track.info.uri})`, `Artist: ${track.info.author}`, `Position: ${player.queue.size}`] } }));
    }

    if (player.queue.length > 0 && !player.playing && !player.paused) {
      try {
        await player.play();
      } catch (error) {
        await interaction.followUp(panelReply({ ephemeral: true, panel: { eyebrow: "Playback", title: "Player start failed", description: error instanceof Error ? error.message : String(error) } }));
      }
    }
  },
};

export default command;
