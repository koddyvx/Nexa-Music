import type {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  Collection,
  GuildMember,
  Message,
  PermissionResolvable,
} from "discord.js";
import { Client } from "discord.js";
import type { Api } from "@top-gg/sdk";
import type { LoopOption, Riffy, RiffyNodeConfig, RiffyPlayer, RiffyTrack } from "riffy";

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
  identifier?: string;
  sourceName?: string;
  requester?: GuildMember;
}

export interface ExtendedTrack extends Omit<RiffyTrack, "info"> {
  info: ExtendedTrackInfo;
}

export interface ExtendedPlayer extends Omit<RiffyPlayer, "current" | "previous" | "queue" | "autoplay" | "message" | "loop"> {
  current?: ExtendedTrack;
  previous?: ExtendedTrack;
  loop: LoopOption;
  queue: Array<ExtendedTrack> & {
    add(track: ExtendedTrack): void;
    remove(index: number): ExtendedTrack;
    clear(): void;
    shuffle(): void;
    size: number;
  };
  isAutoplay?: boolean;
  message?: Message;
  autoplay?(player: ExtendedPlayer): Promise<void> | void;
}

export interface BaseCommandOptions {
  developerOnly?: boolean;
  voteOnly?: boolean;
  userPermissions?: PermissionResolvable[];
  clientPermissions?: PermissionResolvable[];
  guildOnly?: boolean;
  inVoice?: boolean;
  sameVoice?: boolean;
  player?: boolean;
  current?: boolean;
  category?: string;
  aliases?: string[];
  usage?: string;
}

export interface SlashCommand extends ChatInputApplicationCommandData, BaseCommandOptions {
  run: (client: NexaClient, interaction: ChatInputCommandInteraction) => Promise<unknown>;
}

export interface PrefixCommand extends BaseCommandOptions {
  name: string;
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
  public topgg?: Api;
}
