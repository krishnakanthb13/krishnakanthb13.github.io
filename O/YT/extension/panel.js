/* panel.js — drives the Transcript Studio side panel. */
'use strict';

const SUPPORT_URL = 'https://krishnakanthb13.github.io/S/';
const C = window.CaptionsCore;

// ---- element refs ----------------------------------------------------------
const $ = (id) => document.getElementById(id);
const el = {
  langSelect: $('langSelect'), translateSelect: $('translateSelect'),
  fetchBtn: $('fetchBtn'), fetchLabel: $('fetchLabel'),
  videoMeta: $('videoMeta'),
  toolbar: $('toolbar'), exportBar: $('exportBar'), foot: $('foot'),
  searchInput: $('searchInput'), searchCount: $('searchCount'),
  tgTimestamps: $('tgTimestamps'), tgFollow: $('tgFollow'),
  tgSmaller: $('tgSmaller'), tgBigger: $('tgBigger'),
  formatSelect: $('formatSelect'), copyBtn: $('copyBtn'), downloadBtn: $('downloadBtn'),
  scroll: $('scroll'), state: $('state'), stats: $('stats'),
  themeBtn: $('themeBtn'), supportBtn: $('supportBtn'), footSupport: $('footSupport'),
  toast: $('toast')
};

// ---- state -----------------------------------------------------------------
let tracks = [];
let segments = [];
let cueEls = [];
let meta = {};
let followTimer = null;
let activeCue = -1;

const settings = {
  theme: 'system',       // system | light | dark
  timestamps: true,
  follow: false,
  fontSize: 14,
  format: 'txt'
};

// ===========================================================================
// Settings & theme
// ===========================================================================
function loadSettings() {
  return new Promise((res) => {
    chrome.storage.sync.get('tsSettings', (data) => {
      Object.assign(settings, data.tsSettings || {});
      res();
    });
  });
}
function saveSettings() {
  chrome.storage.sync.set({ tsSettings: settings });
}

function applyTheme() {
  const root = document.documentElement;
  const dark = settings.theme === 'dark' ||
    (settings.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  root.setAttribute('data-theme', dark ? 'dark' : 'light');
  el.themeBtn.textContent = { system: '🌗', light: '☀️', dark: '🌙' }[settings.theme];
  el.themeBtn.title = `Theme: ${settings.theme} (click to change)`;
}
function applyFontSize() {
  document.documentElement.style.setProperty('--cue-size', settings.fontSize + 'px');
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (settings.theme === 'system') applyTheme();
});

// ===========================================================================
// Tab plumbing — everything that touches the page runs in the tab (MAIN world,
// youtube.com origin) so caption fetches are same-origin and reliable.
// ===========================================================================
async function activeYouTubeTab() {
  let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab) [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url) return null;
  return /(^https:\/\/(www\.|m\.)?youtube\.com\/)|(^https:\/\/youtu\.be\/)/.test(tab.url) ? tab : null;
}

async function runInTab(func, args = []) {
  const tab = await activeYouTubeTab();
  if (!tab) throw new Error('NOT_YOUTUBE');
  const [res] = await chrome.scripting.executeScript({
    target: { tabId: tab.id }, world: 'MAIN', func, args
  });
  if (chrome.runtime.lastError) throw new Error(chrome.runtime.lastError.message);
  return res?.result;
}

// ---- injected page functions (must be self-contained) ----------------------

function pageReadCaptions() {
  const videoId = (() => {
    const u = new URL(location.href);
    return u.searchParams.get('v') || (location.pathname.match(/\/shorts\/([^/?]+)/) || [])[1] || null;
  })();
  if (!videoId) return { error: 'NO_VIDEO' };

  function extractBalancedJson(src, marker) {
    const i = src.indexOf(marker);
    if (i === -1) return null;
    let depth = 0, start = -1;
    for (let j = i + marker.length; j < src.length; j++) {
      const ch = src[j];
      if (ch === '{') { if (depth === 0) start = j; depth++; }
      else if (ch === '}') { depth--; if (depth === 0) { try { return JSON.parse(src.slice(start, j + 1)); } catch (e) { return null; } } }
    }
    return null;
  }

  async function getPlayerResponse() {
    const pr = window.ytInitialPlayerResponse;
    if (pr?.videoDetails?.videoId === videoId && pr.captions) return pr;
    const html = await (await fetch(`https://www.youtube.com/watch?v=${videoId}`, { credentials: 'include' })).text();
    return extractBalancedJson(html, 'ytInitialPlayerResponse = ') ||
           extractBalancedJson(html, 'ytInitialPlayerResponse":') || pr || null;
  }

  return getPlayerResponse().then((pr) => {
    const r = pr?.captions?.playerCaptionsTracklistRenderer;
    const ct = r?.captionTracks || [];
    if (!ct.length) return { error: 'NO_CAPTIONS' };
    const tracks = ct.map((t) => ({
      name: (t.name?.simpleText || t.name?.runs?.[0]?.text || t.languageCode || 'Unknown'),
      lang: t.languageCode || '',
      baseUrl: t.baseUrl,
      kind: t.kind || '',
      translatable: !!t.isTranslatable
    }));
    const translationLanguages = (r.translationLanguages || []).map((l) => ({
      code: l.languageCode,
      name: l.languageName?.simpleText || l.languageName?.runs?.[0]?.text || l.languageCode
    }));
    return {
      videoId,
      title: pr?.videoDetails?.title || document.title.replace(/ - YouTube$/, ''),
      author: pr?.videoDetails?.author || '',
      url: `https://www.youtube.com/watch?v=${videoId}`,
      tracks, translationLanguages
    };
  }).catch((e) => ({ error: 'READ_FAIL', detail: String(e && e.message || e) }));
}

// Runs in the YouTube tab (MAIN world). Since ~June 2025 the caption baseUrl in
// the WEB player response carries &exp=xpe and requires a runtime PoToken — a
// direct timedtext fetch returns an empty body. The fix: ask YouTube's InnerTube
// `player` endpoint for the video using a NON-web client (ANDROID/IOS), whose
// caption URLs are not PoToken-gated, then fetch json3 from that URL.
function pageFetchTranscript(opts) {
  const videoId = (() => {
    const u = new URL(location.href);
    return u.searchParams.get('v') || (location.pathname.match(/\/shorts\/([^/?]+)/) || [])[1] || null;
  })();

  function innertubeKey() {
    try { if (window.ytcfg?.get) return window.ytcfg.get('INNERTUBE_API_KEY'); } catch (e) {}
    try { if (window.ytcfg?.data_?.INNERTUBE_API_KEY) return window.ytcfg.data_.INNERTUBE_API_KEY; } catch (e) {}
    const m = document.documentElement.innerHTML.match(/"INNERTUBE_API_KEY":"([^"]+)"/);
    return m ? m[1] : 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8'; // long-standing public web key
  }

  async function fetchTimed(baseUrl) {
    // Force json3: drop any existing &fmt= then add our own (a duplicate fmt
    // would let YouTube keep the original and hand back XML).
    let url = baseUrl.replace(/([?&])fmt=[^&]*&?/g, '$1').replace(/[?&]$/, '').replace(/\?&/, '?');
    url += (url.includes('?') ? '&' : '?') + 'fmt=json3';
    if (opts.tlang) url += '&tlang=' + encodeURIComponent(opts.tlang);
    const r = await fetch(url, { credentials: 'omit' });
    if (!r.ok) return { err: 'HTTP ' + r.status };
    const text = await r.text();
    if (!text || !text.trim()) return { err: 'empty' };
    // Be tolerant: some clients ignore fmt and return XML anyway. Detect, don't assume.
    return { text, kind: text.trim()[0] === '{' ? 'json3' : 'xml' };
  }

  async function playerCaptionUrl(clientName, clientVersion, extra) {
    const body = {
      context: { client: Object.assign({ clientName, clientVersion, hl: 'en' }, extra || {}) },
      videoId
    };
    const r = await fetch('https://www.youtube.com/youtubei/v1/player?key=' + innertubeKey() + '&prettyPrint=false', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body), credentials: 'omit'
    });
    if (!r.ok) throw new Error('player HTTP ' + r.status);
    const pr = await r.json();
    const ct = pr?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
    if (!ct.length) throw new Error('no tracks');
    const asr = !!opts.asr;
    return (ct.find((t) => t.languageCode === opts.lang && (t.kind === 'asr') === asr)
         || ct.find((t) => t.languageCode === opts.lang)
         || ct[0]).baseUrl;
  }

  return (async () => {
    const errs = [];
    const clients = [
      ['ANDROID', '20.10.38', { androidSdkVersion: 30 }],
      ['IOS', '20.10.4', {}],
      ['MWEB', '2.20250312.04.00', {}],
      ['WEB', '2.20250312.04.00', {}]
    ];
    for (const [name, ver, extra] of clients) {
      try {
        const url = await playerCaptionUrl(name, ver, extra);
        const got = await fetchTimed(url);
        if (got.text) return { kind: got.kind, text: got.text, via: name };
        errs.push(`${name}: ${got.err}`);
      } catch (e) { errs.push(`${name}: ${e.message || e}`); }
    }
    // Last resort: the original WEB baseUrl (works only if it lacks exp=xpe).
    if (opts.baseUrl) {
      try {
        const got = await fetchTimed(opts.baseUrl);
        if (got.text) return { kind: got.kind, text: got.text, via: 'web-direct' };
        errs.push('web-direct: ' + got.err);
      } catch (e) { errs.push('web-direct: ' + (e.message || e)); }
    }
    return { error: 'FETCH_FAIL', detail: errs.join(' | ') };
  })();
}

function pageSeek(t) {
  const v = document.querySelector('video');
  if (v) { v.currentTime = t; const p = v.play(); if (p && p.catch) p.catch(() => {}); }
}
function pageVideoTime() {
  const v = document.querySelector('video');
  return v ? v.currentTime : null;
}

// ===========================================================================
// Load caption track list for the current video
// ===========================================================================
async function refreshTracks() {
  resetTranscript();
  setState('loading', 'Reading video…', '');
  el.fetchBtn.disabled = true;
  el.langSelect.innerHTML = '<option>Loading…</option>';
  try {
    const data = await runInTab(pageReadCaptions);
    if (!data || data.error) return handleNoTracks(data?.error);
    tracks = data.tracks;
    meta = { videoId: data.videoId, title: data.title, author: data.author, url: data.url };

    el.langSelect.innerHTML = tracks.map((t, i) =>
      `<option value="${i}">${escapeHtml(t.name)}${t.kind === 'asr' ? ' (auto)' : ''}</option>`
    ).join('');

    el.translateSelect.innerHTML =
      '<option value="">Off — original language</option>' +
      (data.translationLanguages || []).map((l) =>
        `<option value="${escapeHtml(l.code)}">${escapeHtml(l.name)}</option>`
      ).join('');
    el.translateSelect.disabled = !(data.translationLanguages || []).length;

    el.videoMeta.innerHTML = `<b>${escapeHtml(meta.title)}</b>${meta.author ? ' · ' + escapeHtml(meta.author) : ''}`;
    el.videoMeta.classList.add('show');

    el.fetchBtn.disabled = false;
    setState('ready', `${tracks.length} caption track${tracks.length > 1 ? 's' : ''} found`,
      'Choose a language and hit <b>Get transcript</b>.', '✅');
  } catch (e) {
    if (e.message === 'NOT_YOUTUBE') return handleNoTracks('NOT_YOUTUBE');
    handleNoTracks('READ_FAIL', e.message);
  }
}

function handleNoTracks(code, detail) {
  el.fetchBtn.disabled = true;
  el.langSelect.innerHTML = '<option>—</option>';
  el.videoMeta.classList.remove('show');
  const map = {
    NOT_YOUTUBE: ['🎬', 'Open a YouTube video', 'Switch to a YouTube tab — a video, Short, or youtu.be link — then reopen this panel.'],
    NO_VIDEO: ['🔗', 'No video detected', 'Open a specific video or Short (the URL should contain a video id).'],
    NO_CAPTIONS: ['🚫', 'No captions on this video', 'This video has no subtitles or transcript available to fetch.'],
  };
  const [icon, title, msg] = map[code] || ['⚠️', 'Could not read this video',
    (detail ? escapeHtml(detail) + '. ' : '') + 'Try reloading the YouTube tab, then reopen the panel.'];
  setState(code === 'NO_CAPTIONS' ? 'error' : 'empty', title, msg, icon);
}

// ===========================================================================
// Fetch & render the transcript
// ===========================================================================
async function getTranscript() {
  const track = tracks[+el.langSelect.value];
  if (!track) return;
  const tlang = el.translateSelect.value;

  el.fetchBtn.disabled = true;
  el.fetchLabel.textContent = 'Fetching…';
  setState('loading', 'Fetching transcript…', '');

  try {
    const res = await runInTab(pageFetchTranscript, [{
      lang: track.lang, asr: track.kind === 'asr', tlang, baseUrl: track.baseUrl
    }]);
    if (!res || res.error) throw new Error(res?.detail || 'Empty response from YouTube');

    segments = res.kind === 'json3'
      ? C.parseJson3(res.text)
      : C.parseXml(res.text, DOMParser);

    if (!segments.length) throw new Error('Caption track returned no text');
    renderTranscript();
    toast(`Loaded ${segments.length} lines${res.via ? ' · ' + res.via : ''}`);
  } catch (e) {
    segments = [];
    showWorkspace(false);
    setState('error', 'Could not fetch transcript',
      escapeHtml(e.message) + '. Try reloading the YouTube tab, then retry.', '⚠️');
  } finally {
    el.fetchBtn.disabled = false;
    el.fetchLabel.textContent = 'Get transcript';
  }
}

function renderTranscript() {
  el.state.style.display = 'none';
  el.scroll.innerHTML = '';
  cueEls = segments.map((s, i) => {
    const cue = document.createElement('div');
    cue.className = 'cue' + (settings.timestamps ? '' : ' no-ts');
    cue.dataset.index = i;
    cue.innerHTML = `<span class="ts">${C.clock(s.start)}</span><span class="tx"></span>`;
    cue.querySelector('.tx').textContent = s.text;
    cue.addEventListener('click', () => seekTo(s.start));
    el.scroll.appendChild(cue);
    return cue;
  });
  showWorkspace(true);
  renderStats();
  applySearch();
}

function renderStats() {
  const s = C.stats(segments);
  el.stats.innerHTML = [
    `<span><b>${s.words.toLocaleString()}</b> words</span>`,
    `<span><b>${s.lines}</b> lines</span>`,
    `<span><b>${C.clock(s.duration)}</b> long</span>`,
    `<span>~<b>${s.readingMinutes}</b> min read</span>`
  ].join('');
}

function showWorkspace(on) {
  el.toolbar.classList.toggle('show', on);
  el.exportBar.classList.toggle('show', on);
  el.foot.classList.toggle('show', on);
}

// ===========================================================================
// Search
// ===========================================================================
function applySearch() {
  const q = el.searchInput.value.trim();
  if (!q) {
    cueEls.forEach((c, i) => {
      c.classList.remove('dim');
      c.querySelector('.tx').textContent = segments[i].text;
    });
    el.searchCount.textContent = '';
    return;
  }
  const hits = C.search(segments, q);
  const hitSet = new Set(hits);
  const rx = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  cueEls.forEach((c, i) => {
    const tx = c.querySelector('.tx');
    if (hitSet.has(i)) {
      c.classList.remove('dim');
      tx.innerHTML = escapeHtml(segments[i].text).replace(rx, '<mark>$1</mark>');
    } else {
      c.classList.add('dim');
      tx.textContent = segments[i].text;
    }
  });
  el.searchCount.textContent = `${hits.length} hit${hits.length === 1 ? '' : 's'}`;
  if (hits.length) cueEls[hits[0]].scrollIntoView({ block: 'center', behavior: 'smooth' });
}

// ===========================================================================
// Follow-along + seek
// ===========================================================================
async function seekTo(t) {
  try { await runInTab(pageSeek, [t]); } catch (_) { toast('Open the video tab to seek'); }
}

function setFollow(on) {
  settings.follow = on;
  el.tgFollow.classList.toggle('on', on);
  saveSettings();
  if (followTimer) { clearInterval(followTimer); followTimer = null; }
  if (on) followTimer = setInterval(syncActiveCue, 700);
  else if (activeCue >= 0) { cueEls[activeCue]?.classList.remove('active'); activeCue = -1; }
}

async function syncActiveCue() {
  if (!segments.length) return;
  let t;
  try { t = await runInTab(pageVideoTime); } catch (_) { return; }
  if (t == null) return;
  let idx = -1;
  for (let i = 0; i < segments.length; i++) {
    if (segments[i].start <= t) idx = i; else break;
  }
  if (idx === activeCue) return;
  if (activeCue >= 0) cueEls[activeCue]?.classList.remove('active');
  activeCue = idx;
  if (idx >= 0) {
    cueEls[idx].classList.add('active');
    cueEls[idx].scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}

// ===========================================================================
// Export
// ===========================================================================
function buildExport(kind) {
  return C.format(kind, segments, meta);
}
function exportFilename(kind) {
  const ext = (C.FORMATS[kind] || C.FORMATS.txt).ext;
  return `${C.sanitizeFilename(meta.title || meta.videoId || 'transcript')}.${ext}`;
}

async function copyTranscript() {
  if (!segments.length) return;
  try {
    await navigator.clipboard.writeText(buildExport(el.formatSelect.value));
    toast('Copied to clipboard');
  } catch (_) { toast('Copy failed'); }
}

function downloadTranscript() {
  if (!segments.length) return;
  const kind = el.formatSelect.value;
  const fmt = C.FORMATS[kind] || C.FORMATS.txt;
  // The panel is a full document, so Blob + object URL are available here
  // (unlike an MV3 service worker). chrome.downloads keeps it out of the page.
  const blob = new Blob([buildExport(kind)], { type: fmt.mime + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({ url, filename: exportFilename(kind), saveAs: false }, () => {
    const failed = !!chrome.runtime.lastError;
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    toast(failed ? 'Download failed' : 'Saved to downloads');
  });
}

// ===========================================================================
// Misc UI helpers
// ===========================================================================
function setState(kind, title, msg, icon) {
  el.scroll.querySelectorAll('.cue').forEach((c) => c.remove());
  el.state.style.display = '';
  el.state.className = 'state' + (kind === 'error' ? ' error' : '');
  el.state.innerHTML = kind === 'loading'
    ? `<div class="spinner"></div><h2>${title}</h2>`
    : `<div class="big">${icon || 'ℹ️'}</div><h2>${title}</h2><p>${msg}</p>`;
}

function resetTranscript() {
  segments = []; cueEls = []; activeCue = -1;
  el.scroll.querySelectorAll('.cue').forEach((c) => c.remove());
  el.searchInput.value = ''; el.searchCount.textContent = '';
  showWorkspace(false);
  if (followTimer) { clearInterval(followTimer); followTimer = null; }
}

let toastTimer = null;
function toast(msg) {
  el.toast.textContent = msg;
  el.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove('show'), 1800);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ===========================================================================
// Wiring
// ===========================================================================
function populateFormats() {
  el.formatSelect.innerHTML = Object.entries(C.FORMATS)
    .map(([k, f]) => `<option value="${k}">${f.label}</option>`).join('');
  el.formatSelect.value = settings.format;
}

function wireEvents() {
  el.fetchBtn.addEventListener('click', getTranscript);

  el.themeBtn.addEventListener('click', () => {
    settings.theme = { system: 'light', light: 'dark', dark: 'system' }[settings.theme];
    applyTheme(); saveSettings();
  });

  const openSupport = () => chrome.tabs.create({ url: SUPPORT_URL });
  el.supportBtn.addEventListener('click', openSupport);
  el.footSupport.addEventListener('click', (e) => { e.preventDefault(); openSupport(); });

  el.tgTimestamps.addEventListener('click', () => {
    settings.timestamps = !settings.timestamps;
    el.tgTimestamps.classList.toggle('on', settings.timestamps);
    cueEls.forEach((c) => c.classList.toggle('no-ts', !settings.timestamps));
    saveSettings();
  });
  el.tgFollow.addEventListener('click', () => setFollow(!settings.follow));

  const setFont = (delta) => {
    settings.fontSize = Math.max(12, Math.min(22, settings.fontSize + delta));
    applyFontSize(); saveSettings();
  };
  el.tgSmaller.addEventListener('click', () => setFont(-1));
  el.tgBigger.addEventListener('click', () => setFont(1));

  let searchDebounce = null;
  el.searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(applySearch, 140);
  });

  el.formatSelect.addEventListener('change', () => { settings.format = el.formatSelect.value; saveSettings(); });
  el.copyBtn.addEventListener('click', copyTranscript);
  el.downloadBtn.addEventListener('click', downloadTranscript);

  // Auto-refresh the track list when the user navigates to another video.
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === 'yt-navigated') refreshTracks();
  });

  // Keyboard: Ctrl/Cmd+F focuses search, Esc clears it.
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); el.searchInput.focus(); }
    if (e.key === 'Escape' && document.activeElement === el.searchInput) {
      el.searchInput.value = ''; applySearch(); el.searchInput.blur();
    }
  });
}

// ===========================================================================
// Boot
// ===========================================================================
(async function init() {
  await loadSettings();
  applyTheme();
  applyFontSize();
  populateFormats();
  el.footSupport.href = SUPPORT_URL;
  el.tgTimestamps.classList.toggle('on', settings.timestamps);
  el.tgFollow.classList.toggle('on', settings.follow);
  wireEvents();
  refreshTracks();
})();
