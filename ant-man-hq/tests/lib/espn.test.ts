import { describe, it, expect, beforeEach, vi } from "vitest";
import { espn } from "@/lib/espn";

describe("espn client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("parses JSON on success", async () => {
    const fetchMock = vi.fn(async (_url: string) =>
      new Response(JSON.stringify({ athlete: { id: "4594268" } }), { status: 200 })
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await espn<{ athlete: { id: string } }>("https://example.com/x");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.athlete.id).toBe("4594268");
    }
    expect(fetchMock.mock.calls[0][0]).toBe("https://example.com/x");
  });

  it("returns ok:false on non-2xx", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 500 })));

    const result = await espn("https://example.com/x");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("500");
    }
  });

  it("returns ok:false on network throw", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("boom"); }));

    const result = await espn("https://example.com/x");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("boom");
    }
  });
});
