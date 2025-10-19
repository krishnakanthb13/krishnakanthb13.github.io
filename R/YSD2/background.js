// background.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.action === 'downloadUrl') {
    // msg: { url, filename, content (optional) }
    if (msg.content) {
      // download provided content as blob
      const blob = new Blob([msg.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({ url, filename: msg.filename }, () => {
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      });
      sendResponse({ ok: true });
    } else if (msg.url) {
      // direct download from the baseUrl (we append fmt if needed)
      chrome.downloads.download({ url: msg.url, filename: msg.filename }, (id) => {
        sendResponse({ ok: !!id });
      });
    } else {
      sendResponse({ ok: false, error: 'no url or content' });
    }
    // keep the message channel open for async response
    return true;
  }
});
