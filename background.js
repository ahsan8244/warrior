chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
        console.log("The color is green.");
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
                schemes: ['http', 'https']
            }
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.method === "add") {
        let due =  JSON.parse(localStorage.getItem("due")) || [];
        if (!itemExists(due, sender.url)) {
            due = [
                ...due,
                {
                    ...request.data,
                    id: sender.url
                }
            ];
            localStorage.setItem("due", JSON.stringify(due));
        }
    }
    else if (request.method === "manualAdd") {
        let due = JSON.parse(localStorage.getItem("due")) || [];
        due = [
            ...due,
            {
                ...request.data
            }
        ];
        localStorage.setItem("due", JSON.stringify(due));
    }
    else if (request.method === "get") {
        const due = JSON.parse(localStorage.getItem("due")) || [];
        sendResponse(due);
    }
})

const itemExists = (dataset, url) => {
    let exists = false;
    dataset.forEach((item) => {
        if (item.id === url) {
            exists = true;
        }
    })
    console.log(exists);
    return exists;
}
