// lib/types.ts

export type Team = {
  id: string;             // ESPN team id as string, e.g. "16" for Wolves
  abbreviation: string;   // "MIN"
  displayName: string;    // "Minnesota Timberwolves"
  shortName: string;      // "Timberwolves"
  logo: string;           // URL
};

export type Player = {
  id: string;             // ESPN athlete id as string
  first_name: string;
  last_name: string;
  position: string;
  height: string | null;  // formatted, e.g. "6' 4\""
  weight: string | null;  // formatted, e.g. "225 lbs"
  jersey_number: string | null;
  college: string | null;
  debut_year: number | null;
  team: Team;
  headshot: string | null; // URL
};

export type Game = {
  id: string;
  date: string;           // "YYYY-MM-DD"
  datetime: string | null; // ISO
  status: string;         // "Final", "2nd Qtr", "Scheduled", etc.
  period: number;         // 0 = not started
  time: string | null;    // clock, e.g. "5:32"
  postseason: boolean;
  gameType: string | null; // "Round of 16", "Conference Finals", null for regular season
  home_team: Team;
  visitor_team: Team;
  home_team_score: number;
  visitor_team_score: number;
};

export type SeasonAverage = {
  games_played: number;
  season: number;
  pts: number;            // PPG
  reb: number;            // RPG
  ast: number;            // APG
  stl: number;
  blk: number;
  turnover: number;
  fg_pct: number;         // 0..1
  fg3_pct: number;        // 0..1
  fg_made: number;        // per game
  fg_attempted: number;
  fg3_made: number;
  fg3_attempted: number;
  oreb: number;
  dreb: number;
};

export type Highlight = {
  id: string;
  headline: string;
  clipUrl: string;        // ESPN clip page URL — opens native player
  thumbnail: string | null;
  gameId: string;
};

// Envelope used by our own API routes
export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; data: T | null };
