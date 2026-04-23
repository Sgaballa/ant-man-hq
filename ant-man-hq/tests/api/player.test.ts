import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "@/app/api/player/route";

const athletePayload = {
  athlete: {
    id: "4594268",
    firstName: "Anthony",
    lastName: "Edwards",
    displayName: "Anthony Edwards",
    jersey: "5",
    debutYear: 2020,
    displayHeight: "6' 4\"",
    displayWeight: "225 lbs",
    position: { abbreviation: "SG" },
    college: { name: "Georgia" },
    headshot: { href: "https://a.espncdn.com/i/headshots/nba/players/full/4594268.png" },
    team: {
      id: "16",
      abbreviation: "MIN",
      displayName: "Minnesota Timberwolves",
      shortDisplayName: "Timberwolves",
      logos: [{ href: "https://a.espncdn.com/i/teamlogos/nba/500/min.png" }],
    },
  },
};

// ESPN's real stats shape: averages category has parallel arrays of
// `names` (field identifiers) and one `stats` row per season.
const statsPayload = {
  categories: [
    {
      name: "averages",
      names: [
        "gamesPlayed",
        "gamesStarted",
        "avgMinutes",
        "avgFieldGoalsMade-avgFieldGoalsAttempted",
        "fieldGoalPct",
        "avgThreePointFieldGoalsMade-avgThreePointFieldGoalsAttempted",
        "threePointFieldGoalPct",
        "avgFreeThrowsMade-avgFreeThrowsAttempted",
        "freeThrowPct",
        "avgOffensiveRebounds",
        "avgDefensiveRebounds",
        "avgRebounds",
        "avgAssists",
        "avgBlocks",
        "avgSteals",
        "avgFouls",
        "avgTurnovers",
        "avgPoints",
      ],
      statistics: [
        {
          teamId: "16",
          season: { year: 2024, displayName: "2023-24" },
          stats: ["79", "79", "35.1", "9.3-20.7", "45.1", "2.9-7.8", "35.7", "4.9-5.9", "83.6", "0.7", "4.7", "5.4", "5.1", "0.5", "1.3", "2.1", "3.1", "25.9"],
        },
        {
          teamId: "16",
          season: { year: 2026, displayName: "2025-26" },
          stats: ["65", "65", "36.1", "9.7-21.1", "46.1", "3.1-8.3", "37.2", "5.2-6.2", "84.0", "0.8", "4.6", "5.4", "4.2", "0.6", "1.3", "2.0", "3.2", "27.1"],
        },
      ],
    },
  ],
};

describe("GET /api/player", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns normalized player bio + most-recent season averages on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.endsWith("/athletes/4594268")) {
          return new Response(JSON.stringify(athletePayload), { status: 200 });
        }
        if (url.endsWith("/athletes/4594268/stats")) {
          return new Response(JSON.stringify(statsPayload), { status: 200 });
        }
        throw new Error(`Unexpected URL: ${url}`);
      })
    );

    const res = await GET();
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(body.data.player.id).toBe("4594268");
    expect(body.data.player.first_name).toBe("Anthony");
    expect(body.data.player.last_name).toBe("Edwards");
    expect(body.data.player.jersey_number).toBe("5");
    expect(body.data.player.team.abbreviation).toBe("MIN");
    expect(body.data.player.team.logo).toContain("min.png");

    // Picks 2026 (most-recent), not 2024
    expect(body.data.seasonAverages.season).toBe(2026);
    expect(body.data.seasonAverages.games_played).toBe(65);
    expect(body.data.seasonAverages.pts).toBe(27.1);
    expect(body.data.seasonAverages.reb).toBe(5.4);
    expect(body.data.seasonAverages.ast).toBe(4.2);
    expect(body.data.seasonAverages.fg_pct).toBeCloseTo(0.461, 3);
    expect(body.data.seasonAverages.fg3_pct).toBeCloseTo(0.372, 3);
    expect(body.data.seasonAverages.fg_made).toBe(9.7);
    expect(body.data.seasonAverages.fg_attempted).toBe(21.1);
    expect(body.data.seasonAverages.fg3_made).toBe(3.1);
    expect(body.data.seasonAverages.fg3_attempted).toBe(8.3);
  });

  it("returns ok:false when upstream fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async (_url: string) => new Response("bad", { status: 500 })));

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ok).toBe(false);
  });
});
