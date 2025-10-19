// content_script.js
(function() {
  function safeGetPlayerResponse() {
    try {
      // ytInitialPlayerResponse is injected by YouTube on the page
      if (window.ytInitialPlayerResponse) return window.ytInitialPlayerResponse;
      // Some pages use ytplayer.config -> player_response
      if (window.ytplayer && window.ytplayer.config && window.ytplayer.config.args && window.ytplayer.config.args.player_response) {
        return JSON.parse(window.ytplayer.config.args.player_response);
      }
    } catch (e) {
      console.error('Error reading player response', e);
    }
    return null;
  }

  function extractCaptionTracks(playerResponse) {
    const tracks = [];
    try {
      const captionObj = playerResponse?.captions?.playerCaptionsTracklistRenderer;
      const captionTracks = captionObj?.captionTracks || [];
      for (const t of captionTracks) {
        tracks.push({
          name: t?.name?.simpleText || t?.name || t?.languageCode,
          languageCode: t?.languageCode,
          baseUrl: t?.baseUrl, // direct baseUrl for timedtext
          vssId: t?.vssId || null
        });
      }
    } catch (e) {
      console.error('Error extracting tracks', e);
    }
    return tracks;
  }

  function saveTracks(tracks) {
    chrome.storage.local.set({ yt_caption_tracks: tracks }, () => {
      // also store video id and title
      const vid = getVideoIdFromUrl();
      const title = document.title || '';
      chrome.storage.local.set({ yt_video_id: vid, yt_video_title: title });
    });
  }

  function getVideoIdFromUrl() {
    const u = new URL(location.href);
    return u.searchParams.get('v') || null;
  }

  // initial attempt
  const pr = safeGetPlayerResponse();
  if (pr) {
    const tracks = extractCaptionTracks(pr);
    saveTracks(tracks);
  }

  // also watch for dynamic navigation on YouTube single-page app:
  let lastUrl = location.href;
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(() => {
        const pr2 = safeGetPlayerResponse();
        const tracks2 = pr2 ? extractCaptionTracks(pr2) : [];
        saveTracks(tracks2);
      }, 1000);
    }
  });
  observer.observe(document, { subtree: true, childList: true });
})();
