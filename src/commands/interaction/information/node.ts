import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { panelEdit, panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";
import type { RiffyNode } from "riffy";

function describeNode(node: RiffyNode, index: number): string[] {
  const memory = node.stats?.memory;
  const cpu = node.stats?.cpu;

  return [
    `Node: ${node.name ?? node.info?.identifier ?? `Node ${index + 1}`}`,
    `Status: ${node.isConnected ? "Connected" : "Disconnected"}`,
    `Ping: ${node.ping ? `${node.ping}ms` : "Unavailable"}`,
    `Players: ${node.stats?.players ?? 0}`,
    `Playing players: ${node.stats?.playingPlayers ?? 0}`,
    `Uptime: ${node.stats?.uptime ? `${Math.floor(node.stats.uptime / 1000)}s` : "Unavailable"}`,
    `CPU cores: ${cpu?.cores ?? "Unavailable"}`,
    `System load: ${(((cpu?.systemLoad ?? 0) as number) * 100).toFixed(2)}%`,
    `Lavalink load: ${(((cpu?.lavalinkLoad ?? 0) as number) * 100).toFixed(2)}%`,
    `Memory used: ${(((memory?.used ?? 0) as number) / 1024 / 1024).toFixed(2)} MB`,
    `Memory free: ${(((memory?.free ?? 0) as number) / 1024 / 1024).toFixed(2)} MB`,
  ];
}

function navigation(page: number, pages: number): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("node_prev").setLabel("Previous").setStyle(ButtonStyle.Secondary).setDisabled(page === 0),
    new ButtonBuilder().setCustomId("node_next").setLabel("Next").setStyle(ButtonStyle.Secondary).setDisabled(page === pages - 1),
    new ButtonBuilder().setCustomId("node_refresh").setLabel("Refresh").setStyle(ButtonStyle.Primary),
  );
}

function disabledNavigation(page: number, pages: number): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("node_prev").setLabel("Previous").setStyle(ButtonStyle.Secondary).setDisabled(true),
    new ButtonBuilder().setCustomId("node_next").setLabel("Next").setStyle(ButtonStyle.Secondary).setDisabled(true),
    new ButtonBuilder().setCustomId("node_refresh").setLabel("Refresh").setStyle(ButtonStyle.Primary).setDisabled(true),
  );
}

const command: SlashCommand = {
  name: "node",
  description: "Inspect Lavalink node health and load.",

  async run(client, interaction) {
    let nodes = Array.from(client.riffy.nodes.values());

    if (nodes.length === 0) {
      await interaction.reply(panelReply({
        ephemeral: true,
        panel: {
          eyebrow: "Nexa Music",
          title: "No nodes available",
          description: "There are no Lavalink nodes connected right now.",
        },
      }));
      return;
    }

    let page = 0;
    const render = (locked = false) => panelEdit({
      panel: {
        eyebrow: "Nexa Music",
        title: `Node diagnostics ${page + 1}/${nodes.length}`,
        lines: nodes[page] ? describeNode(nodes[page], page) : ["Node data is unavailable. Press refresh."],
      },
      components: [locked ? disabledNavigation(page, nodes.length) : navigation(page, nodes.length)],
    });

    const response = await interaction.reply({
      ...panelReply({
        panel: {
          eyebrow: "Nexa Music",
          title: `Node diagnostics ${page + 1}/${nodes.length}`,
          lines: nodes[page] ? describeNode(nodes[page], page) : ["Node data is unavailable. Press refresh."],
        },
        components: [navigation(page, nodes.length)],
      }),
      fetchReply: true,
    });

    const collector = response.createMessageComponentCollector({ time: 120_000 });

    collector.on("collect", async (buttonInteraction) => {
      if (!buttonInteraction.isButton()) {
        return;
      }

      if (buttonInteraction.user.id !== interaction.user.id) {
        await buttonInteraction.reply(panelReply({
          ephemeral: true,
          panel: {
            eyebrow: "Restricted",
            title: "This control is locked",
            description: "Only the user who opened this panel can use it.",
          },
        }));
        return;
      }

      if (buttonInteraction.customId === "node_prev") {
        page = Math.max(0, page - 1);
      }

      if (buttonInteraction.customId === "node_next") {
        page = Math.min(nodes.length - 1, page + 1);
      }

      if (buttonInteraction.customId === "node_refresh") {
        nodes = Array.from(client.riffy.nodes.values());
        if (nodes.length === 0) {
          await buttonInteraction.update(panelEdit({
            panel: {
              eyebrow: "Nexa Music",
              title: "No nodes available",
              description: "There are no Lavalink nodes connected right now.",
            },
            components: [disabledNavigation(0, 1)],
          }));
          collector.stop("no_nodes");
          return;
        }

        page = Math.min(page, Math.max(nodes.length - 1, 0));
      }

      await buttonInteraction.update(render(false));
    });

    collector.on("end", async () => {
      await response.edit(render(true)).catch(() => undefined);
    });
  },
};

export default command;
