const {
    ApplicationCommandType,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags
} = require("discord.js");

module.exports = {
    name: "join",
    description: "Join your current voice channel",
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        const member = interaction.member;
        const voiceChannel = member.voice?.channel;


        if (!voiceChannel) {
            const notInVC = new ContainerBuilder()
                .setAccentColor(0xFF0000)
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("### Join a Voice Channel")
                )
                .addSeparatorComponents(
                    new SeparatorBuilder()
                        .setDivider(true)
                        .setSpacing(SeparatorSpacingSize.Small)
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        "You must be in a voice channel to use this command."
                    )
                );

            return interaction.reply({
                components: [notInVC],
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
            });
        }

        try {
        
            let player = client.riffy.players.get(interaction.guild.id);

            if (player) {
                const alreadyConnected = new ContainerBuilder()
                    .setAccentColor(0xF1C40F)
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("### ⚠ Already Connected")
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder()
                            .setDivider(true)
                            .setSpacing(SeparatorSpacingSize.Small)
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            `I'm already connected to <#${player.voiceChannel}>`
                        )
                    );

                return interaction.reply({
                    components: [alreadyConnected],
                    flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
                });
            }

           
            player = await client.riffy.createConnection({
                guildId: interaction.guild.id,
                voiceChannel: voiceChannel.id,
                textChannel: interaction.channel.id,
                deaf: true
            });


            const joined = new ContainerBuilder()
                .setAccentColor(0x2ECC71)
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("### 🎶 Connected")
                )
                .addSeparatorComponents(
                    new SeparatorBuilder()
                        .setDivider(true)
                        .setSpacing(SeparatorSpacingSize.Small)
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        `Successfully joined <#${voiceChannel.id}>`
                    )
                );

            return interaction.reply({
                components: [joined],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error("Join Error:", error);

            const failed = new ContainerBuilder()
                .setAccentColor(0xFF0000)
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("### Connection Failed")
                )
                .addSeparatorComponents(
                    new SeparatorBuilder()
                        .setDivider(true)
                        .setSpacing(SeparatorSpacingSize.Small)
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        "Failed to connect to the voice channel. Please try again."
                    )
                );

            return interaction.reply({
                components: [failed],
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
            });
        }
    }
};

/**
 * Project: Nexa Music
 * Author: KoDdy, Razi
 * Company: Infinity
 * This code is the property of Infinity and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/fbu64BmPFD
 */
