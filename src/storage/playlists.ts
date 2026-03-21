import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

interface PlaylistEntry {
  title: string;
  uri: string;
  author: string;
}

interface PlaylistRecord {
  ownerId: string;
  createdAt: string;
  tracks: PlaylistEntry[];
}

type PlaylistDatabase = Record<string, Record<string, PlaylistRecord>>;

const storageDir = path.join(process.cwd(), "storage");
const storageFile = path.join(storageDir, "playlists.json");

function ensureStorage(): void {
  if (!existsSync(storageDir)) {
    mkdirSync(storageDir, { recursive: true });
  }

  if (!existsSync(storageFile)) {
    writeFileSync(storageFile, JSON.stringify({}, null, 2), "utf8");
  }
}

function readDatabase(): PlaylistDatabase {
  ensureStorage();
  return JSON.parse(readFileSync(storageFile, "utf8")) as PlaylistDatabase;
}

function writeDatabase(data: PlaylistDatabase): void {
  ensureStorage();
  writeFileSync(storageFile, JSON.stringify(data, null, 2), "utf8");
}

function key(name: string): string {
  return name.trim().toLowerCase();
}

export function createPlaylist(ownerId: string, name: string): PlaylistRecord {
  const db = readDatabase();
  const ownerPlaylists = db[ownerId] ?? {};
  const playlistName = key(name);

  if (ownerPlaylists[playlistName]) {
    throw new Error("A playlist with that name already exists.");
  }

  ownerPlaylists[playlistName] = {
    ownerId,
    createdAt: new Date().toISOString(),
    tracks: [],
  };

  db[ownerId] = ownerPlaylists;
  writeDatabase(db);
  return ownerPlaylists[playlistName];
}

export function getPlaylist(ownerId: string, name: string): PlaylistRecord | undefined {
  const db = readDatabase();
  return db[ownerId]?.[key(name)];
}

export function listPlaylists(ownerId: string): string[] {
  const db = readDatabase();
  return Object.keys(db[ownerId] ?? {}).sort();
}

export function addTrackToPlaylist(ownerId: string, name: string, track: PlaylistEntry): PlaylistRecord {
  const db = readDatabase();
  const ownerPlaylists = db[ownerId] ?? {};
  const playlist = ownerPlaylists[key(name)];

  if (!playlist) {
    throw new Error("Playlist not found.");
  }

  playlist.tracks.push(track);
  db[ownerId] = ownerPlaylists;
  writeDatabase(db);
  return playlist;
}

export function removeTrackFromPlaylist(ownerId: string, name: string, position: number): PlaylistRecord {
  const db = readDatabase();
  const ownerPlaylists = db[ownerId] ?? {};
  const playlist = ownerPlaylists[key(name)];

  if (!playlist) {
    throw new Error("Playlist not found.");
  }

  if (position < 1 || position > playlist.tracks.length) {
    throw new Error("Track position is out of range.");
  }

  playlist.tracks.splice(position - 1, 1);
  db[ownerId] = ownerPlaylists;
  writeDatabase(db);
  return playlist;
}

export function deletePlaylist(ownerId: string, name: string): void {
  const db = readDatabase();
  const ownerPlaylists = db[ownerId] ?? {};
  const playlistName = key(name);

  if (!ownerPlaylists[playlistName]) {
    throw new Error("Playlist not found.");
  }

  delete ownerPlaylists[playlistName];
  db[ownerId] = ownerPlaylists;
  writeDatabase(db);
}
