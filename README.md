## Nexa Music

Nexa Music is a high-performance, modern Discord music bot built with scalability, stability, and clean design in mind.  
It is powered by Lavalink v4 and Riffy, delivering reliable audio streaming with an optimized Components V2 interface.

---

## Information

**Developed By:** KoDdy & Razi  
**Project Organization:** Infinity  
**Official Support Server:** https://discord.gg/fbu64BmPFD  

Nexa Music is an open-source project. You are free to use, modify, and distribute it under its respective license.

---

## Core Architecture

Nexa Music is built using:

- Riffy (Lavalink wrapper)
- Lavalink v4 (Audio processing node)
- Discord.js (Slash command interactions)
- Components V2 (Modern structured UI system)
- SQLite + Drizzle ORM (persistent playlist storage)
- Environment Variable Configuration (.env)

The bot follows a modular command structure to ensure maintainability and scalability.

---

## Main Features

- Uses Riffy for stable and efficient Lavalink communication
- Fully compatible with Lavalink v4
- Slash command based interaction system
- Prefix command system planned for future releases
- Modern Components V2 user interface
- Structured and consistent response formatting
- Improved error handling system
- Optimized queue management
- Live lyrics support
- Node statistics monitoring
- Advanced uptime and system statistics display
- Performance-focused architecture
- Clean and minimal red-themed design
- Environment-based configuration system
- Continuous development and updates

---

## Supported Audio Platforms

Nexa Music supports multiple streaming sources through Lavalink and LavaSrc plugins.

### Native Support
- YouTube
- YouTube Music
- SoundCloud

### Via LavaSrc Plugin
- Apple Music
- Deezer
- Spotify

Additional platforms may be supported depending on Lavalink configuration.

---

## System Requirements

Before installing Nexa Music, ensure your environment meets the following requirements:

### Required Software

- Node.js v18 or higher
- Java v18 or higher (required for Lavalink)
- Lavalink v4
- Discord Bot Token
- SQLite (bundled via `better-sqlite3`) for local playlist storage

### Helpful Setup Guides

Discord Bot Application Setup  
https://discordjs.guide/preparations/setting-up-a-bot-application.html

Lavalink Setup Guide  
https://lavalink.dev/

---

## Installation Guide

Follow these steps to install Nexa Music locally.

### Step 1 — Clone the Repository

```bash
git clone https://github.com/koddyvx/Nexa-Music.git
```

### Step 2 — Navigate to the Project Directory

```bash
cd Nexa-Music
```

### Step 3 — Install Dependencies

```bash
npm install
```

---

## Environment Configuration (.env Setup)

Nexa Music uses environment variables for secure configuration.

A file named `.env.example` is included in the repository.

### Step 4 — Create Your .env File

Rename or copy the example file:

```bash
cp .env.example .env
```

Open the `.env` file and add your bot token:

```
TOKEN=your_discord_bot_token_here
```

Replace `your_discord_bot_token_here` with your actual Discord bot token.

Important:
- Never share your `.env` file publicly.
- Do not commit `.env` to GitHub.
- Make sure `.env` is included in your `.gitignore`.

This method keeps your bot credentials secure and prevents accidental leaks.

---

## Optional Configuration

If using additional features:

- Add Genius token for lyrics support
- Configure Lavalink node credentials
- Configure SQLite storage path and filesystem permissions (if needed)

Ensure all required values are properly set before starting the bot.

---

## Step 5 — Start the Bot

```bash
node .
```

If everything is configured correctly, the bot will log in and connect to your Lavalink node.

---

## Project Structure Overview

The bot follows a modular architecture:

- commands/
  - interaction/
  - music/
  - utility/
- events/
- handlers/
- config.js
- index.js
- .env.example

This structure ensures easy scalability, maintainability, and clean separation of logic.

---

## Release Highlights (v1.5.0)

- Full migration to Components V2
- Modern red-themed interface
- Improved command consistency
- Advanced error handling
- Enhanced statistics system
- Live lyrics integration
- Node monitoring improvements
- Secure environment variable configuration

---

## Support and Contributions

If you encounter any issues:

- Join the official support server
- Open a GitHub issue
- Submit a pull request

Contributions are welcome.

---

## License

This project is open-source and intended for educational and production use.  
Please ensure compliance with Discord and platform Terms of Service when deploying.

---

Nexa Music continues to evolve with performance, clarity, security, and modern design at its core.
