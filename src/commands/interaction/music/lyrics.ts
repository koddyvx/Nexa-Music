import { getLyrics } from "genius-lyrics-api";
import { getPlayer } from "@/utils/commands";
import { panelEdit } from "@/utils/discord";
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
  description: "Show timed lyric pages for the current song.",
  player: true,
  current: true,

  async run(client, interaction) {
    const player = getPlayer(client, interaction.guildId)!;
    const track = player.current!;

    await interaction.deferReply();

    const lyrics = await getLyrics({
      apiKey: client.config.geniusToken,
      title: track.info.title,
      artist: track.info.author,
      optimizeQuery: true,
    });

    if (!lyrics) {
      await interaction.editReply(panelEdit({ panel: { eyebrow: "Lyrics", title: "Lyrics unavailable", description: "No lyrics were found for the current track." } }));
      return;
    }

    const chunks = chunkLyrics(lyrics);
    let index = 0;

    const message = await interaction.editReply(panelEdit({ panel: { eyebrow: "Lyrics", title: track.info.title, description: chunks[index] } }));

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

      await message.edit(panelEdit({ panel: { eyebrow: "Lyrics", title: track.info.title, description: chunks[index] } })).catch(() => clearInterval(interval));
    }, 5000);
  },
};

export default command;
