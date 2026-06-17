#!/usr/bin/env python3
"""
ytt.py — YouTube Transcript fetcher (CLI companion to Transcript Studio).

Fetch a transcript by video URL or ID, in any available language, and print /
copy / save it as plain text, timestamped text, SRT, VTT or JSON.

Examples
--------
    python ytt.py https://www.youtube.com/watch?v=dQw4w9WgXcQ
    python ytt.py dQw4w9WgXcQ --lang en --format srt --out ./transcripts
    python ytt.py https://youtu.be/dQw4w9WgXcQ --format json --no-copy
    python ytt.py --list dQw4w9WgXcQ          # list available languages

Dependencies (auto-installed by ytt.bat / ytt.sh, or: pip install ...):
    youtube-transcript-api      required
    pyperclip                   optional (clipboard); silently skipped if absent
"""
import argparse
import os
import re
import sys
from datetime import datetime

try:
    from youtube_transcript_api import YouTubeTranscriptApi
except ImportError:
    sys.exit("Missing dependency. Run:  pip install youtube-transcript-api")

try:
    import pyperclip
except ImportError:
    pyperclip = None


# --------------------------------------------------------------------------- #
# Parsing helpers
# --------------------------------------------------------------------------- #
def extract_video_id(value: str) -> str:
    """Accept a bare ID or any common YouTube URL shape and return the ID."""
    value = value.strip()
    patterns = [
        r"(?:v=|/watch\?.*v=)([A-Za-z0-9_-]{11})",
        r"youtu\.be/([A-Za-z0-9_-]{11})",
        r"/shorts/([A-Za-z0-9_-]{11})",
        r"/embed/([A-Za-z0-9_-]{11})",
    ]
    for pat in patterns:
        m = re.search(pat, value)
        if m:
            return m.group(1)
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", value):
        return value
    raise ValueError(f"Could not find a video ID in: {value!r}")


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def hms(seconds: float, sep: str) -> str:
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int(round((seconds - int(seconds)) * 1000))
    return f"{h:02d}:{m:02d}:{s:02d}{sep}{ms:03d}"


def clock(seconds: float) -> str:
    s = int(seconds)
    h, m, sec = s // 3600, (s % 3600) // 60, s % 60
    return f"{h}:{m:02d}:{sec:02d}" if h else f"{m}:{sec:02d}"


# --------------------------------------------------------------------------- #
# Formatters  (snippet = {"text", "start", "duration"})
# --------------------------------------------------------------------------- #
def to_txt(snips):
    return clean(" ".join(s["text"] for s in snips))


def to_timestamped(snips):
    return "\n".join(f"[{clock(s['start'])}] {clean(s['text'])}" for s in snips)


def _end(snips, i):
    s = snips[i]
    if s.get("duration"):
        return s["start"] + s["duration"]
    return snips[i + 1]["start"] if i + 1 < len(snips) else s["start"] + 2


def to_srt(snips):
    out = []
    for i, s in enumerate(snips):
        out.append(f"{i + 1}\n{hms(s['start'], ',')} --> {hms(_end(snips, i), ',')}\n{clean(s['text'])}\n")
    return "\n".join(out)


def to_vtt(snips):
    body = "\n\n".join(
        f"{hms(s['start'], '.')} --> {hms(_end(snips, i), '.')}\n{clean(s['text'])}"
        for i, s in enumerate(snips)
    )
    return f"WEBVTT\n\n{body}\n"


def to_json(snips):
    import json
    return json.dumps(
        [{"start": round(s["start"], 3), "dur": round(s.get("duration", 0), 3), "text": clean(s["text"])}
         for s in snips],
        ensure_ascii=False, indent=2,
    )


FORMATTERS = {"txt": to_txt, "time": to_timestamped, "srt": to_srt, "vtt": to_vtt, "json": to_json}
EXTS = {"txt": "txt", "time": "txt", "srt": "srt", "vtt": "vtt", "json": "json"}


# --------------------------------------------------------------------------- #
# Transcript API (works across youtube-transcript-api versions)
# --------------------------------------------------------------------------- #
def list_languages(video_id):
    try:                                   # v1.x instance API
        api = YouTubeTranscriptApi()
        listing = api.list(video_id)
    except (AttributeError, TypeError):     # older static API
        listing = YouTubeTranscriptApi.list_transcripts(video_id)
    rows = []
    for tr in listing:
        kind = "auto" if getattr(tr, "is_generated", False) else "manual"
        rows.append((tr.language_code, tr.language, kind))
    return rows


def fetch_snippets(video_id, languages):
    langs = [languages] if isinstance(languages, str) and languages else (languages or None)
    # v1.x instance API
    try:
        api = YouTubeTranscriptApi()
        fetched = api.fetch(video_id, languages=langs) if langs else api.fetch(video_id)
        return fetched.to_raw_data()
    except (AttributeError, TypeError):
        pass
    # older static API
    if langs:
        return YouTubeTranscriptApi.get_transcript(video_id, languages=langs)
    return YouTubeTranscriptApi.get_transcript(video_id)


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
def main():
    p = argparse.ArgumentParser(description="Fetch a YouTube transcript from the command line.")
    p.add_argument("video", nargs="?", help="YouTube URL or 11-char video ID")
    p.add_argument("--lang", "-l", help="preferred language code, e.g. en, es, hi")
    p.add_argument("--format", "-f", choices=FORMATTERS, default="txt", help="output format (default: txt)")
    p.add_argument("--out", "-o", default=".", help="folder to save into (default: current folder)")
    p.add_argument("--list", action="store_true", help="list available caption languages and exit")
    p.add_argument("--no-save", action="store_true", help="print only, do not write a file")
    p.add_argument("--no-copy", action="store_true", help="do not copy to clipboard")
    args = p.parse_args()

    raw = args.video or input("Enter YouTube URL or video ID: ").strip()
    if not raw:
        sys.exit("No video provided.")
    try:
        video_id = extract_video_id(raw)
    except ValueError as e:
        sys.exit(str(e))

    if args.list:
        try:
            rows = list_languages(video_id)
        except Exception as e:
            sys.exit(f"Could not list languages: {e}")
        print(f"Available caption tracks for {video_id}:")
        for code, name, kind in rows:
            print(f"  {code:<8} {name} ({kind})")
        return

    print(f"Fetching transcript for {video_id} ...")
    try:
        snippets = fetch_snippets(video_id, args.lang)
    except Exception as e:
        sys.exit(f"Error fetching transcript: {e}")
    if not snippets:
        sys.exit("Transcript was empty.")

    content = FORMATTERS[args.format](snippets)

    if not args.no_copy and pyperclip:
        try:
            pyperclip.copy(content)
            print("Copied to clipboard.")
        except Exception:
            pass

    if not args.no_save:
        out_dir = os.path.abspath(args.out)
        os.makedirs(out_dir, exist_ok=True)
        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        path = os.path.join(out_dir, f"{video_id}_{stamp}.{EXTS[args.format]}")
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(content)
        print(f"Saved to: {path}")

    preview = clean(content)[:200]
    print(f"\nPreview:\n{preview}{'...' if len(content) > 200 else ''}")


if __name__ == "__main__":
    main()
