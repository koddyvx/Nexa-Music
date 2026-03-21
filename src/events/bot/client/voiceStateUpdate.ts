import { createEmbed, isSendableChannel } from "@/utils/discord";
import type { ExtendedPlayer, NexaClient } from "@/types";

const LEAVE_TIMEOUT = 60_000;
const leaveTimers = new Map<string, NodeJS.Timeout>();

export default function registerVoiceStateUpdate(client: NexaClient): void {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    const player = client.riffy.players.get(oldState.guild.id) as ExtendedPlayer | undefined;

    if (!player || !client.user) {
      return;
    }

    const botId = client.user.id;
    const oldBotChannel = oldState.guild.members.me?.voice.channel;
    const newBotChannel = newState.guild.members.me?.voice.channel;
    const textChannel = client.channels.cache.get(player.textChannel);

    if (oldBotChannel && oldState.channelId === oldBotChannel.id) {
      const nonBotMembers = oldBotChannel.members.filter((member) => !member.user.bot);

      if (nonBotMembers.size === 0 && !player.paused) {
        await player.pause(true);

        if (isSendableChannel(textChannel)) {
          await textChannel.send({
            embeds: [createEmbed(client, "Music Paused", "Everyone left the voice channel. Waiting 1 minute before stopping.", "Yellow")],
          });
        }

        if (!leaveTimers.has(oldState.guild.id)) {
          const timeout = setTimeout(async () => {
            const currentChannel = oldState.guild.members.me?.voice.channel;
            const stillEmpty = currentChannel ? currentChannel.members.filter((member) => !member.user.bot).size === 0 : true;

            if (stillEmpty) {
              await player.stop();
              await player.destroy();

              if (isSendableChannel(textChannel)) {
                await textChannel.send({
                  embeds: [createEmbed(client, "Disconnected", "No one rejoined within 1 minute. Stopping music and leaving.", "Red")],
                });
              }
            }

            leaveTimers.delete(oldState.guild.id);
          }, LEAVE_TIMEOUT);

          leaveTimers.set(oldState.guild.id, timeout);
        }
      }
    }

    if (newBotChannel && newState.channelId === newBotChannel.id) {
      const nonBotMembers = newBotChannel.members.filter((member) => !member.user.bot);

      if (nonBotMembers.size > 0 && player.paused) {
        const timeout = leaveTimers.get(newState.guild.id);
        if (timeout) {
          clearTimeout(timeout);
          leaveTimers.delete(newState.guild.id);
        }

        await player.pause(false);

        if (isSendableChannel(textChannel)) {
          await textChannel.send({
            embeds: [createEmbed(client, "Music Resumed", "Someone joined the voice channel, so playback resumed.", "Green")],
          });
        }
      }
    }

    if (newState.id === botId && oldState.channelId && oldState.serverMute !== newState.serverMute && isSendableChannel(textChannel)) {
      await textChannel.send({
        embeds: [
          createEmbed(
            client,
            newState.serverMute ? "Bot Muted" : "Bot Unmuted",
            newState.serverMute ? "The bot was server-muted." : "The bot is no longer server-muted.",
            newState.serverMute ? "Red" : "Green",
          ),
        ],
      });
    }
  });
}
