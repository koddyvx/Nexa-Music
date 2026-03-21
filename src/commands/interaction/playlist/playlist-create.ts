import { ApplicationCommandOptionType } from "discord.js";
import { createPlaylist } from "@/storage/playlists";
import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "playlist-create",
  description: "Create a saved playlist.",
  voteOnly: true,
  options: [{ name: "name", description: "Playlist name", type: ApplicationCommandOptionType.String, required: true }],
  async run(_client, interaction) {
    const name = interaction.options.getString("name", true);
    createPlaylist(interaction.user.id, name);
    await interaction.reply(panelReply({ panel: { eyebrow: "Playlist", title: "Playlist created", description: `Created playlist ${name}.` } }));
  },
};

export default command;
