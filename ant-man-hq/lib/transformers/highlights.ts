import type { Highlight } from "@/lib/types";

type EspnVideoLinks = {
  source?: { href?: string };
  mobile?: { href?: string };
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
      const videoUrl =
        v.links?.source?.href ?? v.links?.mobile?.href ?? "";
      if (!videoUrl || !v.headline) return null;
      return {
        id: String(v.id ?? videoUrl),
        headline: v.headline,
        videoUrl,
        thumbnail: v.thumbnail ?? v.images?.[0]?.url ?? null,
        gameId,
      };
    })
    .filter((h): h is Highlight => h !== null);
}
