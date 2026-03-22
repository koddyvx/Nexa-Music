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

import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const storageDir = path.join(process.cwd(), "storage");
const storageFile = path.join(storageDir, "nexa.sqlite");

if (!existsSync(storageDir)) {
  mkdirSync(storageDir, { recursive: true });
}

const sqlite = new Database(storageFile);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id TEXT NOT NULL,
    name_key TEXT NOT NULL,
    display_name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE(owner_id, name_key)
  );

  CREATE TABLE IF NOT EXISTS playlist_tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playlist_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    uri TEXT NOT NULL,
    author TEXT NOT NULL,
    order_index INTEGER NOT NULL
  );
`);

export const db = drizzle(sqlite);

