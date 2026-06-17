# Transcript Studio for YouTube

Get the **transcript / subtitles** of any YouTube video or Short in seconds —
pick the language, translate it, search it, click a line to jump the video, and
save it as **TXT, timestamped TXT, SRT, VTT, Markdown or JSON**.

It comes in two flavours so **anyone** can use it:

- 🧩 **Browser extension** — point-and-click, in a side panel next to the video. *(Start here if you're not technical.)*
- 💻 **Command-line tool** (`ytt`) — for power users, batch jobs and automation.

Free, private (everything runs locally — no servers, no sign-up, no tracking).
If it saves you time, please [support it 💛](https://krishnakanthb13.github.io/S/).

---

## 👥 Who is this for, and which tool should I use?

| You are… | You want to… | Use the… | Why |
|---|---|---|---|
| 📚 Student / researcher | Read or quote a lecture/talk, search for a phrase | **Extension** | Search + click-to-seek + copy in the browser |
| ✍️ Writer / journalist | Pull quotes, get a clean paragraph or Markdown | **Extension** | One-click copy, Markdown export with timestamp links |
| 🎬 Creator / editor | Make `.srt`/`.vtt` subtitle files | **Either** | Both export SRT/VTT identically |
| 🌍 Language learner | Read along, translate captions | **Extension** | Auto-translate + "follow video" highlight |
| 🧑‍💻 Developer / analyst | Grab transcripts for many videos, scripting | **CLI** | Runs headless, takes URLs as arguments, saves files |
| 🗂️ Anyone archiving | Save a timestamped copy of a transcript | **Either** | Both save dated files |

**Rule of thumb:** if you just want to read/copy/translate one video → **extension**.
If you want to process many videos or automate it → **CLI**.

---

## 🧩 How to use the EXTENSION — step by step

> Works in **Google Chrome** or **Microsoft Edge** (version 114 or newer — any
> browser updated in the last couple of years is fine).

### A. Get the files onto your computer (one time)

1. Go to the project on GitHub.
2. Click the green **Code** button → **Download ZIP**.
3. **Unzip** the downloaded file (right-click → *Extract All* on Windows, or
   double-click on Mac). Remember where you put it.
4. Inside, the extension lives in the folder **`O/YT/extension`**.

### B. Add it to your browser (one time)

1. Open your browser and type this in the address bar, then press Enter:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
2. Turn on **Developer mode** (a switch in the top-right corner).
3. Click **Load unpacked**.
4. Select the **`O/YT/extension`** folder from step A and click *Select Folder*.
5. You'll now see **"Transcript Studio for YouTube"** in your list. 🎉
6. *(Optional but handy)* Click the little puzzle-piece 🧩 icon near the address
   bar and **pin** Transcript Studio so its 📝 icon is always visible.

### C. Use it (every time)

1. Open any **YouTube video or Short** that has captions.
2. Click the **📝 Transcript Studio icon** in your toolbar — a **panel opens on
   the right** side of the window.
3. *(Optional)* Choose a **Caption** language from the first dropdown.
4. *(Optional)* Choose a language in **Translate** to auto-translate it.
5. Click the big **Get transcript** button. The transcript appears.

### D. What you can do with the transcript

| I want to… | Do this |
|---|---|
| **Jump the video to a line** | Click any line in the transcript |
| **Follow along while it plays** | Click **🎯 Follow video** — it auto-scrolls & highlights |
| **Find a word/phrase** | Type in the **Search** box (or press `Ctrl/⌘ + F`) |
| **Hide/show the timestamps** | Click **🕒 Timestamps** |
| **Make text bigger/smaller** | Click **A+** / **A−** |
| **Copy it** | Pick a format (bottom-left) → click **📋 Copy** |
| **Save it as a file** | Pick a format → click **💾 Save** (goes to your Downloads) |
| **Switch light/dark theme** | Click the **🌗** icon (top-right) |

**Which format should I pick?**

| Format | Use it for |
|---|---|
| **Plain text** | Reading, pasting into a doc or email |
| **Timestamped text** | Notes where you want `[1:23]` markers |
| **SubRip (.srt)** | Subtitles for most video editors / players |
| **WebVTT (.vtt)** | Subtitles for the web / HTML5 video |
| **Markdown (.md)** | Blog posts / notes — timestamps become clickable links |
| **JSON (.json)** | Feeding the data into another program |

> 📖 More detail (permissions, internals, troubleshooting): [`extension/README.md`](extension/README.md)

---

## 💻 How to use the CLI — step by step

The `ytt` command fetches a transcript without opening a browser. Great for
doing many videos or putting in a script.

### Windows (easiest path)

1. **Install Python** (one time): get it from [python.org](https://www.python.org/downloads/).
   On the first install screen, **tick "Add Python to PATH"**, then install.
2. Download the project (Code → Download ZIP) and unzip it.
3. Open the **`O/YT/cli`** folder.
4. **Double-click `ytt.bat`**. The first run installs what it needs automatically.
5. When asked, **paste a YouTube link** and press Enter.
6. Your transcript is **copied to the clipboard** and **saved as a `.txt` file**
   in that same folder.

To control the output, run it from a terminal instead of double-clicking:

```bat
ytt.bat https://youtu.be/VIDEOID --format srt --out "C:\My Transcripts"
```

### macOS / Linux

1. Make sure **Python 3** is installed (`python3 --version`).
2. Download & unzip the project, open a Terminal in **`O/YT/cli`**.
3. First time only: `chmod +x ytt.sh`
4. Run it:

```bash
./ytt.sh https://www.youtube.com/watch?v=VIDEOID --format txt
```

### Common commands

```bash
python ytt.py "<link or 11-char id>"            # plain text, saved + copied
python ytt.py "<link>" --format srt             # make a .srt subtitle file
python ytt.py "<link>" --lang en                # force English captions
python ytt.py "<link>" --list                   # list available languages
python ytt.py "<link>" --no-save --no-copy      # just print to screen
```

> 📖 Full option list & examples: [`cli/README.md`](cli/README.md)

---

## 🔁 Extension ↔ CLI — feature & output parity ("code sync")

Both tools share the **same transcript logic**, so a `.srt` from the extension
and a `.srt` from the CLI are byte-for-byte equivalent. The table below is the
honest, current state of what each one does.

| Capability | 🧩 Extension | 💻 CLI | Notes |
|---|---|---|---|
| Source: video / Short / `youtu.be` / embed | ✅ | ✅ | Same ID extraction |
| Export **Plain text** | ✅ | ✅ | Identical (whitespace collapsed) |
| Export **Timestamped text** `[m:ss]` | ✅ | ✅ | Identical clock format |
| Export **SRT** (`00:00:01,234`) | ✅ | ✅ | Identical, sequential numbering |
| Export **VTT** (`00:00:01.234`) | ✅ | ✅ | Identical `WEBVTT` output |
| Export **JSON** (`start`/`dur`/`text`) | ✅ | ✅ | Identical schema |
| Export **Markdown** | ✅ | ➖ | Extension only (clickable timestamp links) |
| Pick caption **language** | ✅ dropdown | ✅ `--lang` | — |
| List available languages | ➖ (shown in dropdown) | ✅ `--list` | — |
| **Auto-translate** | ✅ | ➖ | Extension only |
| **Search** within transcript | ✅ | ➖ | Use your editor / `grep` for CLI output |
| **Click-to-seek** / follow video | ✅ | ➖ | Browser-only by nature |
| Copy to clipboard | ✅ | ✅ (if `pyperclip`) | — |
| Save to file | ✅ Downloads | ✅ `--out` folder | — |
| Batch / automation | ➖ | ✅ | CLI takes args, runs headless |
| Remembers your settings | ✅ `storage.sync` | ➖ | Pass flags each run for the CLI |

The shared rules both implement the same way: same video-ID patterns, same
`m:ss` / `h:mm:ss` clock, SRT uses `,` and VTT uses `.` for milliseconds, cue
end-times fall back to the next cue's start when a duration is missing, and all
text has runs of whitespace collapsed to single spaces.

---

## 🧬 Where this came from (consolidation map)

This folder previously held **four** half-finished, overlapping side projects.
Nothing useful was thrown away — each fed into the unified product:

| Old folder | What it did | What was salvaged → where |
|---|---|---|
| `YSD` | "Subtitle Downloader" sidebar, fake toggles, SRT only | UI/toolbar ideas, language tabs, icons → **extension panel & icons** |
| `YSD2` | "Simple" popup; clean SRT/VTT but broken fetch | SRT/VTT conversion, downloads + storage approach → **`lib/captions.js`** |
| `YTT` | "Transcript Fetcher"; json3 fallback, Shorts support | MAIN-world fetch idea, `json3→srv3` fallback, Shorts/`youtu.be` handling → **`panel.js`** |
| `YTT - Windows` | Python/bat/sh transcript scripts, hardcoded paths | The Python flow, cleaned & parameterized → **`cli/`** |

Why consolidate? Three near-identical extensions = three things to maintain and
three sets of bugs. One reliable tool (plus a CLI) is easier to trust, ship, and
support. The headline fix: the old extensions read YouTube's player data from
the wrong JavaScript context (the content-script "isolated world"), so they
failed on videos that *did* have captions. The unified extension reads it from
the page's **MAIN world** and fetches captions **same-origin**, which is what
makes it actually work.

---

## 🤝 Support

These tools are free. If they help you, support the work:
**[krishnakanthb13.github.io/S](https://krishnakanthb13.github.io/S/)** —
GitHub Sponsors · Buy Me a Coffee · PayPal · UPI.

© 2026 Krishna Kanth B
