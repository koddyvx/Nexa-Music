import { buildCommandMenu, panelEdit, panelReply } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "help",
  description: "Open the interactive command directory.",

  async run(client, interaction) {
    const commands = [...client.slashCommands.values()].sort((left, right) => left.name.localeCompare(right.name));
    const menu = buildCommandMenu(commands.map((item) => item.name));

    const response = await interaction.reply({
      ...panelReply({
        panel: {
          eyebrow: "Reddish guide",
          title: "Command directory",
          description: "Browse the available commands from the selector below.",
          lines: [`Total commands: ${commands.length}`],
        },
        components: [menu],
      }),
      fetchReply: true,
    });

    const collector = response.createMessageComponentCollector({ time: 300_000 });

    collector.on("collect", async (menuInteraction) => {
      if (!menuInteraction.isStringSelectMenu()) {
        return;
      }

      if (menuInteraction.user.id !== interaction.user.id) {
        await menuInteraction.reply(panelReply({
          ephemeral: true,
          panel: {
            eyebrow: "Restricted",
            title: "This panel is locked",
            description: "Only the user who opened this help panel can use it.",
          },
        }));
        return;
      }

      const selected = commands.find((item) => item.name === menuInteraction.values[0]);

      if (!selected) {
        await menuInteraction.reply(panelReply({
          ephemeral: true,
          panel: {
            eyebrow: "Lookup",
            title: "Command not found",
            description: "The selected command no longer exists in memory.",
          },
        }));
        return;
      }

      await menuInteraction.update(panelEdit({
        panel: {
          eyebrow: "Reddish guide",
          title: `/${selected.name}`,
          lines: [
            selected.description,
            `Category: ${selected.category ?? "uncategorized"}`,
            `Voice required: ${selected.inVoice ? "yes" : "no"}`,
            `Same channel required: ${selected.sameVoice ? "yes" : "no"}`,
            `Active player required: ${selected.player ? "yes" : "no"}`,
          ],
        },
        components: [menu],
      }));
    });
  },
};

export default command;
