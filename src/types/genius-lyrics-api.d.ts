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

declare module "genius-lyrics-api" {
  export interface LyricsOptions {
    apiKey: string;
    title: string;
    artist: string;
    optimizeQuery?: boolean;
  }

  export function getLyrics(options: LyricsOptions): Promise<string | null>;
}
