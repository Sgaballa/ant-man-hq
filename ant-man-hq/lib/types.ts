// lib/types.ts

export type Team = {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
};

export type Player = {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string | null;
  weight: string | null;
  jersey_number: string | null;
  college: string | null;
  country: string | null;
  draft_year: number | null;
  draft_round: number | null;
  draft_number: number | null;
  team: Team;
};

export type Game = {
  id: number;
  date: string;          // "YYYY-MM-DD"
  datetime: string | null; // ISO
  season: number;
  status: string;        // "Final", "1st Qtr", etc.
  period: number;
  time: string | null;
  postseason: boolean;
  home_team: Team;
  visitor_team: Team;
  home_team_score: number;
  visitor_team_score: number;
};

export type SeasonAverage = {
  games_played: number;
  season: number;
  min: string;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  turnover: number;
  fg_pct: number;
  fg3_pct: number;
  ft_pct: number;
  fg_made: number;
  fg_attempted: number;
  fg3_made: number;
  fg3_attempted: number;
  ft_made: number;
  ft_attempted: number;
  oreb: number;
  dreb: number;
  pf: number;
};

export type PlayerGameStat = {
  id: number;
  min: string;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  game: Game;
  player: Pick<Player, "id" | "first_name" | "last_name">;
};

// Envelope used by our own API routes (NOT balldontlie's envelope)
export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; data: T | null };
