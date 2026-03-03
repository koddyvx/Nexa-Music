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
      .setAccentColor(0xFF0000)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## Nexa Music")
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

          "### Bot Statistics\n" +
          `**Servers:** ${guilds}\n` +
          `**Users:** ${users}\n` +
          `**Active Players:** ${players}\n` +
          `**Connected Nodes:** ${nodes}\n\n` +

          "### ⚙️ System Information\n" +
          `**Uptime:** ${days}d ${hours}h ${minutes}m\n` +
          `**Ping:** ${client.ws.ping}ms\n` +
          `**Node.js:** ${process.version}\n\n` +

          "Built with ❤️ by Infinity."
        )
      );

    return interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};