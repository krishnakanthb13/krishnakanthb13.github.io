# Krishna's Amplenote Plugins — Dashboard

A static, single-page dashboard that showcases my Amplenote plugins — category
cards, a full chronological timeline (with future plans), milestones, and support
links. Built to be hosted **for free on GitHub Pages**, with a **GitHub Action**
that keeps it in sync by itself — no API key, no server, no database.

- **Lives in:** `A/` inside the `krishnakanthb13.github.io` repo.
- **Goes live at:** `https://krishnakanthb13.github.io/A/`
- **Single source of truth:** the public Amplenote note
  [`public.amplenote.com/Y3dy91/krishna-plugins`](https://public.amplenote.com/Y3dy91/krishna-plugins).

---

## Contents

- [The big idea](#the-big-idea)
- [How it stays updated (you do almost nothing)](#how-it-stays-updated-you-do-almost-nothing)
  - [The rebuild is *stateless* — this is the important part](#the-rebuild-is-stateless--this-is-the-important-part)
- [When does the next run happen?](#when-does-the-next-run-happen)
- [Pausing the sync, or switching daily ⇄ weekly](#pausing-the-sync-or-switching-daily--weekly)
  - [Change the time of day](#change-the-time-of-day)
- [Editing the dashboard](#editing-the-dashboard)
  - [Plugin data → edit the Amplenote note](#plugin-data--edit-the-amplenote-note)
  - [Visual chrome → edit the script's `PRESENTATION` block](#visual-chrome--edit-the-scripts-presentation-block)
  - [Look & feel → edit `index.html`](#look--feel--edit-indexhtml)
- [Run the scraper yourself](#run-the-scraper-yourself)
- [Scraper insights & gotchas (worth knowing)](#scraper-insights--gotchas-worth-knowing)
- [Local preview](#local-preview)
- [File map](#file-map)
- [What the page shows](#what-the-page-shows)
  - [Theme toggle (System / Light / Dark)](#theme-toggle-system--light--dark)
  - [The four cards each look different](#the-four-cards-each-look-different)
- [Under the hood (front-end)](#under-the-hood-front-end)
- [Notes](#notes)

---

## The big idea

I maintain my plugins in **one place — the Amplenote note**. This site never asks me
to re-type that data. A small scraper reads the note's public page and regenerates
`plugins.yaml`; the page renders whatever is in `plugins.yaml`. So the flow is:

```
Amplenote note (you edit here)
        │   public, server-rendered HTML
        ▼
scripts/fetch-plugins.mjs   ──►   plugins.yaml   ──►   index.html (renders it)
        ▲                                                   ▲
        └──────── GitHub Action runs the scraper            └ visitors' browsers
```

Everything the dashboard shows — the 4 category cards, the 20-row timeline, every
future-plan bullet, the 🔴/🟢/🟡 badges, and the milestones — is pulled straight
from that note. Update the note, re-sync, done.

---

## How it stays updated (you do almost nothing)

A GitHub Action runs the sync script (`scripts/fetch-plugins.mjs`). Each run it:

1. fetches the public note's HTML (server-rendered, **no API key needed**),
2. parses the **"Chronological Timeline"** table → id, name, category, published date,
   last-updated date, and the **future-plan bullets** (read from the rich-text JSON
   each "Plans" link carries in its `description="…"` attribute),
3. parses the **"Custom URL's"** table → each plugin's public short link + install link,
4. parses the **"Grouped by Dimensionality"** cards → the 4 category buckets and the
   🔴 / 🟢 / 🟡 status badges,
5. parses the **"Milestones"** block → the dated milestone list,
6. joins it all on the plugin id (the token in `amplenote.com/plugins/<id>`) and
   **overwrites `plugins.yaml`** with the result.

### The rebuild is *stateless* — this is the important part

Every run rebuilds `plugins.yaml` **from scratch** off the live note. The script never
reads the previous `plugins.yaml`, so there is **no stale leftover** — what you see is
always a faithful mirror of the note at that moment. Add a plugin to the note, and it
appears here on the next sync; tweak a plan, and the bullet updates. As a safety net,
the script **aborts without writing** if it scrapes zero plugins, so a transient fetch
glitch can never blank the page.

> Because the build is a full regenerate, you never hand-edit plugin data here.
> Edit the **Amplenote note**, re-sync, and everything reconciles automatically.

---

## When does the next run happen?

The Action (`.github/workflows/update-plugins.yml`, at the **repo root**) fires on three triggers:

1. **On push** — when you commit a change to `A/scripts/fetch-plugins.mjs` or the
   workflow itself → it runs **immediately**.
2. **Daily** at **06:00 UTC** (a scheduled cron) → catches note edits with no action from you.
3. **Manually** — repo → **Actions → "Update plugins" → Run workflow**.

The auto-commit it makes is tagged `[skip ci]` so it never loops.

> **Note edits don't push to GitHub by themselves.** Editing the Amplenote note changes
> the source, but the site only catches up on the **daily** run (or a **manual** run).
> Want it live instantly after a note edit? Trigger **Actions → "Update plugins" → Run
> workflow**.

---

## Pausing the sync, or switching daily ⇄ weekly

You control the automation from **three plain-text knobs** at the top of the workflow
file (`.github/workflows/update-plugins.yml`, repo root). Edit a value, commit, done:

```yaml
env:
  SYNC_ENABLED: "false"    # "true" = sync runs · "false" = paused (nothing runs)
  SYNC_FREQUENCY: "daily"  # "daily" = every day · "weekly" = once a week
  SYNC_WEEKLY_DAY: "1"     # weekly mode only — 0=Sun 1=Mon … 6=Sat
```

| Want to… | Set |
|---|---|
| **Disable** the sync entirely | `SYNC_ENABLED: "false"` |
| **Enable** it again | `SYNC_ENABLED: "true"` |
| Run **once a day** | `SYNC_FREQUENCY: "daily"` |
| Run **once a week** (e.g. Mondays) | `SYNC_FREQUENCY: "weekly"` + `SYNC_WEEKLY_DAY: "1"` |

> **Currently `SYNC_ENABLED: "false"` — the automatic sync is paused.** The dashboard
> is fully populated from the last manual run; flip it to `"true"` whenever you want the
> daily auto-sync to take over. This mirrors the sibling video hub
> (`A/aa`, workflow `update-videos.yml`) so both behave the same way.

How it works: GitHub requires the cron to be a literal, so the schedule is *checked*
daily at 06:00 UTC and a small **gate step** reads these values to decide whether to
actually run. `SYNC_ENABLED: "false"` pauses **everything** (scheduled, manual, and
push runs); frequency only throttles the **scheduled** run.

### Change the time of day
The knobs above can't move the run off **06:00 UTC** — that hour lives in the `cron:`
line itself, near the top of `.github/workflows/update-plugins.yml`:

```yaml
on:
  schedule:
    - cron: "0 6 * * *"   # ┌ min ┌ hour ┌ day ┌ month ┌ weekday  →  06:00 UTC daily
```

Edit the **hour** field (the `6`). Examples: `0 14 * * *` → 14:00 UTC · `30 22 * * *` →
22:30 UTC. Two caveats: the time is always **UTC** (no daylight saving — convert from your
local zone), and GitHub's scheduled runs can lag a few minutes under load. In **weekly**
mode it still fires at this hour, just only on `SYNC_WEEKLY_DAY`. Commit the change for it
to take effect.

---

## Editing the dashboard

### Plugin data → edit the Amplenote note
Plugins, categories, dates, plans, badges, and milestones all come from the note.
Don't hand-edit `plugins.yaml` (the next sync overwrites it). To preview a note change
locally before the Action runs, just run the scraper yourself (see **Local preview**).

### Visual chrome → edit the script's `PRESENTATION` block
A few strings the dashboard needs that the note doesn't store — the hero subtitle, the
referral link, the support box, and the card **icons** — live in one clearly-marked
`PRESENTATION` constant at the top of `scripts/fetch-plugins.mjs`. Tweak them there and
re-run the scraper.

### Look & feel → edit `index.html`
All styling, the **light/dark/system theme tokens**, layout, and the browser-side render
logic are self-contained in `index.html`. Theme colours live in the `:root` and
`html[data-theme="dark"|"light"]` blocks at the top of its `<style>`; the brand accents
(`--green`, `--orange`, `--pink`, `--blue`) are shared by both themes so badges stay
recognisable. See [Under the hood (front-end)](#under-the-hood-front-end) for how the
render, theming, and performance pieces fit together.

---

## Run the scraper yourself

No install step — it's plain **Node 20+ with zero dependencies**. From the `A/` folder:

```powershell
cd "A"
node scripts/fetch-plugins.mjs
```

It fetches the public note, rebuilds `plugins.yaml` **in place**, and prints a one-line
summary, e.g.:

```
✓ Wrote plugins.yaml: 20 plugins, 4 categories, 7 milestones, 10 with updates, 4 badged.
```

This is exactly what the GitHub Action runs — doing it locally just previews the same
result. Commit the regenerated `plugins.yaml` if you want the change live. If the page
layout on Amplenote ever changes and a table can't be found, the script exits non-zero
with a clear message (e.g. `✗ Could not locate the timeline / custom-URL tables`) and
leaves the existing `plugins.yaml` untouched.

---

## Scraper insights & gotchas (worth knowing)

- **Badges follow the note, attributed to the *nearest preceding* plugin.** The 🔴/🟢/🟡
  markers are read from the grouped cards; each emoji is assigned to the plugin whose
  install link comes just before it. Concrete example: the 🔴 currently resolves to
  **Dice**, not Timestamp as the old hand-written YAML had it — Dice has a recent
  "Last Updated" date (Dec 29 2024) and the marker sits on Dice's line in the source,
  while Timestamp now has no update date. The site keeps the page's version because it
  syncs *to the source*; to move a badge, move the emoji in the Amplenote note and
  re-sync.
- **Everything joins on the plugin id** — the token in `amplenote.com/plugins/<id>`,
  which is also the long token in the public note link. If a plugin's note link and
  install link ever point at different ids, its rows won't join and it can silently
  drop. Keep them consistent in the note.
- **A plugin shows in a category card only if it's in the grouped section.** The timeline
  table drives the timeline; the grouped "dimensionality" cards drive the cards. Add a
  plugin to the timeline but forget to list it under a category bucket, and it appears in
  the timeline but in no card.
- **Category buckets are detected by keyword.** A header cell counts as a category only
  if its (short) text contains one of *Managing / Modify / Review / Independent /
  Filtering / Object*. Rename a bucket to something without those words and the scraper
  won't see it — add the new keyword to the header regex in `fetch-plugins.mjs`.
- **Card icons are inferred from the title** (`iconFor`). A brand-new category falls back
  to the generic `extension` icon until you add a keyword→icon mapping.
- **Plans come from rich-text JSON, one bullet per top-level list item.** A single bullet
  that spans multiple paragraphs (like Kanban's) stays one line with its sentences
  space-joined; empty plans render as no bullets.
- **Milestones must match `Month Day, Year — text`.** The parser keys off that date
  shape; a milestone written in a different format would be skipped.
- **Presentation chrome is *not* scraped.** The hero subtitle, referral link, support
  box, and card icons are constants in the script's `PRESENTATION` block — changing them
  in the note has no effect; edit the script.
- **Empty "Last Updated" shows as "—".** Only some plugins carry an update date; the rest
  render a muted dash in the timeline.
- **The build is stateless and self-protecting.** Each run fully regenerates
  `plugins.yaml` and **aborts without writing if it scrapes 0 plugins**, so a transient
  fetch error can never blank the page.

---

## Local preview

**Just open `index.html`** — double-clicking it works straight from disk, because the
generated `plugins.js` companion supplies the data (browsers block `fetch()` of local
files, but allow a `<script src>` include).

For a preview that mirrors the served site exactly (reading the fresh `plugins.yaml`),
run a tiny server instead:
```powershell
cd "A"
node scripts/fetch-plugins.mjs   # refresh plugins.yaml + plugins.js from the live note
python -m http.server 8000
```
Then open http://localhost:8000

If both `plugins.yaml` and `plugins.js` are missing, the page falls back to a
**"Select plugins.yaml"** upload button.

---

## File map
- `index.html` — the dashboard: HTML + CSS + the browser-side render logic + the
  light/dark/system theme system, all self-contained in one file. Renamed from
  `dashboard.html` so the folder URL `…github.io/A/` serves it automatically.
- `plugins.yaml` — the data the page reads (online). **Generated automatically — don't edit by hand.**
- `plugins.js` — a generated companion (`window.__PLUGINS__ = {…}`) written next to
  `plugins.yaml`. It lets `index.html` render when opened directly from disk (`file://`),
  where `fetch()` is blocked; the served site still prefers the fresh `plugins.yaml`.
  **Generated automatically — don't edit by hand.**
- `scripts/fetch-plugins.mjs` — the no-dependency (Node 20+) scraper the Action runs;
  rebuilds `plugins.yaml` from the public note. Holds the `PRESENTATION` chrome.
- `assets/` — favicons (`favicon-32.png`, `favicon-192.png`, `favicon-512.png`,
  `apple-touch-icon.png`), reused from the Video Hub in `aa/`. `favicon-192.png` also
  serves as the navbar logo.
- `aa/` — a separate project (the YouTube **Video Hub**); see `A/aa/README.md`.
- `../../.github/workflows/update-plugins.yml` — the automation (lives at the repo root,
  because GitHub only runs workflows from there).

## What the page shows
- **Sticky glass navbar** — brand + a **theme toggle** (System / Light / Dark) + a
  "Get Started" referral button.
- **Hero** — gradient title, subtitle, referral CTA, and **stat pills** (plugins,
  categories, updated count, "since" year) computed live from the data.
- **Grouped by Dimensionality** — the 4 thematic buckets in a **2×2 layout** (matching the
  public note), each with its **own visual personality** (see below) and a status badge
  where the note has one, shown **right next to the plugin name** (🔴 Updated · 🟢 Latest ·
  🟡 Trending).
- **Chronological Timeline** — all plugins in order with their future plans (as a clean
  bulleted list, no awkward wrapping), category pill, **Published** and **Last Updated**
  dates, and **Links** (public **Open** + **Install**). Scrolls horizontally on narrow
  screens instead of squashing.
- **Milestones** — the dated journey from the note.
- **Footer** — the gradient support box and a link to the Amplenote public profile. The
  © year updates itself (`new Date().getFullYear()`), so it's never stale.

> The section headings (**Grouped by Dimensionality**, **Chronological Timeline**,
> **Milestones**) mirror the headings used in the source Amplenote note.

### Theme toggle (System / Light / Dark)
A three-way segmented control in the navbar. **System** (the default) follows the OS
`prefers-color-scheme` and updates live if you change it; **Light** / **Dark** pin a
choice. The selection is saved in `localStorage` (`plp-theme`) and applied **before
first paint**, so there's no flash of the wrong theme on reload.

### The four cards each look different
By design (you asked for variety), each category card gets a distinct treatment by
position — so the 2×2 grid reads as four personalities, not one card repeated:

| Card | Accent | Distinct motif |
|---|---|---|
| 1 · Managing + Filtering | green | soft radial **aurora** glow in the corner |
| 2 · Managing Objects | orange | subtle **dotted** texture + square icon tile |
| 3 · Modify + Review | pink | bold **left ribbon** + round icon tile |
| 4 · Independent Tools | blue | **conic** corner glow + notched icon tile |

If a new (5th) category ever appears, the styles cycle (`v1…v4` again).

## Under the hood (front-end)

Everything below is self-contained in `index.html` — no build step, no framework.

**Data loading.** On `load`, the page `fetch()`es `plugins.yaml?t=<timestamp>` (the
cache-buster guarantees a fresh copy right after a sync), parses it with the CDN
**js-yaml** build, and renders. All interpolated values pass through an `esc()` helper, so
plugin names/plans can't inject HTML. If the `fetch` fails — which is what happens when
you open the file straight off disk — it reveals the **"Select plugins.yaml"** upload
fallback and renders from the file you pick.

**Theme system.** A tiny script in `<head>` reads `localStorage['plp-theme']`
(`system` | `light` | `dark`) and sets `data-theme` on `<html>` **before first paint**,
so there's no flash. The navbar's segmented control switches it; **System** tracks the OS
via `matchMedia('(prefers-color-scheme: dark)')` and updates live. Colours are CSS
variables under `html[data-theme="…"]`; the `<meta name="theme-color">` is updated to
match so mobile browser chrome follows the theme.

**Performance (smooth scrolling).** Translucent panels use plain backgrounds — only the
sticky navbar keeps a `backdrop-filter`, because stacking many blurred layers is what
makes pages stutter on scroll. The ambient aurora is promoted to its **own GPU layer**
(`will-change: transform; translateZ(0)`) so it never repaints while you scroll. Cards and
milestones fade in via `IntersectionObserver`, with a 1.4 s **safety-net timer** that
reveals anything still hidden (so content can never get stuck invisible).

**Responsive / mobile.** A `viewport` meta plus fluid `clamp()` typography; the category
grid drops from **2×2 to a single column ≤ 720 px**; the navbar hides text labels
≤ 620 px (icon-only); the timeline sits in a horizontal-scroll wrapper so it never
squashes; and the hero title uses `overflow-wrap` so long words never overflow. Verified
down to a 360–390 px viewport.

**Accessibility.** Visible `:focus-visible` rings, `aria-pressed` on the theme buttons,
semantic landmarks, and a `prefers-reduced-motion` block that disables the animations,
scroll-reveal, and smooth scrolling.

## Notes
- **No Jekyll:** a `.nojekyll` at the **repo root** keeps GitHub Pages from touching this
  folder, so every file is served exactly as-is.
- **Badges follow the note.** The 🔴/🟢/🟡 markers are read from the note's grouped cards;
  move a marker in the note and the next sync moves the badge here.
- **Favicons** are shared with the Video Hub (`aa/`) and live in `assets/`. Swap those PNGs
  to rebrand both the tab icon and the navbar logo.
- **Mobile-ready & smooth.** Responsive down to ~360 px and tuned for smooth scrolling (see
  [Under the hood](#under-the-hood-front-end)); no horizontal page scroll, just the
  timeline's own scroll strip on small screens.
- For the Action to commit the regenerated file, the repo needs **Settings → Actions →
  General → Workflow permissions → "Read and write permissions"**.
