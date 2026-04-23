import { NextResponse } from "next/server";
import { espn } from "@/lib/espn";
import { TIMBERWOLVES_TEAM_SLUG } from "@/lib/constants";
import { transformEvent, type EspnEvent } from "@/lib/transformers/games";
import { transformVideos, type EspnSummaryResponse } from "@/lib/transformers/highlights";

const SCHEDULE_URL = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${TIMBERWOLVES_TEAM_SLUG}/schedule`;
const SUMMARY_URL = (id: string) =>
  `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${id}`;

const MAX_GAMES = 3;
const MAX_PER_GAME = 3;
const MAX_HIGHLIGHTS = 9;

export async function GET() {
  const scheduleRes = await espn<{ events?: EspnEvent[] }>(SCHEDULE_URL, { revalidate: 3600 });
  if (!scheduleRes.ok) {
    return NextResponse.json({ ok: false, error: scheduleRes.error, data: null });
  }

  const todayIso = new Date().toISOString().slice(0, 10);
  const recentGameIds = (scheduleRes.data.events ?? [])
    .map(transformEvent)
    .filter((g): g is NonNullable<typeof g> => g !== null)
    .filter((g) => g.date <= todayIso && /final/i.test(g.status))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_GAMES)
    .map((g) => g.id);

  const summaries = await Promise.all(
    recentGameIds.map(async (id) => ({
      id,
      r: await espn<EspnSummaryResponse>(SUMMARY_URL(id), { revalidate: 86400 }),
    }))
  );

  // Take up to MAX_PER_GAME clips from each game so recent games get fair
  // representation instead of one chatty game monopolizing the whole reel.
  const highlights = summaries
    .flatMap(({ id, r }) => (r.ok ? transformVideos(r.data, id).slice(0, MAX_PER_GAME) : []))
    .slice(0, MAX_HIGHLIGHTS);

  return NextResponse.json({ ok: true, data: { highlights } });
}
