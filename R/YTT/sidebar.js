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

        // Try to get captions from ytInitialPlayerResponse
        let ytInitialPlayerResponse = window.ytInitialPlayerResponse;

        if (!ytInitialPlayerResponse) {
            const scripts = document.querySelectorAll('script');
            for (let script of scripts) {
                if (script.textContent.includes('ytInitialPlayerResponse')) {
                    // Try multiple regex patterns
                    let match = script.textContent.match(/var ytInitialPlayerResponse\s*=\s*({.+?});/);
                    if (!match) {
                        match = script.textContent.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
                    }
                    if (match) {
                        try {
                            ytInitialPlayerResponse = JSON.parse(match[1]);
                            break;
                        } catch (e) {
                            console.error('Failed to parse ytInitialPlayerResponse:', e);
                        }
                    }
                }
            }
        }

        if (!ytInitialPlayerResponse || !ytInitialPlayerResponse.captions) {
            return { error: 'No captions available for this video. Make sure captions/subtitles are enabled.' };
        }

        const captionTracks = ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer?.captionTracks;

        if (!captionTracks || captionTracks.length === 0) {
            return { error: 'No caption tracks found for this video' };
        }

        // Get the first available caption track (usually auto-generated or first language)
        const captionTrack = captionTracks[0];
        const captionUrl = captionTrack.baseUrl;

        const response = await fetch(captionUrl);
        const captionData = await response.text();

        // Try parsing as XML first
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(captionData, 'text/xml');
        const textElements = xmlDoc.getElementsByTagName('text');

        if (textElements.length > 0) {
            // XML format (traditional captions)
            let transcript = [];
            for (let element of textElements) {
                let text = element.textContent;
                text = text.replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .replace(/\n/g, ' ');
                transcript.push(text);
            }

            let paragraph = transcript.join(' ');
            paragraph = paragraph.replace(/\s+/g, ' ').trim();

            return { text: paragraph };
        }

        // Try parsing as JSON (newer format)
        try {
            const jsonData = JSON.parse(captionData);
            if (jsonData.events) {
                let transcript = [];
                for (let event of jsonData.events) {
                    if (event.segs) {
                        for (let seg of event.segs) {
                            if (seg.utf8) {
                                transcript.push(seg.utf8);
                            }
                        }
                    }
                }

                if (transcript.length > 0) {
                    let paragraph = transcript.join(' ');
                    paragraph = paragraph.replace(/\s+/g, ' ').trim();
                    return { text: paragraph };
                }
            }
        } catch (e) {
            // Not JSON format, continue
        }

        return { error: 'Could not parse caption data. The caption format may not be supported.' };
    } catch (error) {
        return { error: error.message };
    }
}
