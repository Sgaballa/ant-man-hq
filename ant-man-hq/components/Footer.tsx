export function Footer() {
  return (
    <footer className="mt-16">
      <div className="h-2 bg-gradient-to-r from-[color:var(--color-wolves-navy)] via-[color:var(--color-wolves-lake)] to-[color:var(--color-wolves-aurora)]" />
      <div className="px-6 py-6 text-sm text-[color:var(--color-wolves-moonlight)] flex flex-col md:flex-row justify-between gap-2">
        <p>Built for a Wolves fan — for life. 🐺</p>
        <p>
          Stats via{" "}
          <a
            href="https://www.espn.com"
            className="underline hover:text-[color:var(--color-wolves-aurora)]"
          >
            ESPN
          </a>
        </p>
      </div>
    </footer>
  );
}
