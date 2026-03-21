import { ApplicationCommandOptionType, type GuildMember } from "discord.js";
import { getPlaylist } from "@/storage/playlists";
import { getPlayer } from "@/utils/commands";
import { panelEdit, panelReply } from "@/utils/discord";
import type { ExtendedPlayer, ExtendedTrack, SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "playlist-load",
  description: "Load one of your saved playlists into the queue.",
  voteOnly: true,
  inVoice: true,
  options: [{ name: "name", description: "Playlist name", type: ApplicationCommandOptionType.String, required: true }],

  async run(client, interaction) {
    if (!interaction.inGuild()) {
      await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Playlist", title: "Server only", description: "This command can only be used in a server." } }));
      return;
    }

    const name = interaction.options.getString("name", true);
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Playlist", title: "Join a voice channel", description: "Join a voice channel before loading a playlist." } }));
      return;
    }

    const playlist = getPlaylist(interaction.user.id, name);
    if (!playlist) {
      await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Playlist", title: "Playlist not found", description: `No playlist named ${name} was found.` } }));
      return;
    }

    await interaction.deferReply();

    let player = getPlayer(client, interaction.guildId);
    if (!player) {
      player = (await client.riffy.createConnection({ guildId: interaction.guildId, voiceChannel: voiceChannel.id, textChannel: interaction.channelId, deaf: true })) as ExtendedPlayer;
    }

    let added = 0;
    for (const entry of playlist.tracks) {
      const resolve = await client.riffy.resolve({ query: entry.uri, requester: member });
      const track = resolve.tracks[0] as ExtendedTrack | undefined;
      if (!track) {
        continue;
      }

      track.info.requester = member;
      player.queue.add(track);
      added += 1;
    }

    await interaction.editReply(panelEdit({ panel: { eyebrow: "Playlist", title: "Playlist loaded", lines: [`Playlist: ${name}`, `Tracks queued: ${added}`] } }));

    if (added > 0 && player.queue.length > 0 && !player.playing && !player.paused) {
      try {
        await player.play();
      } catch (error) {
        await interaction.followUp(panelReply({ ephemeral: true, panel: { eyebrow: "Playback", title: "Player start failed", description: error instanceof Error ? error.message : String(error) } }));
      }
    }
  },
};

export default command;
