import { CURATED_HIGHLIGHTS } from "@/lib/constants";

export function HighlightReel() {
  return (
    <section className="px-6 py-6">
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-wolves-aurora)] mb-4">
        HIGHLIGHT REEL
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {CURATED_HIGHLIGHTS.map((h) => (
          <div key={h.youtubeId} className="rounded-xl overflow-hidden neon-border">
            <div className="aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${h.youtubeId}`}
                title={h.title}
                allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="p-3 text-sm">{h.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
