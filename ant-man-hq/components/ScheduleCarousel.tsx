import type { Game } from "@/lib/types";
import { TIMBERWOLVES_TEAM_ID } from "@/lib/constants";

type Props = { games: Game[] };

export function ScheduleCarousel({ games }: Props) {
  if (games.length === 0) {
    return (
      <section className="px-4 sm:px-6 py-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-wolves-aurora)] mb-2">UP NEXT</h2>
        <p className="text-[color:var(--color-wolves-moonlight)]">No upcoming games.</p>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 py-6">
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-wolves-aurora)] mb-4">
        UP NEXT
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {games.map((g) => {
          const wolvesIsHome = g.home_team.id === TIMBERWOLVES_TEAM_ID;
          const opp = wolvesIsHome ? g.visitor_team : g.home_team;
          return (
            <div key={g.id} className="min-w-[160px] rounded-xl neon-border bg-[color:var(--color-wolves-navy)] p-3">
              <p className="text-xs text-[color:var(--color-wolves-moonlight)]">
                {wolvesIsHome ? "vs" : "@"} {opp.abbreviation}
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl">
                {new Date(g.datetime ?? g.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </p>
              <p className="text-xs text-[color:var(--color-wolves-moonlight)]">
                {g.datetime ? new Date(g.datetime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : ""}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
