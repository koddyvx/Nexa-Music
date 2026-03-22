# 🎵 Nexa Music

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=E63946&height=220&section=header&text=Nexa%20Music&fontSize=54&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Modern%20Discord%20Music%20Bot%20Powered%20by%20Riffy%20%2B%20Lavalink&descAlignY=60&descAlign=50" alt="Nexa Music banner" />
</p>

<p align="center">
  <a href="https://github.com/koddyvx/Nexa-Music"><img src="https://img.shields.io/badge/Version-1.5.0-E63946?style=for-the-badge" alt="Version 1.5.0" /></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 18+" /></a>
  <a href="https://discord.js.org"><img src="https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="discord.js v14" /></a>
  <a href="https://www.npmjs.com/package/riffy"><img src="https://img.shields.io/badge/Riffy-1.0.12-FF6B6B?style=for-the-badge" alt="Riffy 1.0.12" /></a>
  <a href="https://lavalink.dev"><img src="https://img.shields.io/badge/Lavalink-v4-F77F00?style=for-the-badge" alt="Lavalink v4" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-111111?style=for-the-badge" alt="MIT License" /></a>
</p>

<p align="center">
  <a href="https://discord.gg/fbu64BmPFD"><img src="https://img.shields.io/badge/Support%20Server-Join%20Discord-5865F2?style=flat-square&logo=discord&logoColor=white" alt="Support Server" /></a>
  <img src="https://img.shields.io/badge/Status-Active%20Development-E63946?style=flat-square" alt="Active Development" />
  <img src="https://img.shields.io/badge/Theme-Music%20%26%20Components%20V2-C1121F?style=flat-square" alt="Music and Components V2" />
</p>

<p align="center">
  <b>🎧 A modern Discord music bot focused on stable playback, clean interactions, and a polished user experience.</b>
</p>

## 🎼 Overview

Nexa Music is a modular Discord music bot built for servers that want fast command handling, clean Components V2 responses, and dependable Lavalink playback. It uses `discord.js` and `riffy` to keep the bot side simple while Lavalink handles the heavy audio work.

This project is designed for people who want a bot that feels organized, scalable, and ready to keep growing.

## ✨ Highlights

| Feature | Details |
| --- | --- |
| 🎵 Music Playback | Stream music through Lavalink v4 with a stable queue-driven system |
| 🧩 Modern UI | Built around Discord Components V2 for cleaner replies |
| ⚡ Slash Commands | Fast command interaction flow using Discord interactions |
| 📝 Lyrics Support | Optional Genius lyrics integration |
| 📊 Stats Commands | Uptime, node info, and bot diagnostics |
| 🧠 Modular Structure | Easy to maintain and expand project layout |
| 🔒 Env-Based Config | Secure token handling via `.env` |
| 🚀 Performance Focus | Clean architecture with future scaling in mind |

## 🛠️ Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,npm,github" alt="Core tools" />
</p>

| Layer | Tools |
| --- | --- |
| 💬 Bot Framework | `discord.js` v14 |
| 🎶 Audio Layer | `riffy` + Lavalink v4 |
| 🎨 UI | Discord Components V2 |
| 🔐 Config | `dotenv` |
| 📝 Extra Features | `genius-lyrics-api`, `pretty-ms` |
| 🧱 Structure | Commands, events, handlers, utils |

## 🌍 Supported Music Sources

<p align="center">
  <img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="YouTube" />
  <img src="https://img.shields.io/badge/YouTube%20Music-FF0000?style=for-the-badge&logo=youtube-music&logoColor=white" alt="YouTube Music" />
  <img src="https://img.shields.io/badge/SoundCloud-FF7700?style=for-the-badge&logo=soundcloud&logoColor=white" alt="SoundCloud" />
  <img src="https://img.shields.io/badge/Spotify-Via%20LavaSrc-1DB954?style=for-the-badge&logo=spotify&logoColor=white" alt="Spotify via LavaSrc" />
  <img src="https://img.shields.io/badge/Apple%20Music-Via%20LavaSrc-FA243C?style=for-the-badge&logo=apple-music&logoColor=white" alt="Apple Music via LavaSrc" />
  <img src="https://img.shields.io/badge/Deezer-Via%20LavaSrc-A238FF?style=for-the-badge&logo=deezer&logoColor=white" alt="Deezer via LavaSrc" />
</p>

Supported platforms depend on your Lavalink setup and installed plugins.

## 🧱 Architecture

```txt
Nexa-Music/
├── src/
│   ├── commands/
│   │   ├── interaction/
│   │   ├── music/
│   │   └── utility/
│   ├── events/
│   ├── handlers/
│   ├── utils/
│   └── index.js
├── .env.example
├── package.json
└── README.md
```

### 🎚️ Design Goals

- Keep command logic easy to read and easy to expand
- Separate handlers, events, and command modules cleanly
- Use modern Discord components instead of messy text-heavy replies
- Keep configuration secure and deployment-friendly

## 🚀 Quick Start

### 1. Clone the project

```bash
git clone https://github.com/koddyvx/Nexa-Music.git
cd Nexa-Music
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Minimum required:

```env
TOKEN=your_discord_bot_token_here
```

Optional extras:

- `TOPGG_TOKEN` for Top.gg integrations
- `GENIUS` related values if lyrics support is extended later
- Lavalink connection values in your config files

### 4. Start the bot

```bash
node .
```

## ⚙️ Requirements

| Requirement | Version |
| --- | --- |
| 🟢 Node.js | 18 or newer |
| ☕ Java | 17 or newer recommended for Lavalink |
| 🎛️ Lavalink | v4 |
| 🤖 Discord Bot | Valid token and configured application |

## 🎹 Feature Breakdown

### 🎵 Music

- Play tracks with Lavalink-powered playback
- Queue management and organized reply panels
- Clean interaction-driven command flow

### 🧾 Information

- Bot statistics and uptime information
- Node monitoring and diagnostics commands
- Better visibility into bot health

### 🎤 Extra Utilities

- Lyrics support through Genius
- Structured error handling and cleaner command responses
- Extendable architecture for future commands

## 📦 Release Highlights

### `v1.5.0`

- 🎨 Full Components V2 UI direction
- 🎵 Improved music interaction experience
- ⚙️ Better command consistency
- 📊 Improved stats and diagnostics
- 🔐 Safer environment-based configuration

## 📷 Visual Style

Nexa Music aims for a bold music-bot identity:

- ❤️ Strong red branding
- 🎛️ Structured interface panels
- 🎧 Music-first UX language
- ✨ Cleaner, more premium presentation than plain command dumps

## 🤝 Support

If you run into issues or want to contribute:

- Join the support server: https://discord.gg/fbu64BmPFD
- Open an issue on GitHub
- Submit a pull request with clear notes

## 📚 Helpful Links

- Discord bot setup guide: https://discordjs.guide/preparations/setting-up-a-bot-application.html
- Lavalink docs: https://lavalink.dev/
- Riffy package: https://www.npmjs.com/package/riffy

## 📄 License

This project is open source under the MIT License. Please follow Discord and music platform terms when deploying publicly.

<p align="center">
  <b>🎶 Built by KoDdy and Razi under Infinity.</b>
</p>
