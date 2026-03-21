import "dotenv/config";
import { Collection, GatewayIntentBits } from "discord.js";
import { Riffy } from "riffy";
import loadEvents from "@/handlers/event";
import loadRiffyEvents from "@/handlers/riffy";
import loadSlashCommands from "@/handlers/slashcommand";
import config from "@/settings/config";
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
});

client.config = config;
client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();
client.riffy = new Riffy(client, client.config.nodes, {
  send: (payload: { d?: { guild_id?: string } }) => {
    const guildId = payload.d?.guild_id;
    const guild = guildId ? client.guilds.cache.get(guildId) : null;

    guild?.shard.send(payload);
  },
  defaultSearchPlatform: client.config.engine,
  restVersion: "v4",
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise);
  console.error("Reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

client.on("error", (error) => {
  console.error("Client Error:", error);
});

client.on("shardError", (error, shardId) => {
  console.error(`Shard ${shardId} Error:`, error);
});

client.riffy.on("nodeError", (node, error) => {
  const nodeName = (node as { name?: string }).name ?? "unknown";
  console.error(`Lavalink Node Error [${nodeName}]:`, error);
});

process.on("warning", (warning) => {
  console.warn("Process Warning:", warning.name, warning.message);
});

void Promise.all([loadEvents(client), loadRiffyEvents(client), loadSlashCommands(client)]).then(() => {
  void client.login(process.env.TOKEN ?? "");
});

export default client;
