@echo off
setlocal enabledelayedexpansion

REM ===== CONFIGURATION =====
REM Set your desired folder path here
set "TRANSCRIPT_FOLDER=C:\Users\ADMIN\Downloads\96 YT Transcripts"
REM =========================

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

REM Create transcript folder if it doesn't exist
if not exist "!TRANSCRIPT_FOLDER!" (
    echo Creating folder: !TRANSCRIPT_FOLDER!
    mkdir "!TRANSCRIPT_FOLDER!"
)

REM Get current timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set timestamp=!datetime:~0,8!_!datetime:~8,6!

REM Set filename
set "filename=!vid!_!timestamp!.txt"
set "filepath=!TRANSCRIPT_FOLDER!\!filename!"

REM Escape backslashes for Python (Turns C:\Users into C:\\Users)
set "pyfilepath=!filepath:\=\\!"

REM Run the Python code
REM FIX APPLIED BELOW: Used string concatenation (+ filepath) instead of embedding !filepath! inside quotes
python -c "from youtube_transcript_api import YouTubeTranscriptApi; import re; import pyperclip; import os; api = YouTubeTranscriptApi(); trans = api.fetch('!vid!'); raw = trans.to_raw_data(); paragraph = ' '.join(snippet['text'] for snippet in raw); paragraph = re.sub(r'\s+', ' ', paragraph).strip(); pyperclip.copy(paragraph); filepath = '!pyfilepath!'; open(filepath, 'w', encoding='utf-8').write(paragraph); print('\n✓ Transcript copied to clipboard!'); print('✓ Saved to: ' + filepath); print('\nPreview (first 200 chars):\n' + paragraph[:200] + '...')"

if errorlevel 1 (
    echo.
    echo Error fetching transcript!
    pause
    exit /b 1
)

echo.
echo Done!
pause