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

type EspnStatsSeasonRow = {
  teamId?: string;
  teamSlug?: string;
  season?: { year?: number; displayName?: string };
  stats?: string[];
};

type EspnStatsCategory = {
  name?: string;
  names?: string[];
  labels?: string[];
  totals?: string[];
  statistics?: EspnStatsSeasonRow[];
};

type EspnStatsResponse = {
  categories?: EspnStatsCategory[];
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

function parseNum(v: string | undefined): number {
  if (!v) return 0;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function parseSplit(v: string | undefined): [number, number] {
  if (!v) return [0, 0];
  const parts = v.split("-");
  return [parseNum(parts[0]), parseNum(parts[1])];
}

export function transformSeasonAverages(payload: EspnStatsResponse): SeasonAverage | null {
  const averages = payload.categories?.find((c) => c.name === "averages");
  if (!averages?.names || !averages.statistics?.length) return null;

  const mostRecent = [...averages.statistics]
    .filter((s) => s.season?.year && s.stats)
    .sort((a, b) => (b.season?.year ?? 0) - (a.season?.year ?? 0))[0];
  if (!mostRecent?.stats) return null;

  const names = averages.names;
  const stats = mostRecent.stats;
  const num = (name: string) => {
    const i = names.indexOf(name);
    return i < 0 ? 0 : parseNum(stats[i]);
  };
  const split = (name: string) => {
    const i = names.indexOf(name);
    return i < 0 ? ([0, 0] as [number, number]) : parseSplit(stats[i]);
  };

  const [fgMade, fgAtt] = split("avgFieldGoalsMade-avgFieldGoalsAttempted");
  const [fg3Made, fg3Att] = split("avgThreePointFieldGoalsMade-avgThreePointFieldGoalsAttempted");

  return {
    games_played: num("gamesPlayed"),
    season: mostRecent.season?.year ?? 0,
    pts: num("avgPoints"),
    reb: num("avgRebounds"),
    ast: num("avgAssists"),
    stl: num("avgSteals"),
    blk: num("avgBlocks"),
    turnover: num("avgTurnovers"),
    fg_pct: num("fieldGoalPct") / 100,
    fg3_pct: num("threePointFieldGoalPct") / 100,
    fg_made: fgMade,
    fg_attempted: fgAtt,
    fg3_made: fg3Made,
    fg3_attempted: fg3Att,
    oreb: num("avgOffensiveRebounds"),
    dreb: num("avgDefensiveRebounds"),
  };
}
