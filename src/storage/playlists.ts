import { and, asc, eq, max } from "drizzle-orm";
import { db } from "@/storage/db";
import { playlists, playlistTracks } from "@/storage/schema";

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

function key(name: string): string {
  return name.trim().toLowerCase();
}

function getPlaylistRow(ownerId: string, name: string) {
  const nameKey = key(name);
  return db
    .select()
    .from(playlists)
    .where(and(eq(playlists.ownerId, ownerId), eq(playlists.nameKey, nameKey)))
    .get();
}

function getPlaylistTracks(playlistId: number): PlaylistEntry[] {
  return db
    .select({
      title: playlistTracks.title,
      uri: playlistTracks.uri,
      author: playlistTracks.author,
    })
    .from(playlistTracks)
    .where(eq(playlistTracks.playlistId, playlistId))
    .orderBy(asc(playlistTracks.orderIndex))
    .all();
}

export function createPlaylist(ownerId: string, name: string): PlaylistRecord {
  const nameKey = key(name);
  const exists = getPlaylistRow(ownerId, name);

  if (exists) {
    throw new Error("A playlist with that name already exists.");
  }

  const createdAt = new Date().toISOString();
  db.insert(playlists).values({
    ownerId,
    nameKey,
    displayName: name.trim(),
    createdAt,
  }).run();

  return { ownerId, createdAt, tracks: [] };
}

export function getPlaylist(ownerId: string, name: string): PlaylistRecord | undefined {
  const row = getPlaylistRow(ownerId, name);
  if (!row) {
    return undefined;
  }

  return {
    ownerId: row.ownerId,
    createdAt: row.createdAt,
    tracks: getPlaylistTracks(row.id),
  };
}

export function listPlaylists(ownerId: string): string[] {
  return db
    .select({ displayName: playlists.displayName })
    .from(playlists)
    .where(eq(playlists.ownerId, ownerId))
    .orderBy(asc(playlists.displayName))
    .all()
    .map((row) => row.displayName);
}

export function addTrackToPlaylist(ownerId: string, name: string, track: PlaylistEntry): PlaylistRecord {
  const row = getPlaylistRow(ownerId, name);

  if (!row) {
    throw new Error("Playlist not found.");
  }

  const maxOrder = db
    .select({ value: max(playlistTracks.orderIndex) })
    .from(playlistTracks)
    .where(eq(playlistTracks.playlistId, row.id))
    .get()?.value;
  const nextOrder = typeof maxOrder === "number" ? maxOrder + 1 : 0;

  db.insert(playlistTracks).values({
    playlistId: row.id,
    title: track.title,
    uri: track.uri,
    author: track.author,
    orderIndex: nextOrder,
  }).run();

  return {
    ownerId: row.ownerId,
    createdAt: row.createdAt,
    tracks: getPlaylistTracks(row.id),
  };
}

export function removeTrackFromPlaylist(ownerId: string, name: string, position: number): PlaylistRecord {
  const row = getPlaylistRow(ownerId, name);

  if (!row) {
    throw new Error("Playlist not found.");
  }

  const tracks = db
    .select({
      id: playlistTracks.id,
      orderIndex: playlistTracks.orderIndex,
    })
    .from(playlistTracks)
    .where(eq(playlistTracks.playlistId, row.id))
    .orderBy(asc(playlistTracks.orderIndex))
    .all();

  if (position < 1 || position > tracks.length) {
    throw new Error("Track position is out of range.");
  }

  const target = tracks[position - 1];
  db.delete(playlistTracks).where(eq(playlistTracks.id, target.id)).run();

  const remaining = tracks.filter((track) => track.id !== target.id);
  for (let index = 0; index < remaining.length; index += 1) {
    const entry = remaining[index];
    db.update(playlistTracks).set({ orderIndex: index }).where(eq(playlistTracks.id, entry.id)).run();
  }

  return {
    ownerId: row.ownerId,
    createdAt: row.createdAt,
    tracks: getPlaylistTracks(row.id),
  };
}

export function deletePlaylist(ownerId: string, name: string): void {
  const row = getPlaylistRow(ownerId, name);

  if (!row) {
    throw new Error("Playlist not found.");
  }

  db.delete(playlistTracks).where(eq(playlistTracks.playlistId, row.id)).run();
  db.delete(playlists).where(eq(playlists.id, row.id)).run();
}

