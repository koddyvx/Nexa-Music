const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require("discord.js");

module.exports = {
  name: "about",
  description: "View information and statistics about Nexa Music.",

  run: async (client, interaction) => {

    const guilds = client.guilds.cache.size;
    const users = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

    const players = client.riffy?.players?.size || 0;
    const nodes = client.riffy
      ? Array.from(client.riffy.nodes.values()).filter(n => n.isConnected).length
      : 0;

    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    const container = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("### About Nexa")
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          "**High Performance Discord Music Bot**\n" +
          "Powered by Lavalink & Modern Components V2\n\n" +

          "**Features**\n" +
          "• Crystal Clear Audio: High-quality music playback with support for multiple streaming platforms\n" +
          "• 24/7 Playback: Never stop the music with continuous playback capability\n" +
          "• Queue Management: Advanced queue controls including shuffle, loop, and track removal\n" +
          "• Smart Filters: Apply audio filters like bass boost, nightcore, and speed changes\n" +
          "• Playlist Support: Import and play entire playlists from various sources\n" +
          "• Equalizer Presets: Pre-configured EQ settings for different music genres\n" +
          "• Fast Response: Powered by Lavalink for minimal latency and smooth streaming\n" +
          "• Reliable Infrastructure: Built on Discord's Components V2 for enhanced stability\n\n" +

          "**Statistics**\n" +
          `Servers: ${guilds}\n` +
          `Users: ${users}\n` +
          `Active Players: ${players}\n` +
          `Connected Nodes: ${nodes}\n\n` +

          "**System Information**\n" +
          `Uptime: ${days}d ${hours}h ${minutes}m\n` +
          `Ping: ${client.ws.ping}ms\n` +
          `Node.js: ${process.version}\n` +
          `Discord.js: v14\n\n` +

          "**Development**\n" +
          "Built with ❤️ by Infinity. For support and updates, visit our support server."
        )
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          "Use /help to explore all available commands."
        )
      );

    return interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};