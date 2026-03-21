import type {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  Collection,
  GuildMember,
  Message,
  PermissionResolvable,
} from "discord.js";
import { Client } from "discord.js";
import type { Riffy, RiffyNodeConfig, RiffyPlayer, RiffyTrack } from "riffy";

export interface BotConfig {
  clientid: string;
  prefix: string;
  engine: string;
  color: number;
  geniusToken: string;
  developers: string[];
  nodes: RiffyNodeConfig[];
}

export interface ExtendedTrackInfo {
  title: string;
  author: string;
  length: number;
  uri: string;
  thumbnail?: string;
  isStream?: boolean;
  requester?: GuildMember;
}

export interface ExtendedTrack extends Omit<RiffyTrack, "info"> {
  info: ExtendedTrackInfo;
}

export interface ExtendedPlayer extends Omit<RiffyPlayer, "current" | "queue" | "autoplay" | "message"> {
  current?: ExtendedTrack;
  queue: Array<ExtendedTrack> & {
    add(track: ExtendedTrack): void;
    size: number;
  };
  isAutoplay?: boolean;
  message?: Message;
  autoplay?(player: ExtendedPlayer): Promise<void> | void;
}

export interface BaseCommandOptions {
  developerOnly?: boolean;
  userPermissions?: PermissionResolvable[];
  clientPermissions?: PermissionResolvable[];
  guildOnly?: boolean;
  inVoice?: boolean;
  sameVoice?: boolean;
  player?: boolean;
  current?: boolean;
  category?: string;
}

export interface SlashCommand extends ChatInputApplicationCommandData, BaseCommandOptions {
  run: (client: NexaClient, interaction: ChatInputCommandInteraction) => Promise<unknown>;
}

export interface PrefixCommand extends BaseCommandOptions {
  name: string;
  aliases?: string[];
  description: string;
  run: (client: NexaClient, message: Message, args: string[]) => Promise<unknown> | unknown;
}

export type BotEventHandler = (client: NexaClient) => void | Promise<void>;

export class NexaClient extends Client {
  public config!: BotConfig;
  public commands!: Collection<string, PrefixCommand>;
  public aliases!: Collection<string, string>;
  public slashCommands!: Collection<string, SlashCommand>;
  public riffy!: Riffy;
}
