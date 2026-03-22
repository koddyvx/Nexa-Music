/**
 * Project: Nexa Music
 * Author: KoDdy, Razi
 * Organization: Infinity
 *
 * This project is open-source and free to use, modify, and distribute.
 * If you encounter any issues, errors, or have questions,
 * please contact us through the official support server:
 * https://discord.gg/fbu64BmPFD
 */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";
import { buildPanel, panelReply } from "@/utils/discord";
import type { NexaClient, SlashCommand } from "@/types";
import type { RiffyNode } from "riffy";

type RuntimeNode = RiffyNode & {
  connected?: boolean;
  sessionId?: string | null;
  restUrl?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  lastStats?: number;
};

function getNodes(client: NexaClient): RuntimeNode[] {
  const riffyWithNodeMap = client.riffy as typeof client.riffy & {
    nodeMap?: Map<string, RuntimeNode>;
  };

  if (riffyWithNodeMap.nodeMap) {
    return Array.from(riffyWithNodeMap.nodeMap.values());
  }

  return Array.from(client.riffy.nodes.values()) as RuntimeNode[];
}

function describeNode(node: RuntimeNode, index: number): string[] {
  const memory = node.stats?.memory;
  const cpu = node.stats?.cpu;
  const isConnected = node.connected ?? node.isConnected ?? false;
  const ping = typeof node.ping === "number" && node.ping >= 0 ? `${node.ping}ms` : "Unavailable";
  const lastStatsAgeMs = typeof node.lastStats === "number" ? Date.now() - node.lastStats : undefined;
  const statsFreshness = typeof lastStatsAgeMs === "number" ? `${Math.max(0, Math.floor(lastStatsAgeMs / 1000))}s ago` : "Unavailable";
  const endpoint = node.restUrl ?? (node.host ? `${node.secure ? "https" : "http"}://${node.host}:${node.port ?? 2333}` : "Unavailable");

  return [
    `Node: ${node.name ?? node.info?.identifier ?? `Node ${index + 1}`}`,
    `Status: ${isConnected ? "Connected" : "Disconnected"}`,
    `Session: ${node.sessionId ?? "Unavailable"}`,
    `Endpoint: ${endpoint}`,
    `Ping: ${ping}`,
    `Players: ${node.stats?.players ?? 0}`,
    `Playing players: ${node.stats?.playingPlayers ?? 0}`,
    `Uptime: ${node.stats?.uptime ? `${Math.floor(node.stats.uptime / 1000)}s` : "Unavailable"}`,
    `Stats updated: ${statsFreshness}`,
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

function disabledNavigation(): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("node_prev").setLabel("Previous").setStyle(ButtonStyle.Secondary).setDisabled(true),
    new ButtonBuilder().setCustomId("node_next").setLabel("Next").setStyle(ButtonStyle.Secondary).setDisabled(true),
    new ButtonBuilder().setCustomId("node_refresh").setLabel("Refresh").setStyle(ButtonStyle.Primary).setDisabled(true),
  );
}

function renderNodeComponents(nodes: RuntimeNode[], page: number, locked = false) {
  const panel = buildPanel({
    eyebrow: "Nexa Music",
    title: `Node diagnostics ${page + 1}/${nodes.length}`,
    lines: nodes[page] ? describeNode(nodes[page], page) : ["Node data is unavailable. Press refresh."],
  });

  panel.addActionRowComponents(locked ? disabledNavigation() : navigation(page, nodes.length));
  return [panel] as any;
}

const command: SlashCommand = {
  name: "node",
  description: "Inspect Lavalink node health and load.",

  async run(client, interaction) {
    let nodes = getNodes(client);

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
    const render = (locked = false) => ({
      flags: MessageFlags.IsComponentsV2 as const,
      components: renderNodeComponents(nodes, page, locked),
    });

    await interaction.reply({
      ...panelReply({
        panel: {
          eyebrow: "Nexa Music",
          title: `Node diagnostics ${page + 1}/${nodes.length}`,
          lines: nodes[page] ? describeNode(nodes[page], page) : ["Node data is unavailable. Press refresh."],
        },
      }),
      components: renderNodeComponents(nodes, page, false),
    });
    const response = await interaction.fetchReply();

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
        nodes = getNodes(client);
        if (nodes.length === 0) {
          const panel = buildPanel({
            eyebrow: "Nexa Music",
            title: "No nodes available",
            description: "There are no Lavalink nodes connected right now.",
          });
          panel.addActionRowComponents(disabledNavigation());
          await buttonInteraction.update({
            flags: MessageFlags.IsComponentsV2 as const,
            components: [panel] as any,
          });
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
