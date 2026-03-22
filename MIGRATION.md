# Migration Guide

## Upgrading To v2.0.0

This release is the formal v2 cut of Nexa Music. It introduces a TypeScript codebase, Components V2 UI helpers, SQLite persistence, and updated playback/state management.

## Breaking Changes

### Runtime expectations
- Bun is now the recommended runtime.
- Node.js fallback is still supported, but use Node.js 18 or newer.
- Lavalink v4 is required.
- Java 17 or newer is recommended for Lavalink hosts.

### Project layout
- Source now lives under `src/` and is compiled to `dist/`.
- Commands are loaded recursively from `src/commands`.
- Hybrid command files can expose both slash and prefix behaviors from one module.

### Storage changes
- SQLite is now the default persistent store.
- Drizzle ORM manages the schema and queries.
- The default database file is `storage/nexa.sqlite`.

### UI changes
- Reply panels use Discord Components V2 helpers from `src/utils/discord.ts`.
- Interactive help/node views now rely on component collectors and disable controls after timeout.

## Required Upgrade Steps

1. Install dependencies again so TypeScript, Drizzle, and the current runtime packages are present.
2. Verify your `.env` file and copy any missing keys from `.env.example`.
3. Review `src/settings/config.ts` and update:
   - `clientid`
   - `prefix`
   - Lavalink node `host`, `port`, `password`, and `secure`
   - `developers`
   - `geniusToken` if lyrics are used
4. Build the bot before first launch:

```bash
bun run typecheck
bun run build
```

5. Start the bot with one of the supported entrypoints:

```bash
bun run start
```

Or:

```bash
npm run start:node
```

## Database Migration Notes

- Existing deployments should preserve the `storage/` directory.
- Playlists and guild 24/7 settings now persist in SQLite.
- If you are setting up from scratch, the database file will be created on first use.
- If you change schema definitions later, use:

```bash
npm run db:generate
npm run db:push
```

## Command Migration Notes

- Older command loaders that assumed only `src/commands/interaction` should be updated to the recursive loader.
- Prefix support is now driven by the slash command metadata plus the prefix adapter.
- The example hybrid command lives at `src/commands/hybrid/nexa.ts`.

## Behavior Changes Worth Noting

- Pause and resume now explicitly synchronize local player flags after button and slash interactions.
- Autoplay recovery now avoids false restarts when a current track reference still exists.
- Track start replaces the previous control message to keep one active playback panel.
- Node diagnostics safely handle empty node states after refresh.

## Recommended Release Checklist

1. Run `bun run typecheck`.
2. Run `bun run build`.
3. Verify `.env` and Lavalink settings.
4. Test at least `/play`, `/pause`, `/resume`, `/queue`, `/247`, and `/node`.
5. Deploy the built `dist/` output together with the updated `storage/` path expectations.
