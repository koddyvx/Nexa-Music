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

import { db } from "@/storage/db";

export interface Stay247Settings {
  guildId: string;
  enabled: boolean;
  voiceChannelId?: string;
  textChannelId?: string;
}

export function is247Enabled(guildId: string): boolean {
  const row = db.get<{ stay_247: number }>(
    "SELECT stay_247 FROM guild_settings WHERE guild_id = ?",
    [guildId],
  );
  return Boolean(row?.stay_247);
}

export function getEnabled247Guilds(): Stay247Settings[] {
  return db.all<{
    guild_id: string;
    stay_247: number;
    voice_channel_id: string | null;
    text_channel_id: string | null;
  }>(
    `
      SELECT guild_id, stay_247, voice_channel_id, text_channel_id
      FROM guild_settings
      WHERE stay_247 = 1
    `,
  ).map((row) => ({
    guildId: row.guild_id,
    enabled: Boolean(row.stay_247),
    voiceChannelId: row.voice_channel_id ?? undefined,
    textChannelId: row.text_channel_id ?? undefined,
  }));
}

export function set247Enabled(
  guildId: string,
  enabled: boolean,
  voiceChannelId?: string,
  textChannelId?: string,
): void {
  const now = new Date().toISOString();
  db.run(
    `
      INSERT INTO guild_settings (guild_id, stay_247, voice_channel_id, text_channel_id, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(guild_id) DO UPDATE SET
        stay_247 = excluded.stay_247,
        voice_channel_id = excluded.voice_channel_id,
        text_channel_id = excluded.text_channel_id,
        updated_at = excluded.updated_at
    `,
    [
      guildId,
      enabled ? 1 : 0,
      enabled ? (voiceChannelId ?? null) : null,
      enabled ? (textChannelId ?? null) : null,
      now,
    ],
  );
}
