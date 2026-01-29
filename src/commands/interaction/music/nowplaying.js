const { EmbedBuilder } = require("discord.js");

function formatTime(ms) {
    if (!ms || ms === 0) return "00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    } else {
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
}

function createProgressBar(current, total, size = 20) {
    const percent = total === 0 ? 0 : current / total;
    const progress = Math.round(size * percent);

    const bar =
        "▬".repeat(progress) + "🔘" + "▬".repeat(size - progress);

    return bar;
}

module.exports = {
    name: "nowplaying",
    description: "Shows the currently playing track",
    inVc: true,
    sameVc: true,
    player: true,

    run: async (client, interaction) => {
        const player = client.riffy.players.get(interaction.guildId);

        if (!player || !player.current) {
            return interaction.reply({
                content: "❌ | here is nothing playing right now.",
                ephemeral: true,
            });
        }

        const track = player.current;

        const currentTime = player.position;
        const totalTime = track.info.length;

        const progressBar = createProgressBar(currentTime, totalTime, 18);

        const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle("Now Playing")
            .setDescription(
                `**[${track.info.title}](${track.info.uri})**\n` +
                `by **${track.info.author}**\n\n` +
                `\`${formatTime(currentTime)}\` ${progressBar} \`${formatTime(totalTime)}\``
            )
            .setFooter({ text: `Requested by ${track.info.requester?.username || "Unknown"}` });

        if (track.info.thumbnail) {
            embed.setThumbnail(track.info.thumbnail);
        }

        return interaction.reply({ embeds: [embed] });
    },
};