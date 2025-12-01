@echo off
setlocal enabledelayedexpansion

echo YouTube Transcript Fetcher
echo ==========================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check and install required packages
echo Checking dependencies...
python -c "import youtube_transcript_api" 2>nul
if errorlevel 1 (
    echo Installing youtube-transcript-api...
    pip install youtube-transcript-api
)

python -c "import pyperclip" 2>nul
if errorlevel 1 (
    echo Installing pyperclip...
    pip install pyperclip
)

echo.
set /p vid="Enter YouTube video ID: "

if "!vid!"=="" (
    echo No video ID provided!
    pause
    exit /b 1
)

REM Run the Python code
python -c "from youtube_transcript_api import YouTubeTranscriptApi; import re; import pyperclip; api = YouTubeTranscriptApi(); trans = api.fetch('!vid!'); raw = trans.to_raw_data(); paragraph = ' '.join(snippet['text'] for snippet in raw); paragraph = re.sub(r'\s+', ' ', paragraph).strip(); pyperclip.copy(paragraph); print('\nTranscript copied to clipboard!'); print(f'\nPreview (first 200 chars):\n{paragraph[:200]}...')"

if errorlevel 1 (
    echo.
    echo Error fetching transcript!
    pause
    exit /b 1
)

echo.
echo Done!
pause