import type { Highlight } from "@/lib/types";

type Props = { highlights: Highlight[] };

export function HighlightReel({ highlights }: Props) {
  if (highlights.length === 0) {
    return (
      <section className="px-6 py-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-wolves-aurora)] mb-4">
          HIGHLIGHT REEL
        </h2>
        <p className="text-[color:var(--color-wolves-moonlight)]">No highlights yet — check back after the next game.</p>
      </section>
    );
  }

  return (
    <section className="px-6 py-6">
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-wolves-aurora)] mb-4">
        HIGHLIGHT REEL
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((h) => (
          <div key={h.id} className="rounded-xl overflow-hidden neon-border">
            <video
              className="w-full aspect-video bg-black"
              src={h.videoUrl}
              poster={h.thumbnail ?? undefined}
              controls
              preload="metadata"
              playsInline
            />
            <p className="p-3 text-sm">{h.headline}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
