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

        // Step 1: Get the caption URL from the page
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: extractCaptionUrl
        });

        const result = results[0].result;

        if (result.error) {
            throw new Error(result.error);
        }

        const baseUrl = result.baseUrl;
        console.log('Got caption URL:', baseUrl);

        // Step 2: Fetch the transcript from the extension side (bypassing page CSP)
        let transcriptText = null;
        let errors = [];

        // Try XML (fmt=3)
        try {
            const xmlUrl = baseUrl + '&fmt=3';
            console.log('Fetching XML from sidebar:', xmlUrl);
            const response = await fetch(xmlUrl);
            const text = await response.text();

            if (text.includes('<transcript>')) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(text, 'text/xml');
                const textElements = xmlDoc.getElementsByTagName('text');

                if (textElements.length > 0) {
                    let parts = [];
                    for (let element of textElements) {
                        parts.push(decodeHtml(element.textContent));
                    }
                    transcriptText = parts.join(' ').replace(/\s+/g, ' ').trim();
                }
            } else {
                errors.push('XML response invalid');
            }
        } catch (e) {
            errors.push('XML fetch failed: ' + e.message);
        }

        // Fallback to JSON3 if XML failed
        if (!transcriptText) {
            try {
                const jsonUrl = baseUrl + '&fmt=json3';
                console.log('Fetching JSON3 from sidebar:', jsonUrl);
                const response = await fetch(jsonUrl);
                const jsonData = await response.json();

                if (jsonData.events) {
                    let parts = [];
                    for (let event of jsonData.events) {
                        if (event.segs) {
                            for (let seg of event.segs) {
                                if (seg.utf8 && seg.utf8 !== '\n') {
                                    parts.push(seg.utf8);
                                }
                            }
                        }
                    }
                    if (parts.length > 0) {
                        transcriptText = parts.join('').replace(/\s+/g, ' ').trim();
                    }
                }
            } catch (e) {
                errors.push('JSON3 fetch failed: ' + e.message);
            }
        }

        if (!transcriptText) {
            throw new Error(`Could not fetch transcript. Details: ${errors.join(', ')}`);
        }

        currentTranscript = transcriptText;
        transcriptEl.textContent = currentTranscript;
        transcriptEl.classList.remove('hidden');
        actionsEl.classList.remove('hidden');

        statusEl.className = 'success';
        statusEl.textContent = 'Transcript fetched successfully (' + transcriptText.length + ' characters)';

    } catch (error) {
        statusEl.className = 'error';
        statusEl.textContent = 'Error: ' + error.message;
        console.error('Transcript fetch error:', error);
    } finally {
        fetchBtn.disabled = false;
    }
}

function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
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

// This function runs inside the tab
async function extractCaptionUrl() {
    try {
        let videoId = new URLSearchParams(window.location.search).get('v');

        if (!videoId && window.location.hostname === 'youtu.be') {
            videoId = window.location.pathname.slice(1);
        }

        if (!videoId && window.location.pathname.includes('/shorts/')) {
            const match = window.location.pathname.match(/\/shorts\/([^/?]+)/);
            if (match) {
                videoId = match[1];
            }
        }

        if (!videoId) {
            return { error: 'Could not find video ID' };
        }

        // 1. Try Global Variable
        let captionTracks = null;
        try {
            if (window.ytInitialPlayerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks) {
                captionTracks = window.ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer.captionTracks;
            }
        } catch (e) { }

        // 2. Try Fetching Page (if global var missing)
        if (!captionTracks) {
            const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
            const pageHtml = await pageRes.text();
            const match = pageHtml.match(/"captionTracks":(\[.*?\])/);
            if (match) {
                captionTracks = JSON.parse(match[1]);
            }
        }

        if (!captionTracks || captionTracks.length === 0) {
            return { error: 'No captions found' };
        }

        return { baseUrl: captionTracks[0].baseUrl };

    } catch (e) {
        return { error: e.message };
    }
}
