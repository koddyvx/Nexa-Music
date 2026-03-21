import { Api } from "@top-gg/sdk";
import type { NexaClient } from "@/types";
import { log } from "@/utils/logger";

export function createTopggClient(): Api | undefined {
  const token = process.env.TOPGG_TOKEN;
  if (!token) {
    return undefined;
  }

  return new Api(token);
}

export async function hasTopggVote(client: NexaClient, userId: string): Promise<boolean> {
  if (!client.topgg) {
    return false;
  }

  try {
    return await client.topgg.hasVoted(userId);
  } catch (error) {
    log("warn", "topgg", "Vote lookup failed", error);
    return false;
  }
}

export async function postTopggStats(client: NexaClient): Promise<void> {
  if (!client.topgg || !client.user) {
    return;
  }

  try {
    await client.topgg.postStats({ serverCount: client.guilds.cache.size });
    log("success", "topgg", "Posted bot statistics to Top.gg");
  } catch (error) {
    log("warn", "topgg", "Failed to post bot statistics", error);
  }
}
