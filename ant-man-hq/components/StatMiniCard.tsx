"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  label: string;
  value: string | null;
  back: string | null;
};

export function StatMiniCard({ label, value, back }: Props) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="relative w-[96px] h-[120px] shrink-0 cursor-pointer"
      style={{ perspective: "900px" }}
      onClick={() => setFlipped((f) => !f)}
      role="button"
      aria-label={`Flip ${label} stat card`}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="absolute inset-0 rounded-xl neon-border bg-[color:var(--color-wolves-navy)] px-2 py-2 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-[color:var(--color-wolves-moonlight)] text-[10px] tracking-wider">{label}</span>
          <span className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-wolves-aurora)] text-right leading-none">
            {value ?? "—"}
          </span>
        </div>
        <div
          className="absolute inset-0 rounded-xl neon-border bg-[color:var(--color-wolves-lake)] px-2 py-2 flex items-center justify-center text-center text-xs leading-tight"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {back ?? "—"}
        </div>
      </motion.div>
    </div>
  );
}
