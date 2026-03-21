import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import { createEmbed } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "help",
  description: "Display all Nexa Music commands.",

  async run(client, interaction) {
    const commands = [...client.slashCommands.values()].sort((left, right) => left.name.localeCompare(right.name));

    const menu = new StringSelectMenuBuilder()
      .setCustomId("help_select")
      .setPlaceholder("Select a command")
      .addOptions(
        commands.map((item) => ({
          label: item.name,
          description: item.description.slice(0, 100),
          value: item.name,
        })),
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
    const embed = createEmbed(client, "Nexa Music Help", `Total commands: **${commands.length}**\nSelect a command below to view details.`);

    const response = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    const collector = response.createMessageComponentCollector({ time: 300_000 });

    collector.on("collect", async (menuInteraction) => {
      if (!menuInteraction.isStringSelectMenu()) {
        return;
      }

      if (menuInteraction.user.id !== interaction.user.id) {
        await menuInteraction.reply({ content: "This menu is not for you.", ephemeral: true });
        return;
      }

      const selected = commands.find((item) => item.name === menuInteraction.values[0]);

      if (!selected) {
        await menuInteraction.reply({ content: "Command not found.", ephemeral: true });
        return;
      }

      const details = createEmbed(
        client,
        `Command: /${selected.name}`,
        [
          `Description: ${selected.description}`,
          selected.category ? `Category: ${selected.category}` : undefined,
          selected.inVoice ? "Requires voice channel: Yes" : undefined,
          selected.sameVoice ? "Requires same voice channel: Yes" : undefined,
          selected.player ? "Requires active player: Yes" : undefined,
        ]
          .filter(Boolean)
          .join("\n"),
      );

      await menuInteraction.update({ embeds: [details], components: [row] });
    });
  },
};

export default command;
