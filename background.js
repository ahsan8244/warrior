let events = [];

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
        console.log("The color is green.");
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'moodle.hku.hk'},
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.method === "add") {
        console.log(sender.url);
        if (!itemExists(events, sender.url)) {
            events = [
                ...events,
                {
                    ...request.data,
                    url: sender.url
                }
            ]
        }
    }
    else if (request.method === "get") {
        sendResponse(events);
    }
})

const itemExists = (dataset, url) => {
    let exists = false;
    dataset.forEach((item) => {
        if (item.url === url) {
            exists = true;
        }
    })
    return exists;
}