import { GatewayDispatchEvents } from "discord.js";
import type { NexaClient } from "@/types";

interface RawVoicePayload {
  t?: string;
}

export default function registerRaw(client: NexaClient): void {
  client.on("raw", (payload: RawVoicePayload) => {
    const type = payload.t as GatewayDispatchEvents | undefined;

    if (!type || ![GatewayDispatchEvents.VoiceStateUpdate, GatewayDispatchEvents.VoiceServerUpdate].includes(type)) {
      return;
    }

    client.riffy.updateVoiceState(payload);
  });
}
