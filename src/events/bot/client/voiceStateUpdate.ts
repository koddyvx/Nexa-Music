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

import { getPlayer } from "@/utils/commands";
import { panelMessage } from "@/utils/discord";
import type { NexaClient } from "@/types";

const leaveTimers = new Map<string, NodeJS.Timeout>();
const timeoutMs = 60_000;

export default function registerVoiceStateUpdate(client: NexaClient): void {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    const player = getPlayer(client, oldState.guild.id);

    if (!player || !client.user) {
      return;
    }

    const textChannel = client.channels.cache.get(player.textChannel);
    if (!textChannel || !("send" in textChannel) || typeof textChannel.send !== "function") {
      return;
    }

    const previousBotChannel = oldState.guild.members.me?.voice.channel;
    const currentBotChannel = newState.guild.members.me?.voice.channel;

    if (previousBotChannel && oldState.channelId === previousBotChannel.id) {
      const listeners = previousBotChannel.members.filter((member) => !member.user.bot);

      if (listeners.size === 0 && !player.paused) {
        await player.pause(true);
        await textChannel.send(panelMessage({
          panel: {
            eyebrow: "Voice state",
            title: "Playback paused",
            description: "Everyone left the voice channel. Playback is paused for one minute.",
          },
        }));

        if (!leaveTimers.has(oldState.guild.id)) {
          const timer = setTimeout(async () => {
            const activeChannel = oldState.guild.members.me?.voice.channel;
            const stillEmpty = !activeChannel || activeChannel.members.filter((member) => !member.user.bot).size === 0;

            if (stillEmpty) {
              player.queue.clear();
              await player.destroy();
              await textChannel.send(panelMessage({
                panel: {
                  eyebrow: "Voice state",
                  title: "Disconnected",
                  description: "The channel stayed empty, so playback was stopped and the bot disconnected.",
                },
              }));
            }

            leaveTimers.delete(oldState.guild.id);
          }, timeoutMs);

          leaveTimers.set(oldState.guild.id, timer);
        }
      }
    }

    if (currentBotChannel && newState.channelId === currentBotChannel.id) {
      const listeners = currentBotChannel.members.filter((member) => !member.user.bot);

      if (listeners.size > 0 && player.paused) {
        const timer = leaveTimers.get(newState.guild.id);
        if (timer) {
          clearTimeout(timer);
          leaveTimers.delete(newState.guild.id);
        }

        await player.pause(false);
        await textChannel.send(panelMessage({
          panel: {
            eyebrow: "Voice state",
            title: "Playback resumed",
            description: "A listener rejoined the voice channel, so playback resumed.",
          },
        }));
      }
    }
  });
}
