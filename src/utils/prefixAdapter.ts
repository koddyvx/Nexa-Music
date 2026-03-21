import type { Message, MessageCreateOptions, MessageEditOptions, User } from "discord.js";
import { MessageFlags } from "discord.js";
import type { PrefixCommand, SlashCommand } from "@/types";
import { panelMessage } from "@/utils/discord";

function sanitizeMessageOptions(options: Record<string, unknown>): MessageCreateOptions {
  const sanitized = { ...options } as MessageCreateOptions & { flags?: number };
  if (typeof sanitized.flags === "number") {
    sanitized.flags &= ~MessageFlags.Ephemeral;
  }
  return sanitized;
}

function parseOptionValues(command: SlashCommand, args: string[]): Map<string, string | number | undefined> {
  const values = new Map<string, string | number | undefined>();
  const options = Array.isArray(command.options) ? command.options : [];
  let cursor = 0;

  for (let index = 0; index < options.length; index += 1) {
    const option = options[index];
    const raw = index === options.length - 1 ? args.slice(cursor).join(" ") : args[cursor];

    if (!raw) {
      values.set(option.name, undefined);
      cursor += 1;
      continue;
    }

    if (option.type === 10 || option.type === 4) {
      values.set(option.name, Number(raw));
    } else {
      values.set(option.name, raw);
    }

    cursor += 1;
  }

  return values;
}

function createMessageInteraction(command: SlashCommand, message: Message, args: string[]) {
  const parsed = parseOptionValues(command, args);
  const channel = message.channel as Message["channel"] & { send: (options: MessageCreateOptions) => Promise<Message> };
  let replyMessage: Message | null = null;
  let deferred = false;
  let replied = false;

  return {
    commandName: command.name,
    guild: message.guild,
    guildId: message.guildId,
    channel,
    channelId: message.channelId,
    member: message.member,
    user: message.author,
    deferred,
    replied,
    options: {
      getString(name: string, required?: boolean): string | null {
        const value = parsed.get(name);
        if ((value === undefined || value === "") && required) {
          throw new Error(`Missing required option: ${name}`);
        }
        return typeof value === "string" ? value : null;
      },
      getNumber(name: string, required?: boolean): number | null {
        const value = parsed.get(name);
        if ((value === undefined || Number.isNaN(value)) && required) {
          throw new Error(`Missing required option: ${name}`);
        }
        return typeof value === "number" && !Number.isNaN(value) ? value : null;
      },
      getInteger(name: string, required?: boolean): number | null {
        const value = parsed.get(name);
        if ((value === undefined || Number.isNaN(value)) && required) {
          throw new Error(`Missing required option: ${name}`);
        }
        return typeof value === "number" && Number.isInteger(value) ? value : null;
      },
      getUser(): User | null {
        return null;
      },
    },
    inGuild(): boolean {
      return Boolean(message.guild);
    },
    async reply(options: Record<string, unknown>) {
      replyMessage = await channel.send(sanitizeMessageOptions(options));
      replied = true;
      this.replied = true;
      return replyMessage;
    },
    async deferReply() {
      deferred = true;
      this.deferred = true;
      return undefined;
    },
    async editReply(options: Record<string, unknown>) {
      if (!replyMessage) {
        replyMessage = await channel.send(sanitizeMessageOptions(options));
      } else {
        replyMessage = await replyMessage.edit(sanitizeMessageOptions(options) as MessageEditOptions);
      }
      replied = true;
      this.replied = true;
      return replyMessage;
    },
    async followUp(options: Record<string, unknown>) {
      return channel.send(sanitizeMessageOptions(options));
    },
  };
}

export function createPrefixAdapter(command: SlashCommand): PrefixCommand {
  return {
    name: command.name,
    aliases: command.aliases,
    description: command.description,
    developerOnly: command.developerOnly,
    voteOnly: command.voteOnly,
    userPermissions: command.userPermissions,
    clientPermissions: command.clientPermissions,
    guildOnly: command.guildOnly,
    inVoice: command.inVoice,
    sameVoice: command.sameVoice,
    player: command.player,
    current: command.current,
    category: command.category,
    usage: command.usage,
    async run(client, message, args) {
      if (!message.guild || !message.member) {
        await (message.channel as Message["channel"] & { send: (options: MessageCreateOptions) => Promise<Message> }).send(panelMessage({ panel: { eyebrow: "Usage", title: "Server only", description: "This command can only be used in a server." } }));
        return;
      }

      const interaction = createMessageInteraction(command, message, args) as never;
      await command.run(client, interaction);
    },
  };
}
