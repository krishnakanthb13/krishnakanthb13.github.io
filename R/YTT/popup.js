document.getElementById('fetchBtn').addEventListener('click', fetchTranscript);
document.getElementById('copyBtn').addEventListener('click', copyTranscript);
document.getElementById('downloadBtn').addEventListener('click', downloadTranscript);

let currentTranscript = '';

async function fetchTranscript() {
  const statusEl = document.getElementById('status');
  const transcriptEl = document.getElementById('transcript');
  const fetchBtn = document.getElementById('fetchBtn');
  const actionsEl = document.getElementById('actions');

  statusEl.className = 'info';
  statusEl.textContent = 'Fetching transcript...';
  statusEl.classList.remove('hidden');
  transcriptEl.classList.add('hidden');
  actionsEl.classList.add('hidden');
  fetchBtn.disabled = true;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('youtube.com/watch')) {
      throw new Error('Please open a YouTube video page');
    }

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractTranscript
    });

    const transcript = results[0].result;
    
    if (transcript.error) {
      throw new Error(transcript.error);
    }

    currentTranscript = transcript.text;
    transcriptEl.textContent = currentTranscript;
    transcriptEl.classList.remove('hidden');
    actionsEl.classList.remove('hidden');
    
    statusEl.className = 'success';
    statusEl.textContent = `✓ Transcript fetched successfully (${transcript.text.length} characters)`;
  } catch (error) {
    statusEl.className = 'error';
    statusEl.textContent = `✗ Error: ${error.message}`;
  } finally {
    fetchBtn.disabled = false;
  }
}

function copyTranscript() {
  navigator.clipboard.writeText(currentTranscript);
  const statusEl = document.getElementById('status');
  statusEl.className = 'success';
  statusEl.textContent = '✓ Copied to clipboard!';
}

function downloadTranscript() {
  const blob = new Blob([currentTranscript], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transcript.txt';
  a.click();
  URL.revokeObjectURL(url);
  
  const statusEl = document.getElementById('status');
  statusEl.className = 'success';
  statusEl.textContent = '✓ Downloaded!';
}

// This function runs in the context of the YouTube page
function extractTranscript() {
  try {
    const videoId = new URLSearchParams(window.location.search).get('v');
    if (!videoId) {
      return { error: 'Could not find video ID' };
    }

    // Try to get transcript from YouTube's player response
    const ytInitialPlayerResponse = window.ytInitialPlayerResponse;
    
    if (!ytInitialPlayerResponse || !ytInitialPlayerResponse.captions) {
      return { error: 'No captions available for this video' };
    }

    const captionTracks = ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer?.captionTracks;
    
    if (!captionTracks || captionTracks.length === 0) {
      return { error: 'No caption tracks found' };
    }

    // Get the first available caption track (usually auto-generated or English)
    const captionTrack = captionTracks[0];
    const captionUrl = captionTrack.baseUrl;

    // Fetch the transcript XML
    return fetch(captionUrl)
      .then(response => response.text())
      .then(xml => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'text/xml');
        const textElements = xmlDoc.getElementsByTagName('text');
        
        let transcript = [];
        for (let element of textElements) {
          let text = element.textContent;
          // Decode HTML entities
          text = text.replace(/&amp;/g, '&')
                     .replace(/&lt;/g, '<')
                     .replace(/&gt;/g, '>')
                     .replace(/&quot;/g, '"')
                     .replace(/&#39;/g, "'")
                     .replace(/\n/g, ' ');
          transcript.push(text);
        }
        
        // Join and clean up whitespace (similar to your Python code)
        let paragraph = transcript.join(' ');
        paragraph = paragraph.replace(/\s+/g, ' ').trim();
        
        return { text: paragraph };
      })
      .catch(err => {
        return { error: `Failed to fetch captions: ${err.message}` };
      });
  } catch (error) {
    return { error: error.message };
  }
}