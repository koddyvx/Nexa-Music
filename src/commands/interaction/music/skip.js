module.exports = {
    name: 'skip',
    description: 'Skips the current track',
    inVoice: true,
    sameVoice: true,
    player: true,
    run: (client, interaction) => {
        const player = client.riffy.players.get(interaction.guild.id);
        player.stop();

        return interaction.reply(`Skipped the current track.`);
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
