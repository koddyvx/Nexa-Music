import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const playlists = sqliteTable(
  "playlists",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    ownerId: text("owner_id").notNull(),
    nameKey: text("name_key").notNull(),
    displayName: text("display_name").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    ownerNameUnique: uniqueIndex("playlists_owner_name_unique").on(table.ownerId, table.nameKey),
  }),
);

export const playlistTracks = sqliteTable("playlist_tracks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  playlistId: integer("playlist_id").notNull(),
  title: text("title").notNull(),
  uri: text("uri").notNull(),
  author: text("author").notNull(),
  orderIndex: integer("order_index").notNull(),
});

