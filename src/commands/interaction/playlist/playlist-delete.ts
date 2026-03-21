import { ApplicationCommandOptionType } from "discord.js";
import { deletePlaylist } from "@/storage/playlists";
import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "playlist-delete",
  description: "Delete one of your saved playlists.",
  voteOnly: true,
  options: [{ name: "name", description: "Playlist name", type: ApplicationCommandOptionType.String, required: true }],
  async run(_client, interaction) {
    const name = interaction.options.getString("name", true);
    deletePlaylist(interaction.user.id, name);
    await interaction.reply(panelReply({ panel: { eyebrow: "Playlist", title: "Playlist deleted", description: `Deleted playlist ${name}.` } }));
  },
};

export default command;
