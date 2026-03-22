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

import { ApplicationCommandOptionType } from "discord.js";
import { addTrackToPlaylist } from "@/storage/playlists";
import { getPlayer } from "@/utils/commands";
import { panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "playlist-add",
  description: "Add the current track to one of your playlists.",
  voteOnly: true,
  player: true,
  current: true,
  options: [
    {
      name: "name",
      description: "Playlist name",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  async run(client, interaction) {
    const name = interaction.options.getString("name", true);
    const player = getPlayer(client, interaction.guildId)!;
    const track = player.current!;

    const playlist = addTrackToPlaylist(interaction.user.id, name, {
      title: track.info.title,
      uri: track.info.uri,
      author: track.info.author,
    });

    await interaction.reply(panelReply({
      panel: {
        eyebrow: "Playlist",
        title: "Track saved",
        description: `Saved ${track.info.title} to ${name}.`,
        lines: [`Playlist size: ${playlist.tracks.length}`],
      },
    }));
  },
};

export default command;
