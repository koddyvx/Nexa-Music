const { EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'queue',
    description: 'Shows the current queue',
    inVoice: true,
    sameVoice: true,
    player: true,

    run: (client, interaction) => {
        const player = client.riffy.players.get(interaction.guild.id);

        const queue = player.queue.length > 9 ? player.queue.slice(0, 9) : player.queue;

        const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle('Now Playing')
            .setThumbnail(player.current.info.thumbnail)
            .setDescription(`[${player.current.info.title}](${player.current.info.uri}) [${ms(player.current.info.length)}]`)
            .setFooter({ text: `Queue length: ${player.queue.length} tracks` });

        if (queue.length)
            embed.addFields([
                {
                    name: 'Up Next',
                    value: queue
                        .map(
                            (track, index) =>
                                `**${index + 1}.** [${track.info.title}](${track.info.uri})`,
                        )
                        .join('\n'),
                },
            ]);

        return interaction.reply({ embeds: [embed] });
    },
};

/**
 * Project: Nexa Music
 * Author: KoDdy
 * Company: Infinity
 * This code is the property of EnourDev and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/fbu64BmPFD
 */