const { EmbedBuilder } = require('discord.js');

const LEAVE_TIMEOUT = 60 * 1000;
const leaveTimers = new Map();

module.exports = (client) => {
  client.on('voiceStateUpdate', async (oldState, newState) => {
    const player = client.riffy?.players?.get(oldState.guild.id);
    if (!player) return;

    const botId = client.user.id;

    const oldBotChannel = oldState.guild.members.me?.voice.channel;
    const newBotChannel = newState.guild.members.me?.voice.channel;

    if (oldBotChannel && oldState.channelId === oldBotChannel.id) {
      const members = oldBotChannel.members.filter(m => !m.user.bot);
      if (members.size === 0 && !player.paused) {
        player.pause(true);
        const textChannel = client.channels.cache.get(player.textChannel);

        const embed = new EmbedBuilder()
          .setColor('Yellow')
          .setDescription('⏸ **Music paused** — everyone left the voice channel.\nWaiting 1 minute before stopping.');
        textChannel?.send({ embeds: [embed] });

        if (!leaveTimers.has(oldState.guild.id)) {
          const timeout = setTimeout(() => {
            const stillEmpty = oldBotChannel.members.filter(m => !m.user.bot).size === 0;
            if (stillEmpty) {
              player.stop();
              player.destroy();
              const stopEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('🛑 **No one rejoined** within 1 minute.\nStopping music and leaving.');
              textChannel?.send({ embeds: [stopEmbed] });
            }
            leaveTimers.delete(oldState.guild.id);
          }, LEAVE_TIMEOUT);

          leaveTimers.set(oldState.guild.id, timeout);
        }
      }
    }

    if (newBotChannel && newState.channelId === newBotChannel.id) {
      const members = newBotChannel.members.filter(m => !m.user.bot);
      if (members.size > 0 && player.paused) {
        if (leaveTimers.has(newState.guild.id)) {
          clearTimeout(leaveTimers.get(newState.guild.id));
          leaveTimers.delete(newState.guild.id);
        }
        player.pause(false);
        const textChannel = client.channels.cache.get(player.textChannel);
        const embed = new EmbedBuilder()
          .setColor('Green')
          .setDescription('▶ **Music resumed** — someone joined the voice channel.');
        textChannel?.send({ embeds: [embed] });
      }
    }

    if (newState.id === botId) {
      if (!oldState.channelId) return;

      if (oldState.serverMute !== newState.serverMute) {
        const textChannel = client.channels.cache.get(player.textChannel);
        const embed = new EmbedBuilder()
          .setColor(newState.serverMute ? 'Red' : 'Green')
          .setDescription(newState.serverMute ? '🔇 **Bot was server-muted.**' : '🔊 **Bot was unmuted.**');
        textChannel?.send({ embeds: [embed] });
      }
    }
  });
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
