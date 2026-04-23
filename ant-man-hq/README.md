# Ant-Man HQ

A personalized fan site + live stats dashboard for Anthony Edwards and the Minnesota Timberwolves. Built for an 11-year-old Wolves fan.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Framer Motion for card flips, canvas-confetti for the first-flip burst
- ESPN's public site APIs (no auth) for bio, season averages, schedule, and live scoreboard
- Vitest + Testing Library for unit tests

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

No environment variables required.

## Test

```bash
npm test
```

## Deploy to Vercel

1. Create an empty GitHub repo (e.g. `ant-man-hq`) — no README, no license.
2. Push this repo's `main` branch to it:

    ```bash
    git remote add origin https://github.com/<your-user>/ant-man-hq.git
    git push -u origin main
    ```

3. Open <https://vercel.com/new> and import the repo.
4. **Set the Root Directory to `ant-man-hq/`** (the Next.js project lives in a subdirectory).
5. Framework preset: Next.js (auto-detected).
6. No environment variables needed.
7. Click **Deploy**.

Vercel will hand you a `*.vercel.app` URL — share with the fan.

## Update highlight videos

The three YouTube IDs live in `lib/constants.ts` under `CURATED_HIGHLIGHTS`. Replace them with real video IDs from YouTube (the 11-character string after `v=` in the URL) and push; Vercel redeploys automatically.

## Architecture notes

- `app/page.tsx` calls the route handlers' `GET` functions directly (in-process) to avoid an HTTP round-trip back to the same server.
- `lib/espn.ts` is a small typed `fetch` wrapper that supports `next: { revalidate: N }` for Next.js's ISR cache.
- `lib/transformers/` contains pure mapping functions from ESPN's nested responses to the display shape in `lib/types.ts`. The routes import these.
