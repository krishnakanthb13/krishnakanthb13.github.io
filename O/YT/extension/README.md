# Transcript Studio for YouTube — Browser Extension

A Chrome/Edge **Manifest V3** side-panel extension that pulls the transcript or
subtitles from any YouTube video or Short. Pick the language, auto-translate,
search, click a line to jump the video, and export as TXT, timestamped TXT,
SRT, VTT, Markdown or JSON.

Everything runs locally in your browser — no servers, no accounts, no tracking.

> Part of [Transcript Studio for YouTube](../README.md) (which also ships a
> [command-line companion](../cli/README.md)). Free — if it helps you,
> [support it 💛](https://krishnakanthb13.github.io/S/).

---

## 🚀 Install (unpacked) — step by step

> Prefer a gentler, screenshot-style walkthrough? See the
> [top-level guide](../README.md#-how-to-use-the-extension--step-by-step).

**1. Get the files (one time)**
- On GitHub, click **Code → Download ZIP**, then **unzip** it.
- The extension is the folder **`O/YT/extension`**.

**2. Add it to your browser (one time)**
1. Go to `chrome://extensions` (or `edge://extensions`).
2. Toggle **Developer mode** (top-right).
3. Click **Load unpacked** and choose the **`O/YT/extension`** folder.
4. *(Optional)* Pin the 📝 icon via the puzzle-piece 🧩 menu.

**3. Use it (every time)**
1. Open any YouTube video or Short with captions.
2. Click the 📝 toolbar icon — the side panel opens on the right.
3. Pick a language (optional), then click **Get transcript**.

> Needs Chrome/Edge **114+** (for the side-panel API). Clicking the toolbar icon
> opens the panel directly; there is no popup.

### Updating later

Download the new files over the old folder, then go to `chrome://extensions`
and click the **↻ reload** icon on the Transcript Studio card.

---

## ✨ Features

| | |
|---|---|
| **Any video or Short** | Works wherever captions exist, including auto-generated tracks. |
| **Language picker** | Choose any caption track the video offers. |
| **Auto-translate** | Translate to any of YouTube's supported target languages. |
| **Click-to-seek** | Click a line and the video jumps to that moment. |
| **Follow video** | Auto-scrolls and highlights the line currently playing. |
| **Search** | Live match highlighting + hit counter (`Ctrl/⌘+F` to focus, `Esc` to clear). |
| **Export** | Plain text, timestamped text, `.srt`, `.vtt`, Markdown, JSON — copy or download. |
| **Reading stats** | Word count, line count, duration, estimated reading time. |
| **Themes & sizing** | Light / dark / system theme and adjustable font size, all remembered. |

---

## 🔒 Permissions — and why each is needed

| Permission | Why |
|---|---|
| `sidePanel` | The whole UI lives in the side panel. |
| `scripting` | Reads the player data and fetches captions from inside the YouTube tab. |
| `activeTab` | Acts only on the YouTube tab you're viewing. |
| `storage` | Remembers your theme, font size and format choices (`storage.sync`). |
| `downloads` | Saves the exported transcript file. |
| host: `youtube.com`, `youtu.be` | Limits all of the above to YouTube only. |

No analytics, no remote code, no network calls beyond YouTube's own caption
endpoint.

---

## 🛠 How it works (and why it's reliable)

Earlier do-it-yourself versions failed because they read YouTube's
`ytInitialPlayerResponse` from a content script's **isolated world**, where that
page variable doesn't exist — so they reported "no captions" on videos that
clearly had them.

Transcript Studio instead injects into the page's **MAIN world** via
`chrome.scripting.executeScript`, so it reads the real player object, and it
fetches the `timedtext` endpoint **same-origin from the youtube.com tab**. That
avoids the CSP/cross-origin errors that break fetches made from the extension's
own origin. It requests `json3` first (richest, with timing + formatting), then
falls back to `srv3` and legacy XML.

```
panel.js ──executeScript(MAIN world)──▶ youtube.com tab
            read player → caption tracks
            fetch timedtext (json3 → srv3 → xml), same-origin
         ◀── raw caption text ──
lib/captions.js  parse → segments → format (TXT/SRT/VTT/MD/JSON) + stats
```

---

## 📁 Files

```text
extension/
├── manifest.json          # MV3 manifest
├── service-worker.js      # opens the side panel on icon click
├── content.js             # detects in-app navigation → auto-refresh
├── panel.html             # side-panel markup
├── panel.css              # light / dark / system theming
├── panel.js               # the app: fetch, render, search, seek, export
├── lib/captions.js        # pure parse/convert/format/stats core (no DOM/chrome)
├── test/captions.test.js  # Node unit tests for the core
└── icons/                 # 16 / 48 / 128 px
```

---

## ✅ Develop & test

The caption core is pure (no DOM, no `chrome.*`) so it runs under Node:

```bash
node test/captions.test.js     # 16 tests
```

After editing any file, reload the extension at `chrome://extensions`
(the ↻ icon on the card) and reopen the side panel.

---

## 🩹 Troubleshooting

- **"Open a YouTube video"** — the active tab isn't a YouTube page; switch tabs and reopen the panel.
- **"No captions on this video"** — the video genuinely has no subtitles/transcript.
- **"Could not fetch transcript"** — YouTube occasionally rate-limits; reload the video tab and retry.
- **Nothing happens on icon click** — confirm Chrome/Edge is 114+; on older builds the side-panel API is unavailable.

---

## 🤝 Support

Free to use. If it saves you time:
**[krishnakanthb13.github.io/S](https://krishnakanthb13.github.io/S/)** —
GitHub Sponsors · Buy Me a Coffee · PayPal · UPI.

© 2026 Krishna Kanth B
