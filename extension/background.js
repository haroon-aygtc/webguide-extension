chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'toggleAssistant' });
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Multi-Modal Navigation Assistant installed');
});
