import type { SeasonAverage } from "@/lib/types";
import { StatMiniCard } from "./StatMiniCard";

type Props = { seasonAverages: SeasonAverage | null };

export function StatsDeck({ seasonAverages }: Props) {
  const cards: Array<{ label: string; value: string | null; back: string | null }> = [
    { label: "PPG", value: seasonAverages?.pts.toFixed(1) ?? null, back: `Games: ${seasonAverages?.games_played ?? "—"}` },
    { label: "RPG", value: seasonAverages?.reb.toFixed(1) ?? null, back: `OREB: ${seasonAverages?.oreb.toFixed(1) ?? "—"}` },
    { label: "APG", value: seasonAverages?.ast.toFixed(1) ?? null, back: `TO: ${seasonAverages?.turnover.toFixed(1) ?? "—"}` },
    { label: "FG%", value: seasonAverages ? pct(seasonAverages.fg_pct) : null, back: seasonAverages ? `${seasonAverages.fg_made.toFixed(1)}/${seasonAverages.fg_attempted.toFixed(1)}` : null },
    { label: "3P%", value: seasonAverages ? pct(seasonAverages.fg3_pct) : null, back: seasonAverages ? `${seasonAverages.fg3_made.toFixed(1)}/${seasonAverages.fg3_attempted.toFixed(1)}` : null },
  ];

  return (
    <section className="px-6 py-8">
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-wolves-aurora)] mb-4">
        SEASON STATS
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {cards.map((c) => (
          <StatMiniCard key={c.label} {...c} />
        ))}
      </div>
    </section>
  );
}

function pct(v: number) {
  return `${Math.round(v * 1000) / 10}%`;
}
