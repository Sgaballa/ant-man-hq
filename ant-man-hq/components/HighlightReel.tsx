import type { Highlight } from "@/lib/types";

type Props = { highlights: Highlight[] };

export function HighlightReel({ highlights }: Props) {
  if (highlights.length === 0) {
    return (
      <section className="px-6 py-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-wolves-aurora)] mb-4">
          HIGHLIGHT REEL
        </h2>
        <p className="text-[color:var(--color-wolves-moonlight)]">
          No highlights yet — check back after the next game.
        </p>
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
          <a
            key={h.id}
            href={h.clipUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl overflow-hidden neon-border block transition-transform hover:scale-[1.02]"
          >
            <div className="relative aspect-video bg-black">
              {h.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={h.thumbnail}
                  alt={h.headline}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : null}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                <div className="w-14 h-14 rounded-full bg-[color:var(--color-wolves-aurora)] flex items-center justify-center text-[color:var(--color-wolves-navy)] text-2xl">
                  ▶
                </div>
              </div>
            </div>
            <p className="p-3 text-sm">{h.headline}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
