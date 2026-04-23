"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-5xl text-[color:var(--color-wolves-aurora)]">
        TECHNICAL TIMEOUT
      </h1>
      <p className="text-[color:var(--color-wolves-moonlight)]">
        Something broke on the way to the rim.
      </p>
      <button
        onClick={() => reset()}
        className="mt-2 rounded-md bg-[color:var(--color-wolves-aurora)] px-4 py-2 text-[color:var(--color-wolves-navy)] font-semibold"
      >
        Try again
      </button>
    </main>
  );
}
