import { buildCategoryMenu, buildCommandMenu, panelEdit, panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "help",
  description: "Open the Nexa Music command center.",

  async run(client, interaction) {
    const commands = [...client.slashCommands.values()].sort((left, right) => left.name.localeCompare(right.name));
    const byCategory = new Map<string, SlashCommand[]>();

    for (const entry of commands) {
      const category = (entry.category ?? "other").toLowerCase();
      const list = byCategory.get(category) ?? [];
      list.push(entry);
      byCategory.set(category, list);
    }

    const categories = [...byCategory.keys()].sort((left, right) => left.localeCompare(right));
    let selectedCategory = categories[0];
    let selectedCommand = byCategory.get(selectedCategory)?.[0];

    const renderData = (locked = false) => ({
      panel: {
        eyebrow: "Nexa Music",
        title: "Help Center",
        description: "Select a category and command to view details.",
        lines: selectedCommand
          ? [
              `Category: ${selectedCategory}`,
              `Command: /${selectedCommand.name}`,
              `Description: ${selectedCommand.description}`,
              `Voice required: ${selectedCommand.inVoice ? "yes" : "no"}`,
              `Same channel required: ${selectedCommand.sameVoice ? "yes" : "no"}`,
              `Active player required: ${selectedCommand.player ? "yes" : "no"}`,
            ]
          : [`Category: ${selectedCategory}`, "No commands found in this category."],
      },
      components: [buildCategoryMenu(categories, locked), buildCommandMenu((byCategory.get(selectedCategory) ?? []).map((item) => item.name), locked)],
    });

    const response = await interaction.reply({
      ...panelReply(renderData(false)),
      fetchReply: true,
    });

    const collector = response.createMessageComponentCollector({ time: 60_000 });

    collector.on("collect", async (componentInteraction) => {
      if (!componentInteraction.isStringSelectMenu()) {
        return;
      }

      if (componentInteraction.user.id !== interaction.user.id) {
        await componentInteraction.reply(panelReply({
          ephemeral: true,
          panel: {
            eyebrow: "Restricted",
            title: "This help panel is locked",
            description: "Only the user who opened this panel can use it.",
          },
        }));
        return;
      }

      if (componentInteraction.customId === "help_category") {
        selectedCategory = componentInteraction.values[0];
        selectedCommand = byCategory.get(selectedCategory)?.[0];
        await componentInteraction.update(panelEdit(renderData(false)));
        return;
      }

      const found = commands.find((item) => item.name === componentInteraction.values[0]);
      if (found) {
        selectedCategory = (found.category ?? "other").toLowerCase();
        selectedCommand = found;
      }

      await componentInteraction.update(panelEdit(renderData(false)));
    });

    collector.on("end", async () => {
      await response.edit(panelEdit(renderData(true))).catch(() => undefined);
    });
  },
};

export default command;
