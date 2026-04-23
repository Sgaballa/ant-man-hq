import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "@/app/api/highlights/route";

function scheduleEvent(id: string, datetimeUtc: string, status: string) {
  return {
    id,
    date: datetimeUtc,
    competitions: [
      {
        id,
        date: datetimeUtc,
        status: {
          displayClock: "0:00",
          period: 4,
          type: { completed: status === "Final", description: status, shortDetail: status },
        },
        competitors: [
          {
            homeAway: "home",
            score: "110",
            team: { id: "16", abbreviation: "MIN", displayName: "MIN", shortDisplayName: "MIN", logos: [] },
          },
          {
            homeAway: "away",
            score: "105",
            team: { id: "7", abbreviation: "DEN", displayName: "DEN", shortDisplayName: "DEN", logos: [] },
          },
        ],
      },
    ],
    seasonType: { type: 2 },
  };
}

function summaryWithVideos(n: number, gameId: string) {
  return {
    videos: Array.from({ length: n }, (_, i) => ({
      id: `${gameId}-v${i}`,
      headline: `Clip ${i} from game ${gameId}`,
      thumbnail: `https://cdn.example/thumb-${gameId}-${i}.jpg`,
      links: {
        web: { href: `https://www.espn.com/video/clip?id=${gameId}-v${i}` },
      },
    })),
  };
}

describe("GET /api/highlights", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-23T20:00:00Z"));
  });

  it("merges videos from the last 3 Final games, capped at 9", async () => {
    const schedule = {
      events: [
        scheduleEvent("A", "2026-04-15T23:00Z", "Final"),
        scheduleEvent("B", "2026-04-17T23:00Z", "Final"),
        scheduleEvent("C", "2026-04-20T23:00Z", "Final"),
        scheduleEvent("D", "2026-04-10T23:00Z", "Final"), // older, should be skipped (only 3 slots)
        scheduleEvent("E", "2026-04-25T23:00Z", "Scheduled"), // future, skipped
      ],
    };

    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("/teams/min/schedule")) {
          return new Response(JSON.stringify(schedule), { status: 200 });
        }
        const match = url.match(/event=([A-Z])/);
        const id = match?.[1] ?? "?";
        return new Response(JSON.stringify(summaryWithVideos(5, id)), { status: 200 });
      })
    );

    const res = await GET();
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(body.data.highlights).toHaveLength(9); // capped
    const gameIds = new Set(body.data.highlights.map((h: { gameId: string }) => h.gameId));
    // Most-recent 3 games (C, B, A) — not D
    expect(gameIds.has("C")).toBe(true);
    expect(gameIds.has("B")).toBe(true);
    expect(gameIds.has("A")).toBe(true);
    expect(gameIds.has("D")).toBe(false);
    expect(gameIds.has("E")).toBe(false);

    const first = body.data.highlights[0];
    expect(first.clipUrl).toMatch(/espn\.com\/video\/clip\?id=C-v\d$/);
    expect(first.thumbnail).toMatch(/thumb-C-\d\.jpg$/);
    expect(first.headline).toMatch(/Clip \d from game C/);
  });

  it("returns empty list when there are no recent final games", async () => {
    const schedule = {
      events: [scheduleEvent("X", "2026-04-25T23:00Z", "Scheduled")],
    };

    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string) => new Response(JSON.stringify(schedule), { status: 200 }))
    );

    const res = await GET();
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(body.data.highlights).toEqual([]);
  });

  it("returns ok:false when schedule fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async (_url: string) => new Response("bad", { status: 500 })));

    const res = await GET();
    const body = await res.json();

    expect(body.ok).toBe(false);
  });
});
