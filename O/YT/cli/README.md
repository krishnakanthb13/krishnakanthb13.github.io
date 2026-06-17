# ytt — YouTube Transcript CLI

A small, dependency-light command-line companion to **Transcript Studio for
YouTube**. Fetch a transcript by URL or video ID and print / copy / save it in
several formats.

## First time? Start here (no experience needed)

**Windows**
1. Install **Python** from [python.org/downloads](https://www.python.org/downloads/).
   On the first screen, **tick "Add Python to PATH"**, then click Install.
2. Download the project (green **Code → Download ZIP**) and **unzip** it.
3. Open the **`O/YT/cli`** folder and **double-click `ytt.bat`**.
4. The first run installs what it needs. When prompted, **paste a YouTube link**
   and press Enter.
5. The transcript is **copied to your clipboard** and **saved as a `.txt`** in
   that folder. Done!

**macOS / Linux**
1. Check Python 3 is present: `python3 --version` (install from python.org if not).
2. Download & unzip the project, open a Terminal in **`O/YT/cli`**.
3. First time only: `chmod +x ytt.sh`
4. Run: `./ytt.sh "https://youtu.be/VIDEOID"`

Once comfortable, use the options below to choose the language, format and
output folder.

## Requirements

- **Python 3.8+**
- [`youtube-transcript-api`](https://pypi.org/project/youtube-transcript-api/) — required
- [`pyperclip`](https://pypi.org/project/pyperclip/) — optional (clipboard)

The `ytt.bat` and `ytt.sh` launchers auto-install these on first run. To install
manually:

```bash
pip install youtube-transcript-api pyperclip
```

## Usage

```bash
python ytt.py <url-or-id> [options]
```

| Option | Description |
|---|---|
| `--lang`, `-l` | Preferred language code (`en`, `es`, `hi`, …). |
| `--format`, `-f` | `txt` (default), `time`, `srt`, `vtt`, `json`. |
| `--out`, `-o` | Folder to save into (default: current folder). |
| `--list` | List the video's available caption languages and exit. |
| `--no-save` | Print only; don't write a file. |
| `--no-copy` | Don't copy to the clipboard. |

The input can be a full URL (`watch`, `youtu.be`, `/shorts/`, `/embed/`) or a
bare 11-character video ID. Saved files are named `<videoId>_<timestamp>.<ext>`.

## Examples

```bash
# Plain text, saved to the current folder and copied to the clipboard
python ytt.py https://www.youtube.com/watch?v=dQw4w9WgXcQ

# SRT subtitles in English, into a specific folder
python ytt.py dQw4w9WgXcQ --lang en --format srt --out ./transcripts

# JSON to stdout only
python ytt.py https://youtu.be/dQw4w9WgXcQ --format json --no-save --no-copy

# What languages are available?
python ytt.py dQw4w9WgXcQ --list
```

### Windows

```bat
ytt.bat https://youtu.be/dQw4w9WgXcQ --format srt
```

Double-click `ytt.bat` with no arguments to be prompted for a URL/ID; the window
stays open so you can read the result.

### macOS / Linux

```bash
chmod +x ytt.sh        # first time only
./ytt.sh dQw4w9WgXcQ --format vtt --out ~/transcripts
```

---

Part of [Transcript Studio for YouTube](../README.md). Free —
[support it 💛](https://krishnakanthb13.github.io/S/).
