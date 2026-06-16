# VTT Folder: Subtitle & Transcript Toolkit 📝

A small suite of **single-file, client-side** web tools for turning timestamped captions
and transcripts into clean, readable text — and (in the flagship) analysing that text with
AI. Everything runs **entirely in the browser**: no build step, no backend, no server-side
keys. Open an `.html` file and it just works. All three share one polished, responsive
design with a **light/dark theme**.

- **Lives in:** `R/VTT/` inside the `krishnakanthb13.github.io` repo.
- **Flagship goes live at:** `https://krishnakanthb13.github.io/R/VTT/` (serves `index.html`).

---

## Clickable Index

- [1. What's in here](#1-whats-in-here)
- [2. The tools](#2-the-tools)
  - [VTT Text Extractor Pro (`index.html`) — flagship](#vtt-text-extractor-pro-indexhtml--flagship)
  - [WEBVTT v2 (`WEBVTT v2.html`)](#webvtt-v2-webvtt-v2html)
  - [WEBVTT v1 (`WEBVTT v1.html`)](#webvtt-v1-webvtt-v1html)
  - [Feature matrix](#feature-matrix)
- [3. Shared design & dark mode](#3-shared-design--dark-mode)
- [4. How extraction works (auto-detect)](#4-how-extraction-works-auto-detect)
- [5. The YouTube fetcher (best-effort)](#5-the-youtube-fetcher-best-effort)
- [6. The AI assistant (Google Gemini)](#6-the-ai-assistant-google-gemini)
  - [Models](#models)
  - [Translate to any language](#translate-to-any-language)
  - [Your API key is saved in your browser](#your-api-key-is-saved-in-your-browser)
- [7. Privacy & security](#7-privacy--security)
- [8. Run locally](#8-run-locally)
- [9. File map](#9-file-map)
- [10. Version lineage](#10-version-lineage)

---

## 1. What's in here

Three self-contained HTML pages, all zero-dependency vanilla HTML/CSS/JS. They're an
evolution of one idea — *strip timestamps out of captions, keep the words* — from a minimal
extractor up to an AI-assisted tool that also pulls captions straight from YouTube.

```
R/VTT/
├── index.html        # ⭐ VTT Text Extractor Pro (flagship — VTT + transcripts + YouTube + AI)
├── WEBVTT v2.html    # AI-assisted extractor (no YouTube fetch)
├── WEBVTT v1.html    # Minimal VTT → text extractor
└── README.md         # This file
```

> **`index.html` is the canonical tool.** The two versioned files are kept as simpler,
> fully-functional alternatives — handy when you want a no-frills extractor or have no
> Gemini key. They are not deprecated; they just do less.

---

## 2. The tools

### VTT Text Extractor Pro (`index.html`) — flagship
The full-featured tool, served at the folder root.

* **Input — two formats, auto-detected:** paste a **`.vtt` caption file** *or* a **plain
  timestamped transcript** (e.g. a YouTube "Show transcript" copy, or notes with `[1:23]` /
  `(2:00:05)` stamps). The tool detects which and handles both — see
  [§4](#4-how-extraction-works-auto-detect).
* **Load a file:** **upload** or **drag-and-drop** a `.vtt` / `.srt` / `.txt` file straight
  onto the input box (it auto-extracts on drop).
* **Get input fast:** also **load a sample**, **clear**, or **fetch from a YouTube URL**
  (see [§5](#5-the-youtube-fetcher-best-effort)).
* **Extract:** strips the `WEBVTT` header, `-->` cue timings, `align:`/`position:` metadata,
  inline `<00:00:00.000>` timestamps and all `<c …>` styling tags, then de-duplicates
  repeated lines.
* **Output:** clean joined text plus live **word / character / line** stats. A **"keep
  timestamps"** toggle switches the output (and TXT download) to `[m:ss] line` form.
* **Export:** **Copy**, **Download TXT** (honours the timestamp toggle), or **Download SRT**
  (re-pairs each line with its cue timing; for transcript input it synthesises sensible cue
  ranges).
* **AI assistant (optional):** bring a free Google Gemini key and run Summarize, **Translate
  (to any of 12 languages)**, Keywords, Sentiment, Bullet points, Questions, or a **custom
  command** over the extracted text. See [§6](#6-the-ai-assistant-google-gemini). The key,
  model, and translate language are **remembered in your browser** across refreshes.

### WEBVTT v2 (`WEBVTT v2.html`)
A lighter AI-assisted extractor. Same robust VTT extraction, live stats, TXT/SRT export, and
the same up-to-date Gemini AI assistant with browser-saved key. It does **not** include the
YouTube fetcher, transcript auto-detect, file upload, the keep-timestamps toggle, or the
translate language picker (its **Translate** command targets Spanish). Expects real `.vtt`
input. Pick this for a focused, slightly lighter page.

### WEBVTT v1 (`WEBVTT v1.html`)
A minimal, no-AI extractor: paste VTT → get clean text → copy. Good for a quick strip with
zero setup. (Its tag-cleaning was hardened so coloured caption tags like `<c.colorE5E5E5>`
no longer leak into the output.)

### Feature matrix

| Capability | `index.html` (flagship) | `WEBVTT v2` | `WEBVTT v1` |
| :--- | :---: | :---: | :---: |
| VTT extraction + de-dupe | ✅ | ✅ | ✅ |
| Transcript auto-detect (non-`.vtt`) | ✅ | — | — |
| YouTube URL fetch | ✅ | — | — |
| File upload + drag-and-drop | ✅ | — | — |
| Word / char / line stats | ✅ | ✅ | — |
| Copy / Download TXT | ✅ | ✅ | Copy only |
| Download SRT | ✅ | ✅ | — |
| Keep-timestamps toggle | ✅ | — | — |
| Gemini AI commands | ✅ | ✅ | — |
| Translate language picker | ✅ (12) | Spanish | — |
| Saved API key + model | ✅ | ✅ | — |
| Light / dark theme | ✅ | ✅ | ✅ |
| Non-blocking toasts | ✅ | ✅ | ✅ |

---

## 3. Shared design & dark mode

All three pages share one design system: a gradient backdrop, frosted cards, gradient
buttons, and a consistent spacing/typography scale. Colours are driven by **CSS custom
properties**, so each page ships a **light and a dark theme**.

- A floating **🌙 / ☀️ toggle** (top-right) switches themes; the choice is saved in
  `localStorage` (`vtt_theme`) and shared across all three tools.
- On first visit the theme follows your OS (`prefers-color-scheme`); a tiny pre-paint script
  in `<head>` applies it **before first paint**, so there's no flash of the wrong theme.
- Confirmations use **non-blocking toasts** instead of intrusive `alert()` popups.
- Layouts are **responsive** — the two-column grid collapses to one column, and button rows
  reflow, on narrow screens.

---

## 4. How extraction works (auto-detect)

The flagship inspects the input and picks one of two paths:

**If it contains `-->` cue arrows → VTT mode.**
1. Skip the header (everything up to the first blank line — `WEBVTT`, `Kind:`, `Language:`).
2. Skip structural lines (`-->`, `align:`, `position:`) and blanks.
3. Remove inline `<hh:mm:ss.mmm>` timestamps and every `<c …>` / `</c>` styling tag (plus any
   remaining `<…>` tag as a catch-all).
4. De-duplicate (YouTube auto-captions repeat the previous line each cue).

**Otherwise → transcript mode.** Treats the input as inline-timestamped prose: strips a
leading `0:00` / `00:00` / `1:02:03` / `[1:23]` / `(2:00:05)` stamp from each line, de-dupes,
and synthesises `start --> end` ranges (each line ends where the next begins) so **SRT export
still works**. This is what a YouTube transcript-panel copy produces — the kind of input the
VTT-only tools return empty on.

Both paths keep each surviving line paired with a timing, so the tool can rebuild an **SRT**
file on export and offer the **keep-timestamps** view. (`WEBVTT v1`/`v2` implement VTT mode
only.)

---

## 5. The YouTube fetcher (best-effort)

The flagship's **▶️ Fetch VTT** accepts a full YouTube URL (`watch?v=`, `youtu.be/`,
`/embed/`, `/shorts/`, `/live/`) or a bare 11-character video ID, then tries to pull the
video's captions and auto-extract them.

> ⚠️ **This is best-effort, by necessity.** A purely static page cannot call `youtube.com`
> directly (browser CORS), and YouTube increasingly blocks anonymous caption requests. The
> fetcher routes through public CORS proxies (`allorigins`, `corsproxy.io`) and clearly
> reports when it can't retrieve anything — in which case open the video, copy its captions
> (or its transcript panel), and paste them into the input box. The manual paste path always
> works, and accepts transcript-panel text too.

It first asks YouTube which caption tracks exist, prefers an English track, requests it as
WebVTT, and falls back to plain English auto-captions if needed.

---

## 6. The AI assistant (Google Gemini)

The flagship and `WEBVTT v2` include an optional assistant that calls the **Google Gemini
API** directly from your browser. You provide your own key (a free one works) — get it from
[Google AI Studio](https://aistudio.google.com/app/api-keys).

One-click commands: **Summarize · Translate · Keywords · Sentiment · Bullet points ·
Questions**, plus a free-text **custom command**. Output can be copied or downloaded.

### Models

The dropdown lists only **free-tier, non-Pro** models, with the deprecation-proof aliases
first (verified June 2026):

| Option | API ID | Notes |
| :--- | :--- | :--- |
| Gemini Flash (Latest) | `gemini-flash-latest` | **Default.** Alias that always tracks the newest Flash — survives model retirements. |
| Gemini Flash-Lite (Latest) | `gemini-flash-lite-latest` | Alias for the newest, fastest Flash-Lite. |
| Gemini 3.5 Flash | `gemini-3.5-flash` | Newest GA Flash; most capable free option. |
| Gemini 3.1 Flash-Lite | `gemini-3.1-flash-lite` | Highest free-tier request limits. |
| Gemini 2.5 Flash | `gemini-2.5-flash` | Legacy fallback (being phased out). |

> **Why the `-latest` aliases?** Google retires specific Gemini versions on a rolling basis
> (the whole 2.x line is winding down). Pinning to `gemini-flash-latest` means the tool keeps
> working without code edits as new models ship. **Pro models are intentionally excluded** —
> they left the free tier in April 2026.

### Translate to any language

In the **flagship**, a **🌐 Translate to:** picker offers 12 target languages (Spanish,
French, German, Italian, Portuguese, Hindi, Arabic, Mandarin Chinese, Japanese, Korean,
Russian, English); the **Translate** command uses your choice, which is remembered across
refreshes. In `WEBVTT v2`, Translate targets **Spanish**.

### Your API key is saved in your browser

The flagship and `v2` **remember your API key and chosen model in `localStorage`** (the
flagship also remembers the translate language) — enter it once and it's restored
automatically on every refresh, on that device only. It is **never uploaded**: the key is
read from the page and sent only to Google's API when you run a command. A **🗑️ Forget key**
link next to the field clears it instantly. Because both tools use the same storage key, a
key entered in one is available in the other on the same browser.

---

## 7. Privacy & security

- **No backend.** Nothing is uploaded or logged; all processing happens in your browser.
- **Your key stays in your browser.** The Gemini key lives only in this browser's
  `localStorage` and is sent **directly** to Google's API — never to this repo or anywhere
  else. (It's passed as a URL query parameter to Google, the standard Gemini REST pattern —
  fine for a personal tool.) Clear it any time with **🗑️ Forget key**.
- **Safe to host publicly.** Because every key is entered by the visitor, these files sit on
  GitHub Pages with no risk of leaking credentials or incurring billing.

---

## 8. Run locally

No install — they're static files. **Double-click any `.html`** and it opens straight from
disk. For a served preview that mirrors GitHub Pages:

```bash
python -m http.server 8000   # or:  npx http-server
```

Then open `http://localhost:8000/R/VTT/` (flagship) or one of the versioned files by name.

> One caveat for the YouTube fetcher: the public CORS proxies it uses generally work the same
> from `file://` and from a served origin, but if a proxy is rate-limited or down the fetch
> fails gracefully — paste the captions (or transcript) manually.

---

## 9. File map

- `index.html` — the flagship **VTT Text Extractor Pro** (promoted from the old
  `WEBVTT v3 - IP.html`). Format auto-detect (VTT + transcripts), YouTube fetch, file
  upload/drag-drop, stats, TXT/SRT export, keep-timestamps toggle, light/dark theme, and the
  Gemini AI assistant (with a 12-language Translate picker and a browser-saved key). Named
  `index.html` so `…github.io/R/VTT/` serves it automatically.
- `WEBVTT v2.html` — AI-assisted VTT extractor (stats, TXT/SRT, Gemini, light/dark theme)
  without the YouTube fetcher, transcript auto-detect, file upload, keep-timestamps toggle, or
  translate picker.
- `WEBVTT v1.html` — minimal VTT → text extractor (no AI), with the light/dark theme.
- `README.md` — this file.

---

## 10. Version lineage

| Stage | File | What it added |
| :--- | :--- | :--- |
| v1 | `WEBVTT v1.html` | First VTT-aware extractor (header/cue skipping, dedup). |
| v2 | `WEBVTT v2.html` | "Pro" UI, stats, TXT/SRT export, Gemini AI assistant. |
| v3 → flagship | `index.html` | YouTube fetcher; **transcript auto-detect** (absorbing the old standalone Transcript Converter); browser-saved API key. Promoted to the folder default. |

### Recent work (2026-06)

**`v0.0.21` — overhaul & hardening**
- Implemented the previously-missing `fetchYouTubeVTT()` (the button used to throw) with a
  robust video-ID parser and graceful CORS-proxy fallbacks.
- Updated all Gemini model lists to current **free-tier, non-Pro** IDs and added the
  deprecation-proof `-latest` aliases; removed the Pro option.
- **Folded the standalone "Transcript Converter" into the flagship** via format auto-detect,
  then removed the redundant file.
- **Persist the Gemini API key + model in `localStorage`** (with a *Forget key* control) in
  both AI tools.
- Replaced blocking `alert()` popups with non-blocking toasts in the flagship.
- Hardened `WEBVTT v1`'s tag-stripping; fixed SRT export leaking `align:`/`position:` cue
  settings into the time line.
- Restored the author/footer credit and the Google AI Studio key link; promoted v3 to
  `index.html`.

**`v0.0.22` — flagship features**
- **File upload + drag-and-drop** of `.vtt`/`.srt`/`.txt` onto the input.
- **Translate language picker** (12 languages, persisted) — replaces the hardcoded Spanish.
- **Keep-timestamps toggle** — render output & TXT export as `[m:ss]` lines; stats follow the
  view.
- **Light/dark theme toggle** (system-aware, persisted, no-flash) and a move to CSS custom
  properties.

**`v0.0.23` — world-class polish**
- Brought **all three pages onto one cohesive design system**: themed cards, buttons,
  spacing, and the light/dark theme + toasts now ship in `v1` and `v2` too.
- Refined button placement, padding, alignment, and responsive breakpoints across the trio.

---

*Made with ❤️ for subtitle enthusiasts — Made By Krishna Kanth B ·
[BKK©](https://krishnakanthb13.github.io/)*
</content>
