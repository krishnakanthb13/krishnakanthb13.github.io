// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const langSelect = document.getElementById('langSelect');
  const downloadBtn = document.getElementById('downloadBtn');
  const formatSelect = document.getElementById('formatSelect');
  const status = document.getElementById('status');
  const noCaptions = document.getElementById('noCaptions');
  const videoTitle = document.getElementById('videoTitle');

  function setStatus(txt, error = false) {
    status.textContent = txt || '';
    status.style.color = error ? '#f88' : '#9f9';
  }

  // get stored tracks
  chrome.storage.local.get(['yt_caption_tracks', 'yt_video_id', 'yt_video_title'], (res) => {
    const tracks = res.yt_caption_tracks || [];
    const vid = res.yt_video_id || '';
    const title = res.yt_video_title || document.title || vid || 'video';
    videoTitle.textContent = title;

    if (!tracks.length) {
      noCaptions.classList.remove('hidden');
      langSelect.style.display = 'none';
      downloadBtn.disabled = true;
      return;
    }

    noCaptions.classList.add('hidden');
    langSelect.style.display = '';
    downloadBtn.disabled = false;

    // populate languages
    langSelect.innerHTML = '';
    tracks.forEach((t, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${t.name || t.languageCode} (${t.languageCode})`;
      langSelect.appendChild(opt);
    });

    downloadBtn.addEventListener('click', async () => {
      const idx = parseInt(langSelect.value, 10);
      const track = tracks[idx];
      if (!track) return setStatus('No track selected', true);

      setStatus('Fetching captions...');
      try {
        // ensure we request XML format
        const url = appendFmt(track.baseUrl, formatSelect.value);
        // fetch the caption XML
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('fetch failed: ' + resp.status);
        const text = await resp.text();

        if (formatSelect.value === 'vtt') {
          // convert XML -> WebVTT
          const vtt = xmlToVtt(text);
          const filename = sanitizeFileName(title) + `.${track.languageCode || 'sub'}.vtt`;
          chrome.runtime.sendMessage({ action: 'downloadUrl', content: vtt, filename }, (res) => {
            setStatus('Download started');
          });
        } else {
          // convert XML -> srt
          const srt = xmlToSrt(text);
          const filename = sanitizeFileName(title) + `.${track.languageCode || 'sub'}.srt`;
          chrome.runtime.sendMessage({ action: 'downloadUrl', content: srt, filename }, (res) => {
            setStatus('Download started');
          });
        }
      } catch (err) {
        console.error(err);
        setStatus('Failed to fetch captions: ' + err.message, true);
      }
    });
  });

  // helpers
  function appendFmt(baseUrl, format) {
    // many caption baseUrl accept &fmt=srv3 (xml) or &fmt=vtt
    const u = new URL(baseUrl);
    // prefer ttml/xml for parsing. For srt we will convert ourselves.
    if (format === 'vtt') {
      u.searchParams.set('fmt', 'vtt');
    } else {
      // request a transcript XML-like format
      // 'srv3' yields XML with <text start dur> nodes on many servers; 'ttml' also used but srv3 commonly works
      u.searchParams.set('fmt', 'srv3');
    }
    return u.toString();
  }

  function xmlToSrt(xmlText) {
    // Basic XML parsing using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    // Sometimes the response is already plain text or JSON; guard
    const texts = Array.from(doc.getElementsByTagName('text'));
    let srt = '';
    for (let i = 0; i < texts.length; i++) {
      const node = texts[i];
      const start = parseFloat(node.getAttribute('start') || '0');
      const dur = parseFloat(node.getAttribute('dur') || '0');
      const end = start + (isNaN(dur) ? 0 : dur);
      const content = decodeHtml(node.textContent || '');
      srt += `${i + 1}\n${formatTime(start)} --> ${formatTime(end)}\n${content}\n\n`;
    }
    return srt;
  }

  function xmlToVtt(xmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    const texts = Array.from(doc.getElementsByTagName('text'));
    let vtt = 'WEBVTT\n\n';
    for (let i = 0; i < texts.length; i++) {
      const node = texts[i];
      const start = parseFloat(node.getAttribute('start') || '0');
      const dur = parseFloat(node.getAttribute('dur') || '0');
      const end = start + (isNaN(dur) ? 0 : dur);
      const content = decodeHtml(node.textContent || '');
      vtt += `${formatTime(start)} --> ${formatTime(end)}\n${content}\n\n`;
    }
    return vtt;
  }

  function decodeHtml(s) {
    if (!s) return '';
    // YouTube escapes some HTML entities and uses <br/> in text nodes
    return s.replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/<br\s*\/?>/gi, '\n');
  }

  function pad(n, width=2) {
    return n.toString().padStart(width, '0');
  }

  function formatTime(seconds) {
    // seconds is a float, output hh:mm:ss,ms
    const s = Math.floor(seconds % 60);
    const m = Math.floor((seconds / 60) % 60);
    const h = Math.floor(seconds / 3600);
    const ms = Math.floor((seconds - Math.floor(seconds)) * 1000);
    return `${pad(h)}:${pad(m)}:${pad(s)},${ms.toString().padStart(3, '0')}`;
  }

  function sanitizeFileName(name) {
    return name.replace(/[\\\/:*?"<>|]+/g, '').substring(0, 200);
  }
});
