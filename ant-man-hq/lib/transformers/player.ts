import type { Player, SeasonAverage, Team } from "@/lib/types";

type EspnAthleteResponse = {
  athlete?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    jersey?: string;
    debutYear?: number;
    displayHeight?: string;
    displayWeight?: string;
    position?: { abbreviation?: string };
    college?: { name?: string };
    headshot?: { href?: string };
    team?: {
      id?: string;
      abbreviation?: string;
      displayName?: string;
      shortDisplayName?: string;
      logos?: Array<{ href?: string }>;
    };
  };
};

type EspnStatsCategory = {
  name?: string;
  stats?: Array<{ name?: string; value?: number }>;
};

type EspnStatsResponse = {
  categories?: EspnStatsCategory[];
  splitCategories?: Array<{
    name?: string;
    splits?: Array<{ season?: number; displayName?: string }>;
  }>;
};

export function transformAthlete(payload: EspnAthleteResponse): Player | null {
  const a = payload.athlete;
  if (!a || !a.id) return null;

  const team: Team = {
    id: a.team?.id ?? "",
    abbreviation: a.team?.abbreviation ?? "",
    displayName: a.team?.displayName ?? "",
    shortName: a.team?.shortDisplayName ?? "",
    logo: a.team?.logos?.[0]?.href ?? "",
  };

  return {
    id: a.id,
    first_name: a.firstName ?? "",
    last_name: a.lastName ?? "",
    position: a.position?.abbreviation ?? "",
    height: a.displayHeight ?? null,
    weight: a.displayWeight ?? null,
    jersey_number: a.jersey ?? null,
    college: a.college?.name ?? null,
    debut_year: a.debutYear ?? null,
    team,
    headshot: a.headshot?.href ?? null,
  };
}

function pickStat(stats: Array<{ name?: string; value?: number }> | undefined, name: string): number {
  return stats?.find((s) => s.name === name)?.value ?? 0;
}

export function transformSeasonAverages(payload: EspnStatsResponse): SeasonAverage | null {
  const averages = payload.categories?.find((c) => c.name === "averages");
  if (!averages?.stats) return null;
  const s = averages.stats;

  const season =
    payload.splitCategories?.find((c) => c.name === "season")?.splits?.[0]?.season ?? 0;

  return {
    games_played: pickStat(s, "gamesPlayed"),
    season,
    pts: pickStat(s, "avgPoints"),
    reb: pickStat(s, "avgRebounds"),
    ast: pickStat(s, "avgAssists"),
    stl: pickStat(s, "avgSteals"),
    blk: pickStat(s, "avgBlocks"),
    turnover: pickStat(s, "avgTurnovers"),
    fg_pct: pickStat(s, "fieldGoalPct") / 100,
    fg3_pct: pickStat(s, "threePointPct") / 100,
    fg_made: pickStat(s, "avgFieldGoalsMade"),
    fg_attempted: pickStat(s, "avgFieldGoalsAttempted"),
    fg3_made: pickStat(s, "avg3PointFieldGoalsMade"),
    fg3_attempted: pickStat(s, "avg3PointFieldGoalsAttempted"),
    oreb: pickStat(s, "avgOffensiveRebounds"),
    dreb: pickStat(s, "avgDefensiveRebounds"),
  };
}
