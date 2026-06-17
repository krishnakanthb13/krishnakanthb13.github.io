// Content script - runs on YouTube pages
console.log('YouTube Transcript Fetcher loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getVideoId') {
    const videoId = new URLSearchParams(window.location.search).get('v');
    sendResponse({ videoId });
  }
  return true;
});