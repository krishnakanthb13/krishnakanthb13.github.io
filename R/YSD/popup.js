// ===== popup.js =====
let currentVideoId = null;
let subtitles = [];
let selectedLanguage = null;
let selectedFormat = 'srt';
let options = {
  scroll: false,
  translate: false,
  display: false,
  time: true,
  shorten: false,
  extend: false,
  light: false
};

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url.includes('youtube.com/watch')) {
    showError('Please open a YouTube video page');
    return;
  }
  
  currentVideoId = extractVideoId(tab.url);
  
  if (!currentVideoId) {
    showError('Could not detect video ID');
    return;
  }
  
  await loadSubtitles();
}

function extractVideoId(url) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

async function loadSubtitles() {
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${currentVideoId}`);
    const html = await response.text();
    
    const captionRegex = /"captionTracks":(\[.*?\])/;
    const match = html.match(captionRegex);
    
    if (!match) {
      showError('No subtitles found for this video');
      return;
    }
    
    subtitles = JSON.parse(match[1]);
    renderUI();
  } catch (error) {
    showError('Failed to load subtitles');
  }
}

function renderUI() {
  const content = document.getElementById('content');
  
  content.innerHTML = `
    <div class="language-selector">
      <div class="language-tabs">
        <button class="tab active" data-tab="original">Original</button>
        <button class="tab" data-tab="translated">Translate</button>
      </div>
      <select id="languageSelect">
        ${subtitles.map(sub => `
          <option value="${sub.baseUrl}">${sub.name.simpleText}${sub.kind === 'asr' ? ' (auto)' : ''}</option>
        `).join('')}
      </select>
    </div>
    
    <div class="toolbar">
      <button class="tool-btn" data-tool="scroll">
        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
        <span>Scroll</span>
      </button>
      <button class="tool-btn" data-tool="translate">
        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
        <span>Translate</span>
      </button>
      <button class="tool-btn" data-tool="display">
        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
        <span>Display</span>
      </button>
      <button class="tool-btn active" data-tool="time">
        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
        <span>Time</span>
      </button>
      <button class="tool-btn" data-tool="shorten">
        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h12v2H6v-2zm0-4h12v2H6v-2zm0-4h12v2H6v-2zm0-6v2h12V5H6z"/></svg>
        <span>Shorten</span>
      </button>
      <button class="tool-btn" data-tool="extend">
        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        <span>Extend</span>
      </button>
      <button class="tool-btn" data-tool="light">
        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/></svg>
        <span>Light</span>
      </button>
    </div>
    
    <div class="format-section">
      <div class="format-option">
        <button class="format-btn active" data-format="srt">SRT</button>
        <div class="format-label">Format</div>
      </div>
      <div class="format-option">
        <button class="format-btn" data-format="download">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
        </button>
        <div class="format-label">Download</div>
      </div>
      <div class="format-option">
        <button class="format-btn" data-format="copy">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
        </button>
        <div class="format-label">Copy</div>
      </div>
    </div>
    
    <div class="subtitle-preview" id="subtitlePreview">
      <div class="subtitle-line">
        <div class="timestamp">0:00</div>
        <div class="text">Click download to get subtitles...</div>
      </div>
    </div>
    
    <div class="footer">
      <button class="download-btn" id="downloadBtn">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
        <span>Download Limit: 18</span>
      </button>
      <div class="download-limit">Daily download limit remaining</div>
    </div>
  `;
  
  // Add event listeners
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tool = btn.dataset.tool;
      options[tool] = !options[tool];
      btn.classList.toggle('active');
    });
  });
  
  document.querySelectorAll('.format-btn[data-format="srt"]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  document.getElementById('downloadBtn').addEventListener('click', downloadSubtitles);
  document.getElementById('languageSelect').addEventListener('change', previewSubtitles);
  
  previewSubtitles();
}

async function previewSubtitles() {
  const select = document.getElementById('languageSelect');
  const url = select.value;
  
  try {
    const response = await fetch(url);
    const xml = await response.text();
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const texts = xmlDoc.getElementsByTagName('text');
    
    const preview = document.getElementById('subtitlePreview');
    preview.innerHTML = '';
    
    for (let i = 0; i < Math.min(texts.length, 10); i++) {
      const start = parseFloat(texts[i].getAttribute('start'));
      const text = texts[i].textContent
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      
      const line = document.createElement('div');
      line.className = 'subtitle-line';
      line.innerHTML = `
        <div class="timestamp">${formatTime(start)}</div>
        <div class="text">${text}</div>
      `;
      preview.appendChild(line);
    }
  } catch (error) {
    console.error('Preview error:', error);
  }
}

async function downloadSubtitles() {
  const select = document.getElementById('languageSelect');
  const url = select.value;
  
  try {
    const response = await fetch(url);
    const xml = await response.text();
    
    const content = convertToSRT(xml);
    const blob = new Blob([content], { type: 'text/plain' });
    const downloadUrl = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${currentVideoId}.srt`;
    a.click();
    
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    showError('Download failed');
  }
}

function convertToSRT(xml) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'text/xml');
  const texts = xmlDoc.getElementsByTagName('text');
  
  let srt = '';
  for (let i = 0; i < texts.length; i++) {
    const start = parseFloat(texts[i].getAttribute('start'));
    const dur = parseFloat(texts[i].getAttribute('dur') || '2');
    const text = texts[i].textContent
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    
    if (!options.time) {
      srt += `${text}\n\n`;
    } else {
      srt += `${i + 1}\n`;
      srt += `${formatSRTTime(start)} --> ${formatSRTTime(start + dur)}\n`;
      srt += `${text}\n\n`;
    }
  }
  
  return srt;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function formatSRTTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

function showError(message) {
  document.getElementById('content').innerHTML = `
    <div class="error">${message}</div>
  `;
}

init();