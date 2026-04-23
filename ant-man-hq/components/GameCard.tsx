import type { Game } from "@/lib/types";
import { TIMBERWOLVES_TEAM_ID } from "@/lib/constants";

type Props = { game: Game };

export function GameCard({ game }: Props) {
  const wolvesIsHome = game.home_team.id === TIMBERWOLVES_TEAM_ID;
  const wolvesScore = wolvesIsHome ? game.home_team_score : game.visitor_team_score;
  const oppScore = wolvesIsHome ? game.visitor_team_score : game.home_team_score;
  const opponent = wolvesIsHome ? game.visitor_team : game.home_team;
  const result = wolvesScore > oppScore ? "W" : "L";
  const resultColor = result === "W" ? "text-[color:var(--color-wolves-aurora)]" : "text-red-400";

  return (
    <div className="min-w-[160px] rounded-xl neon-border bg-[color:var(--color-wolves-navy)] p-3">
      <div className="flex items-center justify-between">
        <span className={`font-[family-name:var(--font-display)] text-2xl ${resultColor}`}>{result}</span>
        <span className="text-xs text-[color:var(--color-wolves-moonlight)]">
          {wolvesIsHome ? "vs" : "@"} {opponent.abbreviation}
        </span>
      </div>
      <p className="mt-1 font-[family-name:var(--font-display)] text-xl">
        {wolvesScore} – {oppScore}
      </p>
      <p className="mt-1 text-xs text-[color:var(--color-wolves-moonlight)]">{game.date}</p>
    </div>
  );
}
