declare module "genius-lyrics-api" {
  export interface LyricsOptions {
    apiKey: string;
    title: string;
    artist: string;
    optimizeQuery?: boolean;
  }

  export function getLyrics(options: LyricsOptions): Promise<string | null>;
}
