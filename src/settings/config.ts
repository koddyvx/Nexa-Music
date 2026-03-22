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

import type { BotConfig } from "@/types";

const config: BotConfig = {
  clientid: "1155162578859851828",
  prefix: "-",
  engine: "ytsearch",
  color: 0xff0000,
  geniusToken: "",
  developers: ["875402851986325504"],
  nodes: [
    {
      name: "nexa-1",
      host: "lava-v4.millohost.my.id",
      password: "https://discord.gg/mjS5J2K3ep",
      port: 443,
      secure: true,
    },
  ],
};

export default config;
