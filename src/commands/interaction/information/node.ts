import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import prettyMs from "pretty-ms";
import { createEmbed } from "@/utils/discord";
import type { SlashCommand } from "@/types";
import type { RiffyNode } from "riffy";

function formatNode(node: RiffyNode, index: number): string {
  const identifier = node.name ?? node.info?.identifier ?? `Node ${index + 1}`;
  const status = node.isConnected ? "Online" : "Offline";
  const ping = node.ping ? `${node.ping}ms` : "N/A";
  const stats = node.stats;
  const memory = stats?.memory;
  const cpu = stats?.cpu;

  return [
    `Identifier: ${identifier}`,
    `Status: ${status}`,
    `Ping: ${ping}`,
    "",
    `Players: ${stats?.players ?? 0}`,
    `Playing: ${stats?.playingPlayers ?? 0}`,
    `Uptime: ${stats?.uptime ? prettyMs(stats.uptime, { verbose: true }) : "Unknown"}`,
    "",
    `CPU cores: ${cpu?.cores ?? "N/A"}`,
    `System load: ${(((cpu?.systemLoad ?? 0) as number) * 100).toFixed(2)}%`,
    `Lavalink load: ${(((cpu?.lavalinkLoad ?? 0) as number) * 100).toFixed(2)}%`,
    "",
    `Memory used: ${(((memory?.used ?? 0) as number) / 1024 / 1024).toFixed(2)} MB`,
    `Memory free: ${(((memory?.free ?? 0) as number) / 1024 / 1024).toFixed(2)} MB`,
    `Memory allocated: ${(((memory?.allocated ?? 0) as number) / 1024 / 1024).toFixed(2)} MB`,
    `Memory reservable: ${(((memory?.reservable ?? 0) as number) / 1024 / 1024).toFixed(2)} MB`,
  ].join("\n");
}

function nodeButtons(page: number, maxPages: number): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("prev").setLabel("Previous").setStyle(ButtonStyle.Primary).setDisabled(page === 0),
    new ButtonBuilder().setCustomId("next").setLabel("Next").setStyle(ButtonStyle.Primary).setDisabled(page === maxPages - 1),
    new ButtonBuilder().setCustomId("refresh").setLabel("Refresh").setStyle(ButtonStyle.Secondary),
  );
}

const command: SlashCommand = {
  name: "node",
  description: "Check Lavalink node statistics",

  async run(client, interaction) {
    let nodes = Array.from(client.riffy.nodes.values());

    if (nodes.length === 0) {
      await interaction.reply({
        embeds: [createEmbed(client, "No Lavalink Nodes", "There are currently no Lavalink nodes available.", "Red")],
        ephemeral: true,
      });
      return;
    }

    let currentPage = 0;
    const render = () =>
      createEmbed(client, `Lavalink Node ${currentPage + 1}/${nodes.length}`, formatNode(nodes[currentPage], currentPage));

    const response = await interaction.reply({
      embeds: [render()],
      components: [nodeButtons(currentPage, nodes.length)],
      fetchReply: true,
    });

    const collector = response.createMessageComponentCollector({ time: 300_000 });

    collector.on("collect", async (buttonInteraction) => {
      if (!buttonInteraction.isButton()) {
        return;
      }

      if (buttonInteraction.user.id !== interaction.user.id) {
        await buttonInteraction.reply({ content: "These buttons are not for you.", ephemeral: true });
        return;
      }

      if (buttonInteraction.customId === "prev") {
        currentPage = Math.max(0, currentPage - 1);
      } else if (buttonInteraction.customId === "next") {
        currentPage = Math.min(nodes.length - 1, currentPage + 1);
      } else if (buttonInteraction.customId === "refresh") {
        nodes = Array.from(client.riffy.nodes.values());
        currentPage = Math.min(currentPage, Math.max(0, nodes.length - 1));
      }

      await buttonInteraction.update({
        embeds: [render()],
        components: [nodeButtons(currentPage, nodes.length)],
      });
    });

    collector.on("end", async () => {
      await response.edit({
        embeds: [render()],
        components: [new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId("prev_disabled").setLabel("Previous").setStyle(ButtonStyle.Primary).setDisabled(true),
          new ButtonBuilder().setCustomId("next_disabled").setLabel("Next").setStyle(ButtonStyle.Primary).setDisabled(true),
          new ButtonBuilder().setCustomId("refresh_disabled").setLabel("Refresh").setStyle(ButtonStyle.Secondary).setDisabled(true),
        )],
      }).catch(() => undefined);
    });
  },
};

export default command;
