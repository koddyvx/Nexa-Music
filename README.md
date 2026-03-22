# Nexa Music v2

Nexa Music v2 is a TypeScript Discord music bot built on Discord.js v14, Lavalink v4, and Riffy.

Current stable release: `v2.0.0`

Release docs:
- [CHANGELOG.md](./CHANGELOG.md)
- [MIGRATION.md](./MIGRATION.md)

## Authors
- KoDdy
- Razi

## Organization
- Infinity

## Support
- Discord: https://discord.gg/fbu64BmPFD

## License
- MIT

## What Is New In v2

### Addons
- Full Components V2 panel UI for replies/messages.
- Interactive help center with category select menu and command select menu.
- Track control buttons on `trackStart`:
  - Pause/Resume
  - Skip
  - Stop
  - Queue preview
- Extended playback event coverage:
  - `trackStart`
  - `trackEnd`
  - `trackError`
  - `trackStuck`
  - `queueEnd`
- SQLite persistent playlist storage.
- Drizzle ORM data layer for playlists/tracks.
- Prefix adapter system mapped from slash commands.

### Fixes
- Deprecated ready event warning fixed:
  - moved startup flow to `Events.ClientReady`
  - removed old `client.on("ready")` usage
- Updated UI branding from old reddish text to `Nexa Music` style.
- Help panel now has timeout handling (1 minute) and disables controls on timeout.
- Node diagnostics command stability improvements:
  - safe refresh when no nodes are available
  - button state lock on collector end
- Added/strengthened permission checks for music commands:
  - `ViewChannel`
  - `SendMessages`
  - `EmbedLinks`
  - `Connect`
  - `Speak`
- Fixed queue/playlist text separators and encoding issues.
- Standardized Components V2 message flags via shared panel utility.

### JS To TS Conversion Improvements
- Typed client class (`NexaClient`) with command and riffy members.
- Typed slash/prefix command contracts.
- Typed event loader interfaces.
- Typed playlist data models and storage API.
- Safer error handling with TypeScript narrowing.
- Stricter command interaction checks (`inGuild`, player/current checks).

## Release 2.0.0 Summary
- Migrated the codebase to TypeScript with stricter runtime guards.
- Standardized Discord reply rendering around Components V2 panel helpers.
- Added SQLite + Drizzle persistence for playlists and guild 24/7 settings.
- Introduced hybrid command loading so slash and prefix commands can share one file.
- Improved playback stability around pause/resume sync, autoplay fallback, node diagnostics, and track-start message cleanup.

See [MIGRATION.md](./MIGRATION.md) for upgrade notes from older Nexa builds.

## Hybrid Command System
- Commands are now loaded recursively from `src/commands`, not tied to `interaction` folder.
- Use one file for both prefix and slash.
- Per-command flags:
  - `slashcmd: true | false`
  - `prefixcmd: true | false`
- Example file:
  - `src/commands/hybrid/nexa.ts`
- Example behavior:
  - `/nexa` (slash)
  - `-nexa` and `-nx` (prefix alias)

## Tech Stack
- Bun (primary runtime)
- Node.js
- TypeScript
- Discord.js v14
- Riffy
- Lavalink v4
- SQLite (`better-sqlite3`)
- Drizzle ORM
- Top.gg SDK (optional vote checks)
- Genius Lyrics API (optional lyrics)

## All Technologies Used

### Core Runtime
- Bun
- Node.js
- TypeScript
- npm

### Discord + Music
- Discord.js v14
- Discord Gateway Intents + Interactions API
- Components V2 (Container/Section/Text/Separator based UI)
- Riffy (Lavalink client wrapper)
- Lavalink v4
- Discord Sharding Manager

### Data + Storage
- SQLite (`better-sqlite3`)
- Drizzle ORM

### Integrations
- Top.gg SDK
- Genius Lyrics API

### Configuration + Build Tooling
- dotenv
- TypeScript Compiler (`tsc`)
- `tsc-alias` (path alias rewrite for build output)
- Prettier

### Project Architecture
- Slash command system
- Prefix command adapter system
- Event-driven handlers (bot + player + node events)
- Typed custom client (`NexaClient`)

## Project Structure

```txt
src/
  commands/
    interaction/
      developer/
      information/
      music/
      playlist/
      utility/
  events/
    bot/client/
    riffy/node/
    riffy/player/
  handlers/
  settings/
  storage/
  types/
  utils/
```

## Commands Reference

### Information
- `/about`
- `/help`
- `/node`
- `/ping`

### Music
- `/247`
- `/autoplay`
- `/clear`
- `/join`
- `/leave`
- `/loop`
- `/lyrics`
- `/nowplaying`
- `/pause`
- `/play`
- `/previous`
- `/queue`
- `/remove`
- `/resume`
- `/seek`
- `/shuffle`
- `/skip`
- `/stop`
- `/volume`

### Playlist
- `/playlist-add`
- `/playlist-create`
- `/playlist-delete`
- `/playlist-load`
- `/playlist-remove`
- `/playlist-view`

### Utility
- `/avatar`
- `/serverinfo`
- `/uptime`

### Developer
- `/eval`
- `/shards`

## Requirements
- Bun 1.2+ (recommended runtime)
- Node.js 18+
- Java 17+ (or compatible for Lavalink v4)
- Running Lavalink v4 node
- Discord bot token

## Installation

```bash
git clone https://github.com/koddyvx/Nexa-Music.git
cd Nexa-Music
bun install
```

Node fallback:

```bash
npm install
```

## Environment Setup

Create `.env` using `.env.example`:

```bash
cp .env.example .env
```

Minimum:

```env
TOKEN=your_discord_bot_token
```

Recommended optional values:
- Top.gg token/webhook values if using vote-gated commands
- Genius token for `/lyrics`
- Lavalink node credentials (via config/settings)

## Configure Bot
- Update bot/client settings in `src/settings/config.ts`.
- Confirm Lavalink host/port/password/secure values.
- Set developer IDs if using developer-only commands.

## Build And Run

```bash
bun run typecheck
bun run build
bun run start
```

For direct bot process without sharding manager:

```bash
bun run start:bot
```

Node fallback:

```bash
npm run typecheck
npm run build
npm run start:node
```

## Database Guide (SQLite + Drizzle)

### Files
- DB init: `src/storage/db.ts`
- Schema: `src/storage/schema.ts`
- Playlist operations: `src/storage/playlists.ts`
- Drizzle config: `drizzle.config.ts`

### Tables
- `playlists`
  - owner id
  - normalized name key
  - display name
  - created timestamp
- `playlist_tracks`
  - playlist id
  - title
  - uri
  - author
  - order index

### Storage Location
- `storage/nexa.sqlite`

### Drizzle Commands
```bash
npm run db:generate
npm run db:push
npm run db:studio
```

## Components V2 UI Guide
- All panel replies/messages are built with shared helpers in `src/utils/discord.ts`.
- Message flags include Components V2 support.
- Help and node panels use collectors and timeout lock behavior.

## Permissions Guide For Music
The bot should have at least:
- `ViewChannel`
- `SendMessages`
- `EmbedLinks`
- `Connect`
- `Speak`

Users should be in voice for commands that require `inVoice`/`sameVoice`.

## 24/7 System Guide
- Use `/247 mode:on` to enable 24/7 mode for the server.
- Use `/247 mode:off` to disable it.
- Use `/247 mode:status` to check current state.
- When enabled:
  - queue end will not disconnect the bot
  - empty-channel auto-leave is skipped
  - if voice disconnect happens, Nexa attempts auto-reconnect
- Setting is persisted per guild in SQLite table `guild_settings`.

## Node Auto-Reconnect Logic
- On `nodeDisconnect`, Nexa schedules auto-reconnect attempts.
- Retry interval: 5 seconds.
- Max attempts: 12.
- Success/failure is logged to console.

## Troubleshooting

### Bot does not start
- Check `.env` has valid `TOKEN`.
- Ensure dependencies are installed.
- Run `npm run typecheck` to detect compile issues.

### No audio / cannot join
- Verify Lavalink is online.
- Validate node credentials and port/secure settings.
- Confirm bot voice permissions in the target channel.

### Slash commands not appearing
- Confirm `clientid` in config is correct.
- Restart the bot after changes.
- Check command registration logs in console.

### Help panel or node controls stop responding
- This is expected after collector timeout.
- Re-run the command to open a fresh panel.

## Contribution Guide
- Fork the project.
- Create a feature branch.
- Keep TS strict checks passing.
- Submit a PR with clear change notes.

## Credits
Built by KoDdy and Razi under Infinity.
