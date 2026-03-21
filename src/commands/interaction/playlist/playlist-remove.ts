import { ApplicationCommandOptionType } from "discord.js";
import { removeTrackFromPlaylist } from "@/storage/playlists";
import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "playlist-remove",
  description: "Remove a track from one of your playlists.",
  voteOnly: true,
  options: [
    { name: "name", description: "Playlist name", type: ApplicationCommandOptionType.String, required: true },
    { name: "position", description: "Track position in the playlist", type: ApplicationCommandOptionType.Integer, required: true, min_value: 1 },
  ],
  async run(_client, interaction) {
    const name = interaction.options.getString("name", true);
    const position = interaction.options.getInteger("position", true);
    const playlist = removeTrackFromPlaylist(interaction.user.id, name, position);
    await interaction.reply(panelReply({ panel: { eyebrow: "Playlist", title: "Track removed", lines: [`Playlist: ${name}`, `Remaining tracks: ${playlist.tracks.length}`] } }));
  },
};

export default command;
