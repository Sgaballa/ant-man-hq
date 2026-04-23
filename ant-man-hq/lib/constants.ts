export const TIMBERWOLVES_TEAM_ID = "16";      // ESPN team id
export const TIMBERWOLVES_TEAM_ABBR = "MIN";
export const TIMBERWOLVES_TEAM_SLUG = "min";   // for ESPN URL paths, always lowercase
export const ANTHONY_EDWARDS_ATHLETE_ID = "4594268";
export const CURRENT_SEASON = 2026;            // ESPN's "year" for the 2025-26 season

export const WOLVES_PALETTE = {
  navy: "#0C2340",
  lake: "#236192",
  aurora: "#78BE20",
  moonlight: "#9EA2A2",
} as const;

export const CURATED_HIGHLIGHTS: ReadonlyArray<{
  title: string;
  youtubeId: string;
}> = [
  { title: "Ant's Poster Dunks — Career So Far", youtubeId: "REPLACE_WITH_REAL_ID" },
  { title: "Top Plays: Ant vs. Nuggets (2024 Playoffs)", youtubeId: "REPLACE_WITH_REAL_ID" },
  { title: "50-Point Game Highlights", youtubeId: "REPLACE_WITH_REAL_ID" },
];
