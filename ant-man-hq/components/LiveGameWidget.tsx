"use client";

import { useEffect, useState } from "react";
import type { Game } from "@/lib/types";
import { TIMBERWOLVES_TEAM_ID } from "@/lib/constants";

type Props = {
  liveToday: Game | null;
  upcoming: Game[];
};

export function LiveGameWidget({ liveToday, upcoming }: Props) {
  if (liveToday) return <LiveScoreboard game={liveToday} />;
  const next = upcoming[0];
  if (next) return <NextGameCountdown game={next} />;
  return (
    <section className="px-6 py-6 text-center text-[color:var(--color-wolves-moonlight)]">
      No games scheduled.
    </section>
  );
}

function LiveScoreboard({ game }: { game: Game }) {
  return (
    <section className="px-6 py-6">
      <p className="text-xs text-red-400 uppercase tracking-widest">● Live</p>
      <div className="mt-2 rounded-xl neon-border bg-[color:var(--color-wolves-navy)] p-4 flex items-center justify-between">
        <TeamScore name={game.visitor_team.abbreviation} score={game.visitor_team_score} highlight={game.visitor_team.id === TIMBERWOLVES_TEAM_ID} />
        <div className="text-center">
          <p className="font-[family-name:var(--font-display)] text-xl">{game.status}</p>
          {game.time && <p className="text-sm text-[color:var(--color-wolves-moonlight)]">{game.time}</p>}
        </div>
        <TeamScore name={game.home_team.abbreviation} score={game.home_team_score} highlight={game.home_team.id === TIMBERWOLVES_TEAM_ID} />
      </div>
    </section>
  );
}

function TeamScore({ name, score, highlight }: { name: string; score: number; highlight: boolean }) {
  return (
    <div className="text-center">
      <p className={`font-[family-name:var(--font-display)] text-2xl ${highlight ? "text-[color:var(--color-wolves-aurora)]" : ""}`}>
        {name}
      </p>
      <p className="font-[family-name:var(--font-display)] text-4xl">{score}</p>
    </div>
  );
}

function NextGameCountdown({ game }: { game: Game }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = game.datetime ? new Date(game.datetime).getTime() : new Date(`${game.date}T23:00:00Z`).getTime();
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);

  const opponent =
    game.home_team.id === TIMBERWOLVES_TEAM_ID ? game.visitor_team : game.home_team;
  const homeAway = game.home_team.id === TIMBERWOLVES_TEAM_ID ? "vs" : "@";

  return (
    <section className="px-6 py-6">
      <p className="text-xs uppercase tracking-widest text-[color:var(--color-wolves-aurora)]">Next Game</p>
      <div className="mt-2 rounded-xl neon-border bg-[color:var(--color-wolves-navy)] p-4 text-center">
        <p className="font-[family-name:var(--font-display)] text-3xl">
          Wolves {homeAway} {opponent.abbreviation}
        </p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-5xl text-[color:var(--color-wolves-aurora)]">
          {d}d {pad(h)}h {pad(m)}m {pad(s)}s
        </p>
        <p className="mt-1 text-sm text-[color:var(--color-wolves-moonlight)]">
          {new Date(game.datetime ?? game.date).toLocaleString()}
        </p>
      </div>
    </section>
  );
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
