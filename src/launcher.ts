import { ShardingManager } from "discord.js";

const manager = new ShardingManager("./dist/index.js", {
  token: process.env.TOKEN,
  totalShards: "auto",
});

manager.on("shardCreate", (shard) => {
  console.log(`[SHARD] Launched shard ${shard.id}`);
});

void manager.spawn();
