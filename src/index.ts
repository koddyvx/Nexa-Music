import { Collection, GatewayIntentBits, ActivityType } from "discord.js";
import { Riffy } from "riffy";
import "dotenv/config";
import { createTopggClient, postTopggStats } from "@/utils/topgg";
import loadEvents from "@/handlers/event";
import loadRiffyEvents from "@/handlers/riffy";
import loadSlashCommands from "@/handlers/slashcommand";
import config from "@/settings/config";
import { log, printBanner } from "@/utils/logger";
import { NexaClient } from "@/types";

const client = new NexaClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  shards: process.env.SHARD_LIST ? process.env.SHARD_LIST.split(",").map((value) => Number(value)) : "auto",
  shardCount: process.env.SHARD_COUNT ? Number(process.env.SHARD_COUNT) : undefined,
});

client.config = config;
client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();
client.topgg = createTopggClient();
client.riffy = new Riffy(client, client.config.nodes, {
  send: (payload: { d?: { guild_id?: string } }) => {
    const guildId = payload.d?.guild_id;
    const guild = guildId ? client.guilds.cache.get(guildId) : null;
    guild?.shard.send(payload);
  },
  defaultSearchPlatform: client.config.engine,
  restVersion: "v4",
});

printBanner();

process.on("unhandledRejection", (reason, promise) => {
  log("error", "process", "Unhandled promise rejection", { reason, promise });
});

process.on("uncaughtException", (error) => {
  log("error", "process", "Uncaught exception", error);
});

process.on("warning", (warning) => {
  log("warn", "process", `${warning.name}: ${warning.message}`);
});

client.on("error", (error) => {
  log("error", "client", "Discord client error", error);
});

client.on("shardError", (error, shardId) => {
  log("error", "shard", `Shard ${shardId} error`, error);
});

client.on("ready", async () => {
  if (!client.user) {
    return;
  }

  client.user.setPresence({
    activities: [{ name: "music across your servers", type: ActivityType.Playing }],
    status: "idle",
  });

  await postTopggStats(client);
});

client.riffy.on("nodeError", (node, error) => {
  const nodeName = (node as { name?: string }).name ?? "unknown";
  log("error", "riffy", `Node ${nodeName} reported an error`, error);
});

void Promise.all([loadEvents(client), loadRiffyEvents(client), loadSlashCommands(client)]).then(() => {
  void client.login(process.env.TOKEN ?? "");
});

export default client;
