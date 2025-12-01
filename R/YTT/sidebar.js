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

        if (!tab.url || (!tab.url.includes('youtube.com/watch') && !tab.url.includes('youtube.com/shorts') && !tab.url.includes('youtu.be/'))) {
            throw new Error('Please open a YouTube video page or Short');
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
        statusEl.textContent = 'Transcript fetched successfully (' + transcript.text.length + ' characters)';
    } catch (error) {
        statusEl.className = 'error';
        statusEl.textContent = 'Error: ' + error.message;
    } finally {
        fetchBtn.disabled = false;
    }
}

function copyTranscript() {
    navigator.clipboard.writeText(currentTranscript);
    const statusEl = document.getElementById('status');
    statusEl.className = 'success';
    statusEl.textContent = 'Copied to clipboard!';
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
    statusEl.textContent = 'Downloaded!';
}

async function extractTranscript() {
    try {
        let videoId = new URLSearchParams(window.location.search).get('v');

        // Handle youtu.be short links
        if (!videoId && window.location.hostname === 'youtu.be') {
            videoId = window.location.pathname.slice(1);
        }

        // Handle YouTube Shorts
        if (!videoId && window.location.pathname.includes('/shorts/')) {
            const match = window.location.pathname.match(/\/shorts\/([^/?]+)/);
            if (match) {
                videoId = match[1];
            }
        }

        if (!videoId) {
            return { error: 'Could not find video ID in URL' };
        }

        // Use YouTube's timedtext API directly (similar to youtube_transcript_api)
        // First, get the caption track list
        const videoPageUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const videoPageResponse = await fetch(videoPageUrl);
        const videoPageHtml = await videoPageResponse.text();

        // Extract caption tracks from the page
        const captionTracksMatch = videoPageHtml.match(/"captionTracks":(\[.*?\])/);
        if (!captionTracksMatch) {
            return { error: 'No captions available for this video. Make sure captions/subtitles are enabled.' };
        }

        const captionTracks = JSON.parse(captionTracksMatch[1]);
        if (captionTracks.length === 0) {
            return { error: 'No caption tracks found for this video' };
        }

        // Get the first caption track URL
        const captionUrl = captionTracks[0].baseUrl;

        // Fetch the transcript using the timedtext API
        const transcriptResponse = await fetch(captionUrl);
        const transcriptXml = await transcriptResponse.text();

        // Parse the XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(transcriptXml, 'text/xml');
        const textElements = xmlDoc.getElementsByTagName('text');

        if (textElements.length === 0) {
            return { error: 'No transcript text found in captions' };
        }

        // Extract text from all elements
        let transcriptParts = [];
        for (let element of textElements) {
            let text = element.textContent;
            // Decode HTML entities
            text = text.replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/\n/g, ' ');
            transcriptParts.push(text);
        }

        // Join and clean up
        let paragraph = transcriptParts.join(' ');
        paragraph = paragraph.replace(/\s+/g, ' ').trim();

        return { text: paragraph };
    } catch (error) {
        return { error: error.message };
    }
}
