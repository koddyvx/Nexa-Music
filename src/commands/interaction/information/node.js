const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags
} = require("discord.js");

module.exports = {
  name: "node",
  description: "Check Lavalink node statistics",

  run: async (client, interaction) => {
    const ms = (await import("pretty-ms")).default;

    try {
      let nodes = [];

      if (client.riffy) {
        nodes = Array.from(client.riffy.nodes.values());
      }

      if (!nodes.length) {
        const noNodes = new ContainerBuilder()
          .setAccentColor(0xff0000)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent("### No Lavalink Nodes Found")
          )
          .addSeparatorComponents(
            new SeparatorBuilder()
              .setDivider(true)
              .setSpacing(SeparatorSpacingSize.Small)
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              "There are currently no connected Lavalink nodes."
            )
          );

        return interaction.reply({
          components: [noNodes],
          flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
        });
      }

      const formatMB = (bytes) =>
        ((bytes ?? 0) / 1024 / 1024).toFixed(2);

      const formatPercent = (value) =>
        ((value ?? 0) * 100).toFixed(2);

      const generateContainer = (node, index) => {
        const identifier =
          node.name ||
          node.info?.identifier ||
          `Node ${index + 1}`;

        const online = node.isConnected
          ? "🟢 Online"
          : "🔴 Offline";

        const ping = node.ping
          ? `${node.ping}ms`
          : "N/A";

        const stats = node.stats || {};

        const players = stats.players ?? 0;
        const playing = stats.playingPlayers ?? 0;
        const uptime = stats.uptime
          ? ms(stats.uptime, { verbose: true })
          : "Unknown";

        const memory = stats.memory || {};
        const cpu = stats.cpu || {};

        return new ContainerBuilder()
          .setAccentColor(
            node.isConnected
              ? client.config?.color || 0x00ff00
              : 0xff0000
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `## ${identifier}`
            )
          )
          .addSeparatorComponents(
            new SeparatorBuilder()
              .setDivider(true)
              .setSpacing(SeparatorSpacingSize.Small)
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `**Status:** ${online}\n` +
                `**Ping:** \`${ping}\`\n\n` +
                `### Player Statistics\n` +
                `Players: ${players}\n` +
                `Playing: ${playing}\n` +
                `Uptime: ${uptime}\n\n` +
                `### CPU Information\n` +
                `Cores: ${cpu.cores ?? "N/A"}\n` +
                `System Load: ${formatPercent(cpu.systemLoad)}%\n` +
                `Lavalink Load: ${formatPercent(cpu.lavalinkLoad)}%\n\n` +
                `### Memory Usage\n` +
                `Used: ${formatMB(memory.used)} MB\n` +
                `Free: ${formatMB(memory.free)} MB\n` +
                `Allocated: ${formatMB(memory.allocated)} MB\n` +
                `Reservable: ${formatMB(memory.reservable)} MB`
            )
          );
      };

      let currentPage = 0;
      const maxPages = nodes.length;

      const getButtons = (page) =>
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("prev")
            .setLabel("◀️ Previous")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 0),
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Next ▶️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === maxPages - 1),
          new ButtonBuilder()
            .setCustomId("refresh")
            .setLabel("🔄 Refresh")
            .setStyle(ButtonStyle.Secondary)
        );

      const response = await interaction.reply({
        components: [generateContainer(nodes[currentPage], currentPage)],
        componentsV2: true,
        components: [generateContainer(nodes[currentPage], currentPage)],
        flags: MessageFlags.IsComponentsV2,
        fetchReply: true,
      });

      await response.edit({
        components: [
          generateContainer(nodes[currentPage], currentPage),
          getButtons(currentPage),
        ],
      });

      const collector = response.createMessageComponentCollector({
        time: 300000,
      });

      collector.on("collect", async (buttonInteraction) => {
        if (buttonInteraction.user.id !== interaction.user.id) {
          return buttonInteraction.reply({
            content: "You cannot use these buttons.",
            ephemeral: true,
          });
        }

        if (buttonInteraction.customId === "prev") {
          currentPage = Math.max(0, currentPage - 1);
        } else if (buttonInteraction.customId === "next") {
          currentPage = Math.min(
            maxPages - 1,
            currentPage + 1
          );
        } else if (buttonInteraction.customId === "refresh") {
          nodes = Array.from(client.riffy.nodes.values());
        }

        await buttonInteraction.update({
          components: [
            generateContainer(nodes[currentPage], currentPage),
            getButtons(currentPage),
          ],
        });
      });

      collector.on("end", () => {
        const disabledRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("prev")
            .setLabel("◀️ Previous")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Next ▶️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("refresh")
            .setLabel("🔄 Refresh")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
        );

        response.edit({
          components: [
            generateContainer(nodes[currentPage], currentPage),
            disabledRow,
          ],
        }).catch(() => {});
      });

    } catch (error) {
      console.error("Error in node command:", error);

      const errorContainer = new ContainerBuilder()
        .setAccentColor(0xff0000)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("### Error")
        )
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `An error occurred while fetching node statistics.\n\n\`\`\`js\n${error.message}\n\`\`\``
          )
        );

      return interaction.reply({
        components: [errorContainer],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
      });
    }
  },
};