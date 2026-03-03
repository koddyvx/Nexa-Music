const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  MessageFlags
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "help",
  description: "Display all Nexa Music commands.",

  run: async (client, interaction) => {

    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath)
      .filter(file => file.endsWith(".js"));

    const commands = commandFiles.map(file => {
      const cmd = require(path.join(commandsPath, file));
      return {
        name: cmd.name,
        description: cmd.description || "No description"
      };
    });

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("help_select")
      .setPlaceholder("Select a command to view details")
      .addOptions(
        commands.map(cmd => ({
          label: cmd.name,
          description: cmd.description.slice(0, 90),
          value: cmd.name
        }))
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const container = new ContainerBuilder()
      .setAccentColor(0xFF0000)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## 📖 Nexa Music Help Menu")
      )
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(SeparatorSpacingSize.Small)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Total Commands: **${commands.length}**\n\nSelect a command below to see details.`
        )
      );

    const response = await interaction.reply({
      components: [container, row],
      flags: MessageFlags.IsComponentsV2,
      fetchReply: true
    });

    const collector = response.createMessageComponentCollector({
      time: 300000
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id)
        return i.reply({ content: "Not for you.", ephemeral: true });

      const selected = commands.find(c => c.name === i.values[0]);

      const updatedContainer = new ContainerBuilder()
        .setAccentColor(0xFF0000)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`## 🔍 Command: ${selected.name}`)
        )
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `**Description:** ${selected.description}`
          )
        );

      await i.update({
        components: [updatedContainer, row]
      });
    });

  }
};