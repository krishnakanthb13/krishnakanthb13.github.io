from youtube_transcript_api import YouTubeTranscriptApi
import re
import pyperclip

def get_transcript(video_id):
    """Fetch and format YouTube transcript"""
    try:
        api = YouTubeTranscriptApi()
        
        # Fetch transcript
        print(f"Fetching transcript for video: {video_id}")
        trans = api.fetch(video_id)
        raw = trans.to_raw_data()
        
        # Join into paragraph
        paragraph = " ".join(snippet["text"] for snippet in raw)
        paragraph = re.sub(r'\s+', ' ', paragraph).strip()
        
        return paragraph
    except Exception as e:
        print(f"Error fetching transcript: {e}")
        return None

def main():
    # Get video ID from user
    vid = input("Enter YouTube video ID: ").strip()
    
    if not vid:
        print("No video ID provided!")
        return
    
    # Get transcript
    transcript = get_transcript(vid)
    
    if transcript:
        # Copy to clipboard
        pyperclip.copy(transcript)
        print("\n✓ Transcript copied to clipboard!")
        print(f"\nPreview (first 200 chars):\n{transcript[:200]}...")
    else:
        print("Failed to get transcript")

if __name__ == "__main__":
    main()