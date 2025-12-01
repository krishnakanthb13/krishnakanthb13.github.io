// Content script - runs on YouTube pages
// This can be used for additional functionality if needed

console.log('YouTube Transcript Fetcher loaded');

// Listen for messages from popup if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getVideoId') {
    const videoId = new URLSearchParams(window.location.search).get('v');
    sendResponse({ videoId });
  }
  return true;
});