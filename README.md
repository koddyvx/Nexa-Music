# 🎵 Nexa Music v2

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=E63946&height=220&section=header&text=Nexa%20Music%20v2&fontSize=52&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=TypeScript%20Discord%20Music%20Bot%20%7C%20Riffy%20%2B%20Lavalink%20v4%20%7C%20Components%20V2&descAlignY=60&descAlign=50" alt="Nexa Music v2 banner" />
</p>

<p align="center">
  <a href="https://github.com/koddyvx/Nexa-Music"><img src="https://img.shields.io/badge/Release-v2.0.0-E63946?style=for-the-badge" alt="Release v2.0.0" /></a>
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/Bun-1.2%2B-111111?style=for-the-badge&logo=bun&logoColor=white" alt="Bun 1.2+" /></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 18+" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.x" /></a>
  <a href="https://discord.js.org"><img src="https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="discord.js v14" /></a>
  <a href="https://lavalink.dev"><img src="https://img.shields.io/badge/Lavalink-v4-F77F00?style=for-the-badge" alt="Lavalink v4" /></a>
</p>

<p align="center">
  <a href="https://discord.gg/fbu64BmPFD"><img src="https://img.shields.io/badge/Support%20Server-Join%20Discord-5865F2?style=flat-square&logo=discord&logoColor=white" alt="Support server" /></a>
  <img src="https://img.shields.io/badge/UI-Components%20V2-C1121F?style=flat-square" alt="Components V2" />
  <img src="https://img.shields.io/badge/Storage-SQLite%20%2B%20Drizzle-2A9D8F?style=flat-square" alt="SQLite and Drizzle" />
  <img src="https://img.shields.io/badge/License-MIT-111111?style=flat-square" alt="MIT License" />
</p>

<p align="center">
  <b>🎧 Modern Discord music bot with typed architecture, polished music panels, playlist persistence, and production-ready Lavalink flow.</b>
</p>

## 🎼 Overview

Nexa Music v2 is a TypeScript Discord music bot built on `discord.js` v14, `riffy`, and Lavalink v4. It focuses on clean interaction design, stronger runtime safety, and a more scalable codebase than the older JavaScript builds.

This release introduces a full TypeScript migration, Components V2 panel helpers, SQLite persistence through Drizzle ORM, hybrid slash/prefix command support, and better node and playback state handling.

## ✨ What's New In v2

| Area | Highlights |
| --- | --- |
| 🎨 UI | Full Components V2 panel-based replies and richer playback messaging |
| 🧠 Type Safety | Full JS to TS migration with typed client, commands, events, and storage |
| 🎵 Playback | Track control buttons, improved autoplay logic, pause/resume sync, and queue flow cleanup |
| 💾 Persistence | SQLite storage for playlists and guild 24/7 settings |
| 🧩 Commands | Recursive command loading and hybrid prefix/slash support |
| 📊 Diagnostics | Improved node stats, health views, and collector timeout handling |
| 🔁 Reliability | Better reconnect handling and safer player state checks |

## 🛠️ Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=typescript,nodejs,bun,npm,sqlite,github" alt="Tech stack icons" />
</p>

| Layer | Tools |
| --- | --- |
| 💬 Bot Framework | `discord.js` v14 |
| 🎶 Audio Layer | `riffy` + Lavalink v4 |
| 🧠 Language | TypeScript |
| 🗄️ Storage | `better-sqlite3` + Drizzle ORM |
| 🎛️ UI System | Discord Components V2 |
| 🔐 Config | `dotenv` |
| 📈 Integrations | Top.gg SDK, Genius Lyrics API |
| 🧱 Architecture | Typed commands, events, handlers, storage, and utils |

## 🌍 Supported Music Sources

<p align="center">
  <img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="YouTube" />
  <img src="https://img.shields.io/badge/YouTube%20Music-FF0000?style=for-the-badge&logo=youtube-music&logoColor=white" alt="YouTube Music" />
  <img src="https://img.shields.io/badge/SoundCloud-FF7700?style=for-the-badge&logo=soundcloud&logoColor=white" alt="SoundCloud" />
  <img src="https://img.shields.io/badge/Spotify-Via%20LavaSrc-1DB954?style=for-the-badge&logo=spotify&logoColor=white" alt="Spotify" />
  <img src="https://img.shields.io/badge/Apple%20Music-Via%20LavaSrc-FA243C?style=for-the-badge&logo=apple-music&logoColor=white" alt="Apple Music" />
  <img src="https://img.shields.io/badge/Deezer-Via%20LavaSrc-A238FF?style=for-the-badge&logo=deezer&logoColor=white" alt="Deezer" />
</p>

Supported platforms depend on your Lavalink configuration and plugins.

## 🎹 Feature Set

### 🎵 Music

- `/play`, `/skip`, `/stop`, `/pause`, `/resume`, `/queue`, `/seek`, `/shuffle`
- Now playing panels with interactive control buttons
- Autoplay improvements and stronger current-track checks
- 24/7 mode with persisted guild settings

### 📚 Playlist

- `/playlist-create`
- `/playlist-add`
- `/playlist-load`
- `/playlist-view`
- `/playlist-remove`
- `/playlist-delete`

### 📊 Info + Utility

- `/help`
- `/node`
- `/ping`
- `/about`
- `/avatar`
- `/serverinfo`
- `/uptime`

### 🛡️ Developer

- `/eval`
- `/shards`

## 🧱 Project Structure

```txt
src/
  commands/
    hybrid/
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

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/koddyvx/Nexa-Music.git
cd Nexa-Music
```

### 2. Install dependencies

Recommended:

```bash
bun install
```

Node fallback:

```bash
npm install
```

### 3. Create your environment file

```bash
cp .env.example .env
```

Minimum:

```env
TOKEN=your_discord_bot_token
```

Optional:

- `TOPGG_TOKEN`
- vote webhook values if used
- Genius token for lyrics support

### 4. Configure the bot

Update [src/settings/config.ts]:

- `clientid`
- `prefix`
- Lavalink node `host`, `port`, `password`, and `secure`
- `developers`
- `geniusToken`

### 5. Build and run

```bash
bun run typecheck
bun run build
bun run start
```

Direct bot process:

```bash
bun run start:bot
```

Node fallback:

```bash
npm run typecheck
npm run build
npm run start:node
```

## ⚙️ Requirements

| Requirement | Version |
| --- | --- |
| 🎧 Bun | 1.2+ recommended |
| 🟢 Node.js | 18+ |
| ☕ Java | 17+ recommended for Lavalink |
| 🎛️ Lavalink | v4 |
| 🤖 Discord Bot | Valid token and application setup |

## 💾 Database Guide

| Item | Path |
| --- | --- |
| DB Init | `src/storage/db.ts` |
| Schema | `src/storage/schema.ts` |
| Playlists | `src/storage/playlists.ts` |
| Guild Settings | `src/storage/guildSettings.ts` |
| Config | `drizzle.config.ts` |
| SQLite File | `storage/nexa.sqlite` |

Drizzle commands:

```bash
npm run db:generate
npm run db:push
npm run db:studio
```

## 🎛️ Components V2 UI

- Shared panel helpers live in `src/utils/discord.ts`
- Help and node commands use collectors with timeout lock behavior
- Playback responses are standardized around the same panel system

## 🔁 24/7 + Reconnect Notes

- `/247 mode:on` enables persistent 24/7 mode per guild
- Queue end will not disconnect when 24/7 is enabled
- Voice disconnects can trigger reconnect handling
- Node disconnects retry automatically with logged status

## 📦 Release Notes

### `v2.0.0`

- 🎵 Full TypeScript migration
- 🎨 Advanced Components V2 UI flow
- 💾 SQLite + Drizzle playlist persistence
- 🧩 Hybrid prefix/slash command structure
- 📊 Stronger node diagnostics and player state handling
- 🔒 Better permission and interaction guards

See [MIGRATION.md](/media/razi/840AA8230AA813E8/RAZI ALL FILES/RAZI EFX GAMEFILES AND CLEOS VC/ALL PROJECTS/Discord Bots/Nexa-Music/MIGRATION.md) for upgrade guidance.

## 🤝 Support

- Discord: https://discord.gg/fbu64BmPFD
- Open an issue on GitHub
- Submit a PR with clear change notes

## 📚 Useful Links

- Discord bot setup: https://discordjs.guide/preparations/setting-up-a-bot-application.html
- Lavalink docs: https://lavalink.dev/
- Riffy package: https://www.npmjs.com/package/riffy

## 📄 License

This project is licensed under MIT. Please follow Discord and streaming platform terms when deploying publicly.

<p align="center">
  <b>🎶 Built by KoDdy and Razi under Infinity.</b>
</p>
