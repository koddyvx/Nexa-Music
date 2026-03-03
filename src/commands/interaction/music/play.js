const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'play',
    description: 'play a track',
    inVoice: true,
    options: [
        {
            name: 'query',
            description: 'The query to search for',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction, args) => {
        const query = interaction.options.getString('query');

        const player = client.riffy.createConnection({
            guildId: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            deaf: true,
        })

        const resolve = await client.riffy.resolve({ query: query, requester: interaction.member });
        const { loadType, tracks, playlistInfo } = resolve;

        if (loadType === 'playlist') {
            for (const track of resolve.tracks) {
                track.info.requester = interaction.member;
                player.queue.add(track);
            }

            const embed = new EmbedBuilder()
                .setDescription(`Added ${tracks.length} songs from ${playlistInfo.name} playlist.`)
                .setColor(client.config.color);

            await interaction.reply({ embeds: [embed] });

            if (!player.playing && !player.paused) return player.play();

        } else if (loadType === 'search' || loadType === 'track') {
            const track = tracks.shift();
            track.info.requester = interaction.member;

            player.queue.add(track);
            const formatString = (str, maxLength) => (str.length > maxLength ? str.substr(0, maxLength - 3) + "..." : str);
            const trackTitle = formatString(track.info.title, 30).replace(/ - Topic$/, "") || "Unknown";
            const trackAuthor = formatString(track.info.author, 25).replace(/ - Topic$/, "") || "Unknown";

            const embed = new EmbedBuilder()
                .setAuthor({name: 'Enqueued Track'})
                .setDescription(`**Added [${trackTitle}](${track.info.uri}) - [${trackAuthor}](${track.info.uri}) to the queue  at position: #${track.info.position}.**`)
                .setThumbnail(track.info.thumbnail)
                .setColor(client.config.color);

            await interaction.reply({ embeds: [embed] });

            if (!player.playing && !player.paused) return player.play();

        } else {
            return interaction.reply(`There were no results found for your query.`);
        }
    },
};
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
