import { getLyrics } from "genius-lyrics-api";
import { createEmbed } from "@/utils/discord";
import { getPlayer } from "@/utils/commands";
import type { SlashCommand } from "@/types";

function chunkLyrics(text: string, linesPerChunk = 6): string[] {
  const lines = text.split("\n").filter(Boolean);
  const chunks: string[] = [];

  for (let index = 0; index < lines.length; index += linesPerChunk) {
    chunks.push(lines.slice(index, index + linesPerChunk).join("\n"));
  }

  return chunks;
}

const command: SlashCommand = {
  name: "lyrics",
  description: "Auto-updating lyrics for the current track",
  player: true,
  current: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId);

    if (!player?.current) {
      await interaction.reply({
        embeds: [createEmbed(client, "Nothing Playing", "There is no active track in this server.", "Red")],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    const track = player.current;
    const lyrics = await getLyrics({
      apiKey: client.config.geniusToken,
      title: track.info.title,
      artist: track.info.author,
      optimizeQuery: true,
    });

    if (!lyrics) {
      await interaction.editReply({
        embeds: [createEmbed(client, "Lyrics Not Found", "Unable to find lyrics for the current track.", "Red")],
      });
      return;
    }

    const chunks = chunkLyrics(lyrics);
    let index = 0;

    const message = await interaction.editReply({
      embeds: [createEmbed(client, track.info.title, chunks[index])],
    });

    const interval = setInterval(async () => {
      if (!player.playing || player.current !== track) {
        clearInterval(interval);
        return;
      }

      index += 1;
      if (!chunks[index]) {
        clearInterval(interval);
        return;
      }

      await message.edit({
        embeds: [createEmbed(client, track.info.title, chunks[index])],
      }).catch(() => {
        clearInterval(interval);
      });
    }, 5000);
  },
};

export default command;
