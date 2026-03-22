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
