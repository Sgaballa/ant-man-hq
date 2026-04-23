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

const statsPayload = {
  categories: [
    {
      name: "averages",
      stats: [
        { name: "gamesPlayed", value: 65 },
        { name: "avgMinutes", value: 36.1 },
        { name: "avgPoints", value: 27.1 },
        { name: "avgRebounds", value: 5.4 },
        { name: "avgOffensiveRebounds", value: 0.8 },
        { name: "avgDefensiveRebounds", value: 4.6 },
        { name: "avgAssists", value: 4.2 },
        { name: "avgSteals", value: 1.3 },
        { name: "avgBlocks", value: 0.6 },
        { name: "avgTurnovers", value: 3.2 },
        { name: "fieldGoalPct", value: 46.1 },
        { name: "avgFieldGoalsMade", value: 9.7 },
        { name: "avgFieldGoalsAttempted", value: 21.1 },
        { name: "threePointPct", value: 37.2 },
        { name: "avg3PointFieldGoalsMade", value: 3.1 },
        { name: "avg3PointFieldGoalsAttempted", value: 8.3 },
      ],
    },
  ],
  splitCategories: [
    {
      name: "season",
      splits: [{ displayName: "2025-26", season: 2026 }],
    },
  ],
};

describe("GET /api/player", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns normalized player bio + season averages on success", async () => {
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
    expect(body.data.seasonAverages.pts).toBe(27.1);
    expect(body.data.seasonAverages.reb).toBe(5.4);
    expect(body.data.seasonAverages.fg_pct).toBeCloseTo(0.461, 3);
    expect(body.data.seasonAverages.fg3_pct).toBeCloseTo(0.372, 3);
    expect(body.data.seasonAverages.games_played).toBe(65);
  });

  it("returns ok:false when upstream fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("bad", { status: 500 })));

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ok).toBe(false);
  });
});
