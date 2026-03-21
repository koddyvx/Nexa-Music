import { inspect } from "node:util";
import { ApplicationCommandOptionType } from "discord.js";
import { panelReply, truncate } from "@/utils/discord";
import type { SlashCommand } from "@/types";

const command: SlashCommand = {
  name: "eval",
  description: "Evaluate JavaScript in the current runtime.",
  developerOnly: true,
  options: [
    {
      name: "code",
      description: "Code to evaluate",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  async run(_client, interaction) {
    const code = interaction.options.getString("code", true);

    try {
      const result = await Promise.resolve(eval(code));
      await interaction.reply(panelReply({ panel: { eyebrow: "Developer", title: "Evaluation complete", lines: [truncate(inspect(result, { depth: 2 }), 1800)] } }));
    } catch (error) {
      await interaction.reply(panelReply({ ephemeral: true, panel: { eyebrow: "Developer", title: "Evaluation failed", description: error instanceof Error ? error.message : String(error) } }));
    }
  },
};

export default command;
