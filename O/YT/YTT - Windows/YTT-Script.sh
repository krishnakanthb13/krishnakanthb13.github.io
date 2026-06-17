#!/bin/bash

# YouTube Transcript to Clipboard Script

echo "YouTube Transcript Fetcher"
echo "=========================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python3 is not installed"
    exit 1
fi

# Check and install required packages
echo "Checking dependencies..."
python3 -c "import youtube_transcript_api" 2>/dev/null || {
    echo "Installing youtube-transcript-api..."
    pip3 install youtube-transcript-api
}

python3 -c "import pyperclip" 2>/dev/null || {
    echo "Installing pyperclip..."
    pip3 install pyperclip
}

echo ""
read -p "Enter YouTube video ID: " vid

if [ -z "$vid" ]; then
    echo "No video ID provided!"
    exit 1
fi

# Run the Python code inline
python3 << EOF
from youtube_transcript_api import YouTubeTranscriptApi
import re
import pyperclip

try:
    api = YouTubeTranscriptApi()
    print("Fetching transcript for video: $vid")
    trans = api.fetch("$vid")
    raw = trans.to_raw_data()
    
    paragraph = " ".join(snippet["text"] for snippet in raw)
    paragraph = re.sub(r'\s+', ' ', paragraph).strip()
    
    pyperclip.copy(paragraph)
    print("\n✓ Transcript copied to clipboard!")
    print(f"\nPreview (first 200 chars):\n{paragraph[:200]}...")
except Exception as e:
    print(f"Error: {e}")
    exit(1)
EOF

echo ""
echo "Done!"