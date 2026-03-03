module.exports = {
    name: 'leave',
    description: 'leave the bot from your voice channel',
    inVc: true,
    sameVc: true,
    player: true,
    run: async (client, interaction) => {
        const player = client.riffy.players.get(interaction.guildId);
        player.destroy();

        return interaction.reply(`Leave from the voice channel.`);
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
