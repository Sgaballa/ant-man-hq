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

  const upcomingScheduled = scheduleGames.filter((g) => g.date > todayIso);

  // Prefer the scoreboard for today's game (has live clock/score).
  // Fall back to the schedule entry that matches today's date.
  let todaysGame = null as ReturnType<typeof transformEvent> | null;
  if (scoreboardRes.ok) {
    todaysGame = (scoreboardRes.data.events ?? [])
      .map(transformEvent)
      .filter((g): g is NonNullable<typeof g> => g !== null)
      .find(
        (g) =>
          g.home_team.abbreviation === TIMBERWOLVES_TEAM_ABBR ||
          g.visitor_team.abbreviation === TIMBERWOLVES_TEAM_ABBR
      ) ?? null;
  }
  if (!todaysGame) {
    todaysGame = scheduleGames.find((g) => g.date === todayIso) ?? null;
  }

  // Classify: a game counts as "live" only if it's actually in progress
  // (period > 0 and not yet Final). Otherwise push it into upcoming so the
  // countdown widget fires instead of rendering a 0-0 "LIVE" scoreboard.
  const isLive = !!todaysGame && todaysGame.period > 0 && !/final/i.test(todaysGame.status);

  const liveToday = isLive ? todaysGame : null;
  const upcoming = (todaysGame && !isLive ? [todaysGame, ...upcomingScheduled] : upcomingScheduled).slice(0, 5);

  return NextResponse.json({
    ok: true,
    data: { recent, upcoming, liveToday },
  });
}
