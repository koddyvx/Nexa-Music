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

export function is247Enabled(guildId: string): boolean {
  const row = db.get<{ stay_247: number }>(
    "SELECT stay_247 FROM guild_settings WHERE guild_id = ?",
    [guildId],
  );
  return Boolean(row?.stay_247);
}

export function set247Enabled(guildId: string, enabled: boolean): void {
  const now = new Date().toISOString();
  db.run(
    `
      INSERT INTO guild_settings (guild_id, stay_247, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(guild_id) DO UPDATE SET
        stay_247 = excluded.stay_247,
        updated_at = excluded.updated_at
    `,
    [guildId, enabled ? 1 : 0, now],
  );
}
