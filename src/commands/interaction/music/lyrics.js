const { EmbedBuilder } = require('discord.js');
const { getLyrics } = require('genius-lyrics-api');

function chunkLyrics(text, linesPerChunk = 6) {
    const lines = text.split('\n').filter(Boolean);
    const chunks = [];
    for (let i = 0; i < lines.length; i += linesPerChunk) {
        chunks.push(lines.slice(i, i + linesPerChunk).join('\n'));
    }
    return chunks;
}

module.exports = {
    name: 'lyrics',
    description: 'Auto-updating lyrics for the current track',

    run: async (client, interaction) => {
        const player = client.riffy.players.get(interaction.guild.id);
        if (!player || !player.current) {
            return interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
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
            return interaction.editReply('Lyrics not found.');
        }

        const chunks = chunkLyrics(lyrics);
        let index = 0;

        const embed = new EmbedBuilder()
            .setTitle(`${track.info.title}`)
            .setColor(client.config.color)
            .setDescription(chunks[index]);

        const message = await interaction.editReply({ embeds: [embed] });

        const interval = setInterval(async () => {
            if (!player.playing || player.current !== track) {
                clearInterval(interval);
                return;
            }

            index++;
            if (!chunks[index]) {
                clearInterval(interval);
                return;
            }

            embed.setDescription(chunks[index]);
            await message.edit({ embeds: [embed] });
        }, 5000);
    }
};