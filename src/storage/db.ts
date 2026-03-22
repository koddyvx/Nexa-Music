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

const storageDir = path.join(process.cwd(), "storage");
const storageFile = path.join(storageDir, "nexa.sqlite");

if (!existsSync(storageDir)) {
  mkdirSync(storageDir, { recursive: true });
}

type SqlParams = readonly unknown[];
type QueryExecutor = {
  get: (...params: unknown[]) => unknown;
  all: (...params: unknown[]) => unknown[];
  run: (...params: unknown[]) => unknown;
};
type BunDatabaseLike = {
  exec: (sql: string) => void;
  query: (sql: string) => QueryExecutor;
};
type BunSqliteModule = {
  Database: new (filename: string, options?: { create?: boolean }) => BunDatabaseLike;
};

interface SqliteAdapter {
  exec(sql: string): void;
  get<T>(sql: string, params?: SqlParams): T | undefined;
  all<T>(sql: string, params?: SqlParams): T[];
  run(sql: string, params?: SqlParams): void;
}

function createAdapter(): SqliteAdapter {
  const runtimeRequire = eval("require") as NodeRequire;
  const isBunRuntime = typeof (globalThis as typeof globalThis & { Bun?: unknown }).Bun !== "undefined";

  if (isBunRuntime) {
    const { Database } = runtimeRequire("bun:sqlite") as BunSqliteModule;
    const sqlite = new Database(storageFile, { create: true });

    return {
      exec(sql: string) {
        sqlite.exec(sql);
      },
      get<T>(sql: string, params: SqlParams = []) {
        return sqlite.query(sql).get(...params) as T | undefined;
      },
      all<T>(sql: string, params: SqlParams = []) {
        return sqlite.query(sql).all(...params) as T[];
      },
      run(sql: string, params: SqlParams = []) {
        sqlite.query(sql).run(...params);
      },
    };
  }

  const Database = runtimeRequire("better-sqlite3") as typeof import("better-sqlite3");
  const sqlite = new Database(storageFile);

  return {
    exec(sql: string) {
      sqlite.exec(sql);
    },
    get<T>(sql: string, params: SqlParams = []) {
      return sqlite.prepare(sql).get(...params) as T | undefined;
    },
    all<T>(sql: string, params: SqlParams = []) {
      return sqlite.prepare(sql).all(...params) as T[];
    },
    run(sql: string, params: SqlParams = []) {
      sqlite.prepare(sql).run(...params);
    },
  };
}

const sqlite = createAdapter();

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

  CREATE TABLE IF NOT EXISTS guild_settings (
    guild_id TEXT PRIMARY KEY,
    stay_247 INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL
  );
`);

export const db = sqlite;
