import { EmbedBuilder, type ColorResolvable } from "discord.js";
import type { ExtendedTrack, NexaClient } from "@/types";

export function createEmbed(
  client: NexaClient,
  title: string,
  description: string,
  color?: ColorResolvable,
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(color ?? client.config.color)
    .setTitle(title)
    .setDescription(description);
}

export function formatTrackDuration(track: ExtendedTrack): string {
  return track.info.isStream ? "LIVE" : formatDuration(track.info.length);
}

export function formatDuration(durationMs: number): string {
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function progressBar(currentMs: number, totalMs: number, size = 18): string {
  if (totalMs <= 0) {
    return `[${"-".repeat(size)}]`;
  }

  const ratio = Math.max(0, Math.min(1, currentMs / totalMs));
  const progress = Math.round(size * ratio);
  const headIndex = Math.min(size - 1, Math.max(0, progress));

  return `[${Array.from({ length: size }, (_, index) => {
    if (index < headIndex) {
      return "=";
    }

    if (index === headIndex) {
      return ">";
    }

    return "-";
  }).join("")}]`;
}

export function truncate(value: string, maxLength: number): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
}

export function isSendableChannel(channel: unknown): channel is { send: (options: object) => Promise<unknown> } {
  return typeof channel === "object" && channel !== null && "send" in channel && typeof channel.send === "function";
}
