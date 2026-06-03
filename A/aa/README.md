# Krishna Kanth B — Video Hub

A static website that auto-collects your YouTube videos from multiple channels and
displays them in one place. Built to be hosted **for free on GitHub Pages**, with a
**GitHub Action** that keeps it updated by itself — no API keys, no server, no database.

- **Lives in:** `A/aa/` inside the `krishnakanthb13.github.io` repo.
- **Goes live at:** `https://krishnakanthb13.github.io/A/aa/`

---

## Contents

- [How it stays updated (you do almost nothing)](#how-it-stays-updated-you-do-almost-nothing)
  - [The rebuild is *stateless* — this is the important part](#the-rebuild-is-stateless--this-is-the-important-part)
- [When does the next run happen?](#when-does-the-next-run-happen)
- [Run the sync locally](#run-the-sync-locally)
- [Pausing the sync, or switching daily ⇄ weekly](#pausing-the-sync-or-switching-daily--weekly)
  - [Change the time of day](#change-the-time-of-day)
- [The only files you ever edit](#the-only-files-you-ever-edit)
  - [`channels.txt` — your channels (one per line)](#channelstxt--your-channels-one-per-line)
  - [`videos.txt` — optional one-off videos](#videostxt--optional-one-off-videos)
- [Caveats & gotchas (worth knowing)](#caveats--gotchas-worth-knowing)
- [How the site behaves (front-end)](#how-the-site-behaves-front-end)
- [Hosting on GitHub Pages](#hosting-on-github-pages)
- [Local preview](#local-preview)
- [File map](#file-map)
- [Notes](#notes)

---

## How it stays updated (you do almost nothing)

A GitHub Action runs the sync script (`scripts/fetch-videos.mjs`). Each run it:

1. reads your channel list from `channels.txt`,
2. resolves each handle to its channel ID and reads its **public RSS feed**,
3. pulls in the latest videos — **title, full description, and thumbnail** (no API key needed),
4. merges in any one-off links from `videos.txt`,
5. writes `videos.json`, which the website displays.

### The rebuild is *stateless* — this is the important part

Every run rebuilds `videos.json` **from scratch**. The script creates a fresh, empty
list (`scripts/fetch-videos.mjs` → `new Map()`), fills it from the channel feeds +
`videos.txt`, and **overwrites `videos.json` entirely**. It never reads the previous
`videos.json`, so there is **no stale leftover** — what you see is always a faithful
mirror of your channels + `videos.txt` at that moment.

What that means in practice, for `videos.txt`:

| You do this in `videos.txt` | Result on the next run |
|---|---|
| **Add** a line | the video appears |
| **Edit** a description | the description updates (a manual `\| description` even **overrides** a channel's own description for the same video) |
| **Delete** a line | the video disappears — *unless* that same video is also in a channel's RSS feed, in which case it stays, sourced from the channel |

> Because the build is a full regenerate, you never have to "clean up" `videos.json` by
> hand. Edit the source (`channels.txt` / `videos.txt`), and the next run reconciles
> everything automatically.

---

## When does the next run happen?

The Action (`.github/workflows/update-videos.yml`, at the **repo root**) fires on three triggers:

1. **On push** — when you commit a change to `A/aa/channels.txt`, `A/aa/videos.txt`, or
   the sync script → it runs **immediately**.
2. **Daily** at **06:00 UTC** (a scheduled cron) → catches new uploads with no action from you.
3. **Manually** — repo → **Actions → "Update videos" → Run workflow**.

So a committed `videos.txt` edit rebuilds right away; otherwise the site **self-heals
within a day**. The auto-commit it makes is tagged `[skip ci]` so it never loops.

---

## Run the sync locally

The gate (below) only governs the **GitHub Action** — running the script directly always
rebuilds the data, regardless of how `SYNC_ENABLED` is set. It's plain **Node 20+ with
zero dependencies**. From the `A/aa/` folder:

```powershell
cd "A\aa"
node scripts/fetch-videos.mjs
```

It rebuilds `videos.json` **in place** from `channels.txt` + `videos.txt` and prints a
short summary (e.g. `Wrote videos.json with N videos.`). This is exactly what the Action
runs — doing it locally just previews the same result; commit the regenerated
`videos.json` if you want the change live. (If your channels have no public uploads yet,
it writes an empty list — that's expected, not an error.)

---

## Pausing the sync, or switching daily ⇄ weekly

You control the automation from **three plain-text knobs** at the top of the workflow
file (`.github/workflows/update-videos.yml`, repo root). Edit a value, commit, done:

```yaml
env:
  SYNC_ENABLED: "true"     # "true" = sync runs · "false" = paused (nothing runs)
  SYNC_FREQUENCY: "daily"  # "daily" = every day · "weekly" = once a week
  SYNC_WEEKLY_DAY: "1"     # weekly mode only — 0=Sun 1=Mon … 6=Sat
```

| Want to… | Set |
|---|---|
| **Disable** the sync entirely | `SYNC_ENABLED: "false"` |
| **Enable** it again | `SYNC_ENABLED: "true"` |
| Run **once a day** | `SYNC_FREQUENCY: "daily"` |
| Run **once a week** (e.g. Mondays) | `SYNC_FREQUENCY: "weekly"` + `SYNC_WEEKLY_DAY: "1"` |

How it works: GitHub requires the cron to be a literal, so the schedule is *checked*
daily at 06:00 UTC and a small **gate step** reads these values to decide whether to
actually run. Notes:

- `SYNC_ENABLED: "false"` pauses **everything** — scheduled, manual, and content-edit runs.
- Frequency only throttles the **scheduled** run. A `videos.txt` / `channels.txt` edit
  you push (or a **manual** Actions → Run workflow) still rebuilds immediately, as long
  as the sync is enabled.
- Prefer a no-code switch? You can also toggle the whole workflow from the repo's
  **Actions → "Update videos" → ⋯ → Enable/Disable workflow** — but the knobs above are
  the version-controlled, weekly-vs-daily way.

### Change the time of day
The knobs above can't move the run off **06:00 UTC** — that hour lives in the `cron:`
line itself, near the top of `.github/workflows/update-videos.yml`:

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

## The only files you ever edit

### `channels.txt` — your channels (one per line)
```
https://www.youtube.com/@AmplenoteAcademy
@KrishnaKanthB13
```
Paste a full URL or just the `@handle`. Add or remove lines anytime. Lines starting
with `#` are ignored (handy for temporarily disabling a channel without deleting it).

### `videos.txt` — optional one-off videos
For a specific video that isn't on your channels, or to override a description:
```
https://youtu.be/VIDEO_ID | My custom description
```
The video **title** is pulled automatically. Lines starting with `#` are ignored.

That's it. Commit the change and the Action rebuilds the site.

---

## Caveats & gotchas (worth knowing)

- **RSS only exposes the latest ~15 uploads per channel.** Older videos won't appear
  automatically — pin them by adding their links to `videos.txt`.
- **Deleting/unlisting a video on YouTube** removes it from the RSS feed, so it
  **disappears on the next run** (the stateless rebuild again).
- **Fresh data in the browser:** the page requests `videos.json` with a `?ts=`
  cache-buster (`app.js`), so visitors always get the newest copy right after a run,
  even past any CDN caching.
- **Dedupe / ordering:** if the same video shows up in more than one source, the first
  occurrence wins (channels are read before `videos.txt`); a manual description still
  overrides. Videos are sorted newest-first by published date.
- **No Jekyll:** a `.nojekyll` at the **repo root** keeps GitHub Pages from running
  Jekyll, so every file (including this folder) is served exactly as-is.

---

## How the site behaves (front-end)

- **Click-to-play, privacy-friendly:** each card shows a thumbnail facade; clicking it
  swaps in a `youtube-nocookie.com` embed that autoplays — so nothing loads from
  YouTube until you actually press play (fast page, fewer trackers).
- **Graceful loading:** animated skeleton placeholders show while `videos.json` loads;
  cards fade/slide in as you scroll (`IntersectionObserver`).
- **Long descriptions** are clamped to 3 lines with a **Show more / Show less** toggle.
- **Resilient data path:** the site prefers `videos.json`; if it's missing (e.g. a local
  preview before the Action has ever run) it falls back to reading `videos.txt`
  directly and fetches each title via YouTube's keyless oEmbed endpoint.
- **Thumbnail fallback:** if a video's `hqdefault` thumbnail is missing, it falls back
  to `mqdefault`.
- **Accessible & polite:** keyboard-operable play buttons, visible focus rings, and a
  `prefers-reduced-motion` mode that disables the animations.

---

## Hosting on GitHub Pages

This folder is already wired into the `krishnakanthb13.github.io` **user site**, which
is served from the repo root, so the page is live at `…github.io/A/aa/` with nothing
more to do. Two settings make the automation work:

1. **Settings → Pages → Source:** "Deploy from a branch" → `master` / `/ (root)`.
2. **Settings → Actions → General → Workflow permissions → "Read and write
   permissions"** — so the Action can commit the regenerated `videos.json`.

> **Reusing this as its own repo?** Copy the contents of `A/aa/` so `index.html` sits
> at that repo's root, keep the `scripts/` and `assets/` folders, put the workflow at
> `.github/workflows/`, and add a `.nojekyll` at that repo's root. The site then lives
> at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

---

## Local preview

Because the page reads files with `fetch()`, double-clicking `index.html` won't work.
Run a tiny server from inside this folder instead:
```powershell
cd "A\aa"
python -m http.server 8000
```
Then open http://localhost:8000

---

## File map
- `index.html` / `style.css` / `app.js` — the site
- `channels.txt` — **your channels** (you edit this)
- `videos.txt` — optional manual one-off links (you edit this)
- `videos.json` — generated automatically (don't edit by hand)
- `scripts/fetch-videos.mjs` — the sync script the Action runs
- `assets/` — favicon, logo, and banner (optimized for fast loading)
- `../../.github/workflows/update-videos.yml` — the automation (lives at the repo root,
  because GitHub only runs workflows from there)
- `../../.nojekyll` — disables Jekyll site-wide (must be at the repo root)

## Notes
- Links in the header point to your channels and your **Portfolio / Resume**
  (`https://krishnakanthb13.github.io/`). Edit them in `index.html` if they change.
- YouTube only allows the channel list/descriptions to be pulled server-side, which is
  exactly why the GitHub Action exists — a pure browser page can't do it.
- The channels currently have no public uploads, so `videos.json` starts empty;
  real videos flow in automatically once you publish (or add a one-off link to `videos.txt`).
</content>
