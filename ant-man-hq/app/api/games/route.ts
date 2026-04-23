import { NextResponse } from "next/server";
import { espn } from "@/lib/espn";
import { TIMBERWOLVES_TEAM_SLUG, TIMBERWOLVES_TEAM_ABBR } from "@/lib/constants";
import { transformEvent, type EspnEvent } from "@/lib/transformers/games";

const SCHEDULE_URL = (slug: string) =>
  `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${slug}/schedule`;
const SCOREBOARD_URL = (yyyymmdd: string) =>
  `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${yyyymmdd}`;

function ymdUtc(d: Date): string {
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
}

export async function GET() {
  const todayYmd = ymdUtc(new Date());
  const todayIso = `${todayYmd.slice(0, 4)}-${todayYmd.slice(4, 6)}-${todayYmd.slice(6, 8)}`;

  const [scheduleRes, scoreboardRes] = await Promise.all([
    espn<{ events?: EspnEvent[] }>(SCHEDULE_URL(TIMBERWOLVES_TEAM_SLUG), { revalidate: 3600 }),
    espn<{ events?: EspnEvent[] }>(SCOREBOARD_URL(todayYmd), { revalidate: 60 }),
  ]);

  if (!scheduleRes.ok) {
    return NextResponse.json({ ok: false, error: scheduleRes.error, data: null });
  }

  const scheduleGames = (scheduleRes.data.events ?? [])
    .map(transformEvent)
    .filter((g): g is NonNullable<typeof g> => g !== null)
    .sort((a, b) => a.date.localeCompare(b.date));

  const recent = scheduleGames
    .filter((g) => g.date < todayIso && /Final/i.test(g.status))
    .slice(-5);

  const upcoming = scheduleGames.filter((g) => g.date > todayIso).slice(0, 5);

  let liveToday = null as ReturnType<typeof transformEvent> | null;
  if (scoreboardRes.ok) {
    const wolvesGame = (scoreboardRes.data.events ?? [])
      .map(transformEvent)
      .filter((g): g is NonNullable<typeof g> => g !== null)
      .find(
        (g) =>
          g.home_team.abbreviation === TIMBERWOLVES_TEAM_ABBR ||
          g.visitor_team.abbreviation === TIMBERWOLVES_TEAM_ABBR
      );
    if (wolvesGame) liveToday = wolvesGame;
  }
  if (!liveToday) {
    liveToday = scheduleGames.find((g) => g.date === todayIso) ?? null;
  }

  return NextResponse.json({
    ok: true,
    data: { recent, upcoming, liveToday },
  });
}
