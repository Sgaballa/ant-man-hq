import type { Highlight } from "@/lib/types";

type EspnVideoLinks = {
  web?: { href?: string };
};

type EspnVideo = {
  id?: number | string;
  headline?: string;
  thumbnail?: string;
  links?: EspnVideoLinks;
  images?: Array<{ url?: string }>;
};

export type EspnSummaryResponse = {
  videos?: EspnVideo[];
};

export function transformVideos(payload: EspnSummaryResponse, gameId: string): Highlight[] {
  return (payload.videos ?? [])
    .map((v): Highlight | null => {
      // ESPN's direct MP4 URLs return 500 for public access (auth-token-gated
      // via their player). Link to the ESPN clip page instead — it plays
      // natively on mobile (opens ESPN app if installed) and in new tab on desktop.
      const clipUrl = v.links?.web?.href ?? (v.id ? `https://www.espn.com/video/clip?id=${v.id}` : "");
      if (!clipUrl || !v.headline) return null;
      return {
        id: String(v.id ?? clipUrl),
        headline: v.headline,
        clipUrl,
        thumbnail: v.thumbnail ?? v.images?.[0]?.url ?? null,
        gameId,
      };
    })
    .filter((h): h is Highlight => h !== null);
}
