module.exports = {
    name: 'resume',
    description: 'Resumes the current track',
    inVoice: true,
    sameVoice: true,
    player: true,
    run: (client, interaction) => {
        const player = client.riffy.players.get(interaction.guild.id);

        if (!player.paused) {
            return interaction.reply(`The player is already playing song`);
        } else {
            player.pause(false);
            return interaction.reply(`Resumed the current track.`);
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
