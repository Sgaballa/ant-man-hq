import type { Game } from "@/lib/types";
import { GameCard } from "./GameCard";

type Props = { games: Game[] };

export function RecentGamesStrip({ games }: Props) {
  if (games.length === 0) {
    return (
      <section className="px-6 py-6 text-[color:var(--color-wolves-moonlight)]">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-wolves-aurora)] mb-2">RECENT GAMES</h2>
        <p>No games yet.</p>
      </section>
    );
  }

  return (
    <section className="px-6 py-6">
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-wolves-aurora)] mb-4">
        RECENT GAMES
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {games.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
      </div>
    </section>
  );
}
