type Props = {
  liveNow?: boolean;
};

export function Header({ liveNow = false }: Props) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[color:var(--color-wolves-aurora)] flex items-center justify-center text-[color:var(--color-wolves-navy)] font-[family-name:var(--font-display)] text-xl">
          W
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-[color:var(--color-wolves-aurora)]">
          ANT-MAN HQ
        </h1>
      </div>
      <div className="flex items-center gap-2 text-sm text-[color:var(--color-wolves-moonlight)]">
        <span
          className={`inline-block w-2.5 h-2.5 rounded-full ${
            liveNow
              ? "bg-red-500 animate-pulse"
              : "bg-[color:var(--color-wolves-moonlight)]/50"
          }`}
          aria-label={liveNow ? "Game in progress" : "No game in progress"}
        />
        {liveNow ? "LIVE" : "Off"}
      </div>
    </header>
  );
}
