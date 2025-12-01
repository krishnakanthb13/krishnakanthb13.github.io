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

        const result = results[0].result;

        if (result.error) {
            throw new Error(result.error);
        }

        currentTranscript = result.text;
        transcriptEl.textContent = currentTranscript;
        transcriptEl.classList.remove('hidden');
        actionsEl.classList.remove('hidden');

        statusEl.className = 'success';
        statusEl.textContent = 'Transcript fetched successfully (' + result.text.length + ' characters)';
    } catch (error) {
        statusEl.className = 'error';
        statusEl.textContent = 'Error: ' + error.message;
        console.error('Transcript fetch error:', error);
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
    // Helper function to decode HTML entities
    function decodeHtml(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

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

        console.log('Fetching transcript for video:', videoId);

        // 1. Try to find captionTracks in the current page global variable
        let captionTracks = null;

        try {
            if (window.ytInitialPlayerResponse &&
                window.ytInitialPlayerResponse.captions &&
                window.ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer &&
                window.ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer.captionTracks) {
                captionTracks = window.ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer.captionTracks;
                console.log('Found captionTracks in window.ytInitialPlayerResponse');
            }
        } catch (e) {
            console.log('Error checking window.ytInitialPlayerResponse:', e);
        }

        // 2. If not found, try to fetch the video page and extract it (Python library approach)
        if (!captionTracks) {
            console.log('Fetching video page to find captions...');
            const videoPageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
            const videoPageHtml = await videoPageResponse.text();

            const match = videoPageHtml.match(/"captionTracks":(\[.*?\])/);
            if (match) {
                captionTracks = JSON.parse(match[1]);
                console.log('Found captionTracks in video page HTML');
            }
        }

        if (!captionTracks || captionTracks.length === 0) {
            return { error: 'No captions available for this video. Make sure captions are enabled.' };
        }

        // Get the first caption track
        const track = captionTracks[0];
        const baseUrl = track.baseUrl;
        console.log('Caption URL:', baseUrl);

        let errors = [];

        // 3. Try fetching as XML (fmt=3) - This matches Python library behavior
        try {
            const xmlUrl = baseUrl + '&fmt=3';
            console.log('Fetching XML:', xmlUrl);
            const response = await fetch(xmlUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const text = await response.text();

            if (text.includes('<transcript>')) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(text, 'text/xml');
                const textElements = xmlDoc.getElementsByTagName('text');

                if (textElements.length > 0) {
                    let transcript = [];
                    for (let element of textElements) {
                        transcript.push(decodeHtml(element.textContent));
                    }
                    return { text: transcript.join(' ').replace(/\s+/g, ' ').trim() };
                } else {
                    errors.push('XML parsed but no text elements found');
                }
            } else {
                errors.push('XML response did not contain <transcript>');
            }
        } catch (e) {
            console.log('XML fetch/parse failed:', e);
            errors.push(`XML error: ${e.message}`);
        }

        // 4. Fallback: Try fetching as JSON3 (fmt=json3)
        try {
            const jsonUrl = baseUrl + '&fmt=json3';
            console.log('Fetching JSON3:', jsonUrl);
            const response = await fetch(jsonUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const jsonData = await response.json();

            if (jsonData.events) {
                let transcript = [];
                for (let event of jsonData.events) {
                    if (event.segs) {
                        for (let seg of event.segs) {
                            if (seg.utf8 && seg.utf8 !== '\n') {
                                transcript.push(seg.utf8);
                            }
                        }
                    }
                }
                if (transcript.length > 0) {
                    return { text: transcript.join('').replace(/\s+/g, ' ').trim() };
                } else {
                    errors.push('JSON3 parsed but no events/segs found');
                }
            } else {
                errors.push('JSON3 response missing events');
            }
        } catch (e) {
            console.log('JSON3 fetch/parse failed:', e);
            errors.push(`JSON3 error: ${e.message}`);
        }

        return { error: `Could not extract text. Errors: ${errors.join('; ')}` };

    } catch (error) {
        console.error('Extract transcript error:', error);
        return { error: error.message };
    }
}
