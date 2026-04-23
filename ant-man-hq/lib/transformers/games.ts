import type { Game, Team } from "@/lib/types";

type EspnCompetitor = {
  homeAway?: string;
  score?: string;
  team?: {
    id?: string;
    abbreviation?: string;
    displayName?: string;
    shortDisplayName?: string;
    logos?: Array<{ href?: string }>;
  };
};

type EspnStatusType = {
  completed?: boolean;
  description?: string;
  shortDetail?: string;
};

type EspnStatus = {
  displayClock?: string;
  period?: number;
  type?: EspnStatusType;
};

type EspnCompetition = {
  id?: string;
  date?: string;
  status?: EspnStatus;
  competitors?: EspnCompetitor[];
};

export type EspnEvent = {
  id?: string;
  date?: string;
  competitions?: EspnCompetition[];
  seasonType?: { type?: number };
};

function teamFrom(c: EspnCompetitor | undefined): Team {
  return {
    id: c?.team?.id ?? "",
    abbreviation: c?.team?.abbreviation ?? "",
    displayName: c?.team?.displayName ?? "",
    shortName: c?.team?.shortDisplayName ?? "",
    logo: c?.team?.logos?.[0]?.href ?? "",
  };
}

export function transformEvent(ev: EspnEvent): Game | null {
  const comp = ev.competitions?.[0];
  if (!comp || !ev.id) return null;

  const home = comp.competitors?.find((c) => c.homeAway === "home");
  const visitor = comp.competitors?.find((c) => c.homeAway === "away");
  if (!home || !visitor) return null;

  const datetime = comp.date ?? ev.date ?? null;
  const date = datetime ? datetime.slice(0, 10) : "";

  return {
    id: ev.id,
    date,
    datetime,
    status: comp.status?.type?.description ?? comp.status?.type?.shortDetail ?? "Scheduled",
    period: comp.status?.period ?? 0,
    time: comp.status?.displayClock ?? null,
    postseason: ev.seasonType?.type === 3,
    home_team: teamFrom(home),
    visitor_team: teamFrom(visitor),
    home_team_score: Number(home.score ?? 0),
    visitor_team_score: Number(visitor.score ?? 0),
  };
}
