import { NextResponse } from "next/server";
import { espn } from "@/lib/espn";
import { ANTHONY_EDWARDS_ATHLETE_ID } from "@/lib/constants";
import { transformAthlete, transformSeasonAverages } from "@/lib/transformers/player";

const BIO_URL = (id: string) =>
  `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${id}`;
const STATS_URL = (id: string) =>
  `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${id}/stats`;

export async function GET() {
  const [bio, stats] = await Promise.all([
    espn<unknown>(BIO_URL(ANTHONY_EDWARDS_ATHLETE_ID), { revalidate: 86400 }),
    espn<unknown>(STATS_URL(ANTHONY_EDWARDS_ATHLETE_ID), { revalidate: 3600 }),
  ]);

  if (!bio.ok || !stats.ok) {
    return NextResponse.json({
      ok: false,
      error: !bio.ok ? bio.error : !stats.ok ? stats.error : "fetch failed",
      data: null,
    });
  }

  const player = transformAthlete(bio.data as Parameters<typeof transformAthlete>[0]);
  const seasonAverages = transformSeasonAverages(
    stats.data as Parameters<typeof transformSeasonAverages>[0]
  );

  if (!player) {
    return NextResponse.json({ ok: false, error: "Missing athlete payload", data: null });
  }

  return NextResponse.json({
    ok: true,
    data: { player, seasonAverages },
  });
}
