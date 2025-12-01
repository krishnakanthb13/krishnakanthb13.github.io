// Background script to handle sidebar opening
chrome.action.onClicked.addListener((tab) => {
    // Open the side panel when extension icon is clicked
    chrome.sidePanel.open({ windowId: tab.windowId });
});
