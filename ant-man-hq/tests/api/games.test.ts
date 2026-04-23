import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "@/app/api/games/route";

function scheduleEvent(opts: {
  id: string;
  date: string;
  datetimeUtc: string;
  status: string;
  completed: boolean;
  period: number;
  clock?: string;
  homeAbbr: string;
  homeScore: number;
  visitorAbbr: string;
  visitorScore: number;
  postseason?: boolean;
}) {
  return {
    id: opts.id,
    date: opts.datetimeUtc,
    competitions: [
      {
        id: opts.id,
        date: opts.datetimeUtc,
        status: {
          clock: 0,
          displayClock: opts.clock ?? "0:00",
          period: opts.period,
          type: {
            completed: opts.completed,
            description: opts.status,
            shortDetail: opts.status,
          },
        },
        competitors: [
          {
            homeAway: "home",
            score: String(opts.homeScore),
            team: {
              id: opts.homeAbbr === "MIN" ? "16" : "99",
              abbreviation: opts.homeAbbr,
              displayName: `Home ${opts.homeAbbr}`,
              shortDisplayName: opts.homeAbbr,
              logos: [{ href: `https://logo/${opts.homeAbbr}.png` }],
            },
          },
          {
            homeAway: "away",
            score: String(opts.visitorScore),
            team: {
              id: opts.visitorAbbr === "MIN" ? "16" : "100",
              abbreviation: opts.visitorAbbr,
              displayName: `Visitor ${opts.visitorAbbr}`,
              shortDisplayName: opts.visitorAbbr,
              logos: [{ href: `https://logo/${opts.visitorAbbr}.png` }],
            },
          },
        ],
      },
    ],
    seasonType: { type: opts.postseason ? 3 : 2 },
  };
}

describe("GET /api/games", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-23T20:00:00Z"));
  });

  it("splits recent (last 5 Final games before today), upcoming (next 5), and liveToday", async () => {
    const schedule = {
      team: { id: "16", abbreviation: "MIN" },
      events: [
        scheduleEvent({ id: "1", date: "2026-04-20", datetimeUtc: "2026-04-21T01:00Z", status: "Final", completed: true, period: 4, homeAbbr: "MIN", homeScore: 110, visitorAbbr: "DEN", visitorScore: 105 }),
        scheduleEvent({ id: "2", date: "2026-04-23", datetimeUtc: "2026-04-23T23:00Z", status: "2nd Quarter", completed: false, period: 2, clock: "5:32", homeAbbr: "MIN", homeScore: 48, visitorAbbr: "LAL", visitorScore: 45 }),
        scheduleEvent({ id: "3", date: "2026-04-25", datetimeUtc: "2026-04-25T23:00Z", status: "Scheduled", completed: false, period: 0, homeAbbr: "GSW", homeScore: 0, visitorAbbr: "MIN", visitorScore: 0 }),
      ],
    };

    const scoreboard = { events: [schedule.events[1]] };

    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("/teams/min/schedule")) {
          return new Response(JSON.stringify(schedule), { status: 200 });
        }
        if (url.includes("/scoreboard")) {
          return new Response(JSON.stringify(scoreboard), { status: 200 });
        }
        throw new Error(`Unexpected URL: ${url}`);
      })
    );

    const res = await GET();
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(body.data.recent.map((g: { id: string }) => g.id)).toEqual(["1"]);
    expect(body.data.upcoming.map((g: { id: string }) => g.id)).toEqual(["3"]);
    expect(body.data.liveToday?.id).toBe("2");
    expect(body.data.liveToday?.home_team_score).toBe(48);
    expect(body.data.liveToday?.visitor_team_score).toBe(45);
    expect(body.data.liveToday?.status).toBe("2nd Quarter");
    expect(body.data.liveToday?.time).toBe("5:32");
  });

  it("treats a today-dated scheduled game as upcoming, not live", async () => {
    const schedule = {
      team: { id: "16", abbreviation: "MIN" },
      events: [
        scheduleEvent({ id: "10", date: "2026-04-23", datetimeUtc: "2026-04-24T01:30Z", status: "Scheduled", completed: false, period: 0, homeAbbr: "MIN", homeScore: 0, visitorAbbr: "DEN", visitorScore: 0 }),
      ],
    };

    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("/teams/min/schedule")) {
          return new Response(JSON.stringify(schedule), { status: 200 });
        }
        if (url.includes("/scoreboard")) {
          return new Response(JSON.stringify({ events: [schedule.events[0]] }), { status: 200 });
        }
        throw new Error(`Unexpected URL: ${url}`);
      })
    );

    const res = await GET();
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(body.data.liveToday).toBeNull();
    expect(body.data.upcoming[0].id).toBe("10");
  });

  it("handles ESPN's object-form score { value, displayValue }", async () => {
    const ev = scheduleEvent({ id: "99", date: "2026-04-20", datetimeUtc: "2026-04-21T01:00Z", status: "Final", completed: true, period: 4, homeAbbr: "MIN", homeScore: 0, visitorAbbr: "DEN", visitorScore: 0 });
    // Overwrite scores with ESPN's real shape
    ev.competitions[0].competitors[0].score = { value: 116, displayValue: "116" } as unknown as string;
    ev.competitions[0].competitors[1].score = { value: 105, displayValue: "105" } as unknown as string;

    const schedule = { team: { id: "16", abbreviation: "MIN" }, events: [ev] };

    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("/teams/min/schedule")) {
          return new Response(JSON.stringify(schedule), { status: 200 });
        }
        return new Response(JSON.stringify({ events: [] }), { status: 200 });
      })
    );

    const res = await GET();
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(body.data.recent[0].home_team_score).toBe(116);
    expect(body.data.recent[0].visitor_team_score).toBe(105);
  });

  it("returns ok:false when upstream fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async (_url: string) => new Response("bad", { status: 500 })));

    const res = await GET();
    const body = await res.json();

    expect(body.ok).toBe(false);
  });
});
