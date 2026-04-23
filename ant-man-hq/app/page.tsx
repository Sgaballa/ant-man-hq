// app/page.tsx

import { Header } from "@/components/Header";
import { HeroCard } from "@/components/HeroCard";
import { LiveGameWidget } from "@/components/LiveGameWidget";
import { StatsDeck } from "@/components/StatsDeck";
import { RecentGamesStrip } from "@/components/RecentGamesStrip";
import { ScheduleCarousel } from "@/components/ScheduleCarousel";
import { HighlightReel } from "@/components/HighlightReel";
import { Footer } from "@/components/Footer";
import { GET as getPlayerRoute } from "@/app/api/player/route";
import { GET as getGamesRoute } from "@/app/api/games/route";
import type { Game, Player, SeasonAverage } from "@/lib/types";

type PlayerResponse = { ok: boolean; data: { player: Player; seasonAverages: SeasonAverage | null } | null };
type GamesResponse = { ok: boolean; data: { recent: Game[]; upcoming: Game[]; liveToday: Game | null } | null };

export default async function Home() {
  const [playerRes, gamesRes] = await Promise.all([
    getPlayerRoute().then((r) => r.json() as Promise<PlayerResponse>),
    getGamesRoute().then((r) => r.json() as Promise<GamesResponse>),
  ]);

  const player = playerRes.ok && playerRes.data ? playerRes.data.player : null;
  const seasonAverages = playerRes.ok && playerRes.data ? playerRes.data.seasonAverages : null;
  const recent = gamesRes.ok && gamesRes.data ? gamesRes.data.recent : [];
  const upcoming = gamesRes.ok && gamesRes.data ? gamesRes.data.upcoming : [];
  const liveToday = gamesRes.ok && gamesRes.data ? gamesRes.data.liveToday : null;

  return (
    <main className="min-h-screen">
      <Header liveNow={!!liveToday} />
      <HeroCard player={player} seasonAverages={seasonAverages} />
      <LiveGameWidget liveToday={liveToday} upcoming={upcoming} />
      <StatsDeck seasonAverages={seasonAverages} />
      <RecentGamesStrip games={recent} />
      <ScheduleCarousel games={upcoming} />
      <HighlightReel />
      <Footer />
    </main>
  );
}
