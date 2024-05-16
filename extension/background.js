chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  let message = { text: "start_server" };
  let hostName = "com.your_company.your_application";

  chrome.runtime.sendNativeMessage(hostName, message, function(response) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    } else {
      console.log("Received response:", response);
    }
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "fetchData") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currentTab = tabs[0];
            if (currentTab) {
                // 发送响应回内容脚本
                sendResponse({data: {url: currentTab.url, tabId: currentTab.id}});
            }
        });
        return true;  // 异步响应
    }
});

