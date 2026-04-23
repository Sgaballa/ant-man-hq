// components/HeroCard.tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Player, SeasonAverage } from "@/lib/types";
import confetti from "canvas-confetti";

type Props = {
  player: Player | null;
  seasonAverages: SeasonAverage | null;
  onFirstFlip?: () => void;
};

export function HeroCard({ player, seasonAverages, onFirstFlip }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);

  function toggle() {
    setFlipped((f) => !f);
    if (!hasFlipped) {
      setHasFlipped(true);
      onFirstFlip?.();
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#0C2340", "#236192", "#78BE20", "#9EA2A2"],
      });
    }
  }

  const name = player ? `${player.first_name} ${player.last_name}` : "Anthony Edwards";
  const number = player?.jersey_number ?? "5";

  return (
    <div
      className="relative mx-auto my-8 w-[min(85vw,300px)] aspect-[3/4.4] cursor-pointer"
      style={{ perspective: "1200px" }}
      onClick={toggle}
      role="button"
      aria-label="Flip player card"
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl neon-border overflow-hidden bg-gradient-to-b from-[color:var(--color-wolves-lake)] to-[color:var(--color-wolves-navy)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Full-bleed action photo. No blend mode, no tint overlay. Text uses
              drop-shadow for legibility over the photo. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ant-hero.png"
            alt="Anthony Edwards"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />

          {/* Foreground content — text uses shadow for legibility over any part of the photo */}
          <div className="relative h-full p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="font-[family-name:var(--font-display)] text-6xl text-[color:var(--color-wolves-aurora)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                #{number}
              </span>
              <span className="text-xs text-[color:var(--color-wolves-moonlight)] tracking-widest drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">TIMBERWOLVES</span>
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-4xl leading-none tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                {name}
              </p>
              <p className="mt-2 text-sm text-[color:var(--color-wolves-moonlight)] drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                {player?.position ?? "G"} · {player?.height ?? "6-4"} · Tap to flip
              </p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl neon-border bg-[color:var(--color-wolves-navy)] p-5 flex flex-col"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-wolves-aurora)]">
            SEASON AVERAGES
          </p>
          <div className="mt-4 grid grid-cols-3 gap-4 flex-1">
            {seasonAverages ? (
              <>
                <Stat label="PPG" value={seasonAverages.pts.toFixed(1)} />
                <Stat label="RPG" value={seasonAverages.reb.toFixed(1)} />
                <Stat label="APG" value={seasonAverages.ast.toFixed(1)} />
                <Stat label="FG%" value={pct(seasonAverages.fg_pct)} />
                <Stat label="3P%" value={pct(seasonAverages.fg3_pct)} />
                <Stat label="STL" value={seasonAverages.stl.toFixed(1)} />
              </>
            ) : (
              <p className="col-span-3 text-[color:var(--color-wolves-moonlight)] text-sm">
                Stats unavailable.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[color:var(--color-wolves-moonlight)] text-xs">{label}</p>
      <p className="font-[family-name:var(--font-display)] text-3xl">{value}</p>
    </div>
  );
}

function pct(v: number) {
  return `${Math.round(v * 1000) / 10}%`;
}
