# Changelog

## v2.0.0 - 2026-03-22

### Highlights
- Migrated the project to TypeScript across commands, events, handlers, storage, and shared utilities.
- Upgraded the runtime architecture around Discord.js v14, Lavalink v4, and Riffy.
- Added Components V2 based panel replies for help, node diagnostics, playback feedback, and interactive controls.
- Added SQLite persistence with Drizzle ORM for playlists and guild 24/7 settings.
- Added hybrid command loading so slash and prefix commands can be defined from the same command tree.

### New
- Interactive help center with category and command selection.
- Track control buttons on now playing messages.
- Extended player event coverage for track start/end/error/stuck and queue end.
- Playlist create, load, view, add, remove, and delete commands backed by SQLite.
- 24/7 mode with persistence and auto-reconnect behavior.

### Improved
- Node diagnostics now render through shared panel builders and handle empty-node refresh states more safely.
- Pause and resume flows now synchronize player state after interaction and button actions.
- Autoplay fallback now checks current track state more defensively before attempting recovery.
- Track start now removes the previous control message before sending a new one.
- Command loading is recursive and no longer tied only to the `interaction` folder.

### Fixed
- Deprecated ready-event flow removed in favor of `Events.ClientReady`.
- Collector timeout behavior now disables controls on interactive panels.
- Permission checks were tightened for music-related commands.
- Queue and playlist output formatting issues were cleaned up.
- Components V2 reply flags were standardized through shared helpers.

### Notes
- Package version is `2.0.0`.
- See `MIGRATION.md` for upgrade guidance from older Nexa releases.
