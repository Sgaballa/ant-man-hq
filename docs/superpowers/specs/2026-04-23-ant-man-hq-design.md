# Ant-Man HQ — Design Spec

**Date:** 2026-04-23
**Status:** Approved
**Author:** Gift project for an 11-year-old Anthony Edwards / Timberwolves fan

## Purpose

A personalized fan site + live stats dashboard for an 11-year-old Timberwolves fan. The site centers on Anthony Edwards and functions as both a hype piece and a real-time stats hub he will bookmark and check daily during the season.

Success = he opens it every game day to check Ant's latest line and the Wolves' next game.

## Audience & Constraints

- **Single user:** the 11-year-old recipient. No accounts, no multi-tenancy.
- **Devices:** primarily phone/tablet browser, also desktop. Must be mobile-first.
- **Maintenance:** near-zero. Once deployed, the site should keep working for a full season without manual updates beyond editing a curated highlights list.
- **Budget:** $0. Free hosting, free API, no paid services.

## Locked Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Project type | Fan site + stats dashboard combo | User explicitly picked this over trivia/mini-game combo |
| Theme | Anthony Edwards + Minnesota Timberwolves | Recipient's favorite player + team |
| Data source | balldontlie.io (free, no key required) | Free NBA stats API, covers players/teams/games/season averages |
| Hosting | Vercel (free tier) | Native Next.js deployment, free, bookmarkable URL |
| Visual direction | Trading-card / arcade | Playful, game-like UI with card-flip animations; fits 11-year-old audience |

## Tech Stack

- **Framework:** Next.js 15+ (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (card flips, neon glow, confetti)
- **Fonts:** Bebas Neue (display / titles), Inter (body)
- **Data:** balldontlie.io v1 REST API, proxied through Next.js API routes
- **Deployment:** Vercel with GitHub auto-deploy

## Visual Theme

**Wolves palette (official):**
- Midnight Navy `#0C2340`
- Lake Blue `#236192`
- Aurora Green `#78BE20`
- Moonlight Grey `#9EA2A2`

**Background:** Dark (navy gradient), neon-green accents. Card borders glow aurora-green on hover. Confetti burst (Wolves colors) on first hero-card flip.

## Page Layout (single-page scroll)

### 1. Header
Wolves logo lockup (left) + "ANT-MAN HQ" wordmark (Bebas Neue, aurora-green) + live game indicator dot (right, pulses red if game is live).

### 2. Hero Player Card
Giant centered trading card of Anthony Edwards (#5).
- **Front:** Photo, name, number, team logo, aurora-green neon border, subtle float animation.
- **Back (on click/tap):** Bio vitals (height, age, hometown, draft year), signature season averages.
- **First flip** triggers a one-time confetti burst.

### 3. Live Game Widget
- **If Wolves playing today:** Mini-scoreboard showing team logos, current score, quarter/time, Ant's live stat line.
- **Otherwise:** "Next Game" countdown — opponent logo, date, time, countdown timer (`3d 14h 22m`).

### 4. Season Stats Deck
Horizontal row of 6 flippable mini cards:
PPG · RPG · APG · FG% · 3P% · STL
- **Front:** Large stat number.
- **Back:** Career average, season rank (if derivable from API).

### 5. Recent Games Strip
Horizontally scrollable row of the last 5 game-result cards. Each card:
- W/L badge
- Opponent logo + final score
- Ant's line (pts/reb/ast)
- Date

### 6. Upcoming Schedule Carousel
Next 5 Wolves games as mini matchup cards (opponent logo, date, time, home/away indicator). Note: the "recent games" and "upcoming games" sections both show 5 — not 5–10.

### 7. Highlight Reel
Hand-curated YouTube embeds of Ant's signature dunks / moments. URL list lives in `lib/constants.ts` — not API-driven, easy to update.

### 8. Footer
Team colors band, "Built for [recipient] — Wolves fan for life" tagline, link to balldontlie.io attribution.

## File Structure

```
app/
  layout.tsx               # Global shell, fonts, metadata
  page.tsx                 # Single-page HQ composition
  globals.css              # Tailwind + theme tokens
  api/
    player/route.ts        # Proxies balldontlie /players + /season_averages
    games/route.ts         # Proxies /games (recent, upcoming, live)
components/
  Header.tsx
  HeroCard.tsx
  LiveGameWidget.tsx
  StatsDeck.tsx
  GameCard.tsx
  ScheduleCarousel.tsx
  HighlightReel.tsx
  Footer.tsx
lib/
  balldontlie.ts           # Typed API client
  constants.ts             # Team ID (17), Ant's player ID, palette, curated highlights
  types.ts                 # Shared TypeScript types
public/
  wolves-logo.svg
  ant-hero.jpg             # Hero photo (placeholder, replace with licensed image)
```

## Data Flow

```
Browser (component)
  → fetch('/api/player' | '/api/games')
    → Next.js route handler
      → balldontlie.io REST
      → shape + cache (ISR, Next.js fetch revalidate)
    ← JSON { ok: true, data: ... }
  ← render
```

**Caching (Next.js `fetch` revalidate):**
- Live game endpoint: `revalidate: 60` (60s)
- Recent games / season averages: `revalidate: 3600` (1hr)
- Schedule: `revalidate: 21600` (6hr)

## Error Handling & Fallbacks

- Each API route wraps the balldontlie call in try/catch.
- On failure, route returns `{ ok: false, data: lastKnownShape }` using a minimal in-memory cache of the last successful response within the Vercel function's lifetime.
- UI components render "—" for missing stat fields and a small "stats temporarily unavailable" toast on `ok: false`.
- No empty states that break layout; every section reserves its space.

## Out of Scope (v1 — YAGNI)

- User accounts / auth
- Trivia or mini-game
- Video highlights API integration (curated YouTube embeds only)
- Multiple player cards (Ant only)
- Server-side database (stateless, all data fetched live)
- CMS for editing content (code-level constants only)
- Mobile app wrapper
- Push notifications
- Dark/light mode toggle (site is dark-only by design)

## Testing Strategy

This is a simple gift fan site; heavy coverage is overkill. Minimum viable tests:
- **API route smoke test (Vitest):** `/api/player` and `/api/games` return valid-shaped JSON when balldontlie is reachable; return `ok: false` when it's not.
- **Component render test (Vitest + Testing Library):** HeroCard renders without crashing given known props.
- **Manual QA checklist:** mobile Safari, desktop Chrome — verify card flip, live widget, scrolling carousels.

## Deployment

1. Push to a new GitHub repo (`ant-man-hq`).
2. Connect repo to Vercel.
3. Vercel auto-deploys `main` branch.
4. Default URL: `ant-man-hq.vercel.app` — share with recipient.
5. Custom domain optional (not in v1).

## Open Items (explicitly deferred)

- **Player ID lookup:** confirm Ant's balldontlie player ID during implementation (query `/players?search=edwards` and pin the ID in `constants.ts`).
- **Hero image:** public-domain / fair-use photo during implementation; replace with a better one later if needed.
- **Custom domain:** not in v1, can add post-launch.
