const { PermissionsBitField } = require("discord.js");
const { prefix, developers } = require("../../../settings/config");

module.exports = (client) => {
client.on("messageCreate", async (message) => {
    try {
        if (message.author.bot || !message.guild || !message.content.startsWith(prefix)) {
            return;
        }

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) return;

        let command = client.commands.get(cmd)

        if (!command) command = client.commands.get(client.aliases.get(cmd))

        if (command) {
            if (command.developerOnly) {
                if (!developers.includes(message.author.id)) {
                    return message.channel.send(`:x: ${command.name} is a developer only command`)
                }
            }

            if (command.userPermissions) {
                if (!message.channel.permissionsFor(message.member).has(PermissionsBitField.resolve(command.userPermissions || []))) {
                    return message.channel.send(`You do not have the required permissions to use this command. You need the following permissions: ${command.userPermissions.join(", ")}`)
                }
            }

            if (command.clientPermissions) {
                if (!message.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.resolve(command.clientPermissions || []))) {
                    return message.channel.send(`I do not have the required permissions to use this command. I need the following permissions: ${command.clientPermissions.join(", ")}`)
                }
            }

            if (command.guildOnly && !message.guildId) {
                return message.channel.send(`${command.name} is a guild only command`)
            }

            if (command) command.run(client, message, args);
        }
    } catch (err) {
        console.log("An error occurred while executing the messageCreate event:")
        console.log(err)

        return message.channel.send(`An error occurred while executing the messageCreate event:\n${err}`)
    }
});
};
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
