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

import { eq } from "drizzle-orm";
import { db } from "@/storage/db";
import { guildSettings } from "@/storage/schema";

export function is247Enabled(guildId: string): boolean {
  const row = db.select().from(guildSettings).where(eq(guildSettings.guildId, guildId)).get();
  return Boolean(row?.stay247);
}

export function set247Enabled(guildId: string, enabled: boolean): void {
  const now = new Date().toISOString();
  const exists = db.select().from(guildSettings).where(eq(guildSettings.guildId, guildId)).get();

  if (!exists) {
    db.insert(guildSettings).values({
      guildId,
      stay247: enabled ? 1 : 0,
      updatedAt: now,
    }).run();
    return;
  }

  db.update(guildSettings)
    .set({
      stay247: enabled ? 1 : 0,
      updatedAt: now,
    })
    .where(eq(guildSettings.guildId, guildId))
    .run();
}

