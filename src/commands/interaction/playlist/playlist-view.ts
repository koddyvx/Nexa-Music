import { ApplicationCommandOptionType } from "discord.js";
import { getPlaylist, listPlaylists } from "@/storage/playlists";
import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "playlist-view",
  description: "View one playlist or list your saved playlists.",
  voteOnly: true,
  options: [{ name: "name", description: "Playlist name", type: ApplicationCommandOptionType.String, required: false }],
  async run(_client, interaction) {
    const name = interaction.options.getString("name");

    if (!name) {
      const names = listPlaylists(interaction.user.id);
      await interaction.reply(panelReply({ panel: { eyebrow: "Playlist", title: "Your playlists", lines: names.length > 0 ? names : ["No playlists saved yet."] } }));
      return;
    }

    const playlist = getPlaylist(interaction.user.id, name);
    if (!playlist) {
      await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Playlist", title: "Playlist not found", description: `No playlist named ${name} was found.` } }));
      return;
    }

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Playlist",
        title: name,
        lines: playlist.tracks.length > 0 ? playlist.tracks.map((track, index) => `${index + 1}. ${track.title} — ${track.author}`) : ["This playlist is empty."],
      },
    }));
  },
};

export default command;
