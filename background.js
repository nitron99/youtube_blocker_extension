

// ---------------------- message functions ------------------------
chrome.runtime.onMessage.addListener((obj, sender, response) => {

  return true;
});


// ---------------------- detection function -----------------------
chrome.tabs.onUpdated.addListener((tabId) => {
  chrome.tabs.get(tabId, (info) => {
    test(info);
  }) 
})

chrome.tabs.onActivated.addListener((info) => {
  chrome.tabs.get(info.tabId, (info) => {
    test(info);
  }) 
});

chrome.runtime.onInstalled.addListener((info) => {
  console.log(info);
  if(info.reason != "update") setupStorage();

  setTimeout(() => {
    changeIcon();
  }, 1000);
})

chrome.storage.onChanged.addListener(
  (e) => console.log(e)
)

chrome.action.onClicked.addListener((e) => {changeIcon()});


// ---------------------- testing functions ------------------------
const test = (info) => {
  if(info.url.includes("www.youtube.com")){
    // url dectected => check if content script exists there of not.
    executeScript(info.id, true, (response) => {
      // check if state is ON of OFF.
      getStorage((state) => {
        if(state) chrome.tabs.sendMessage(info.id, { id: "BLOCK_PAGE" });
      })
    })
  }
}


// ---------------------- miscellaneous ----------------------------
const executeScript = async (tabId, allFrames, callback) => {
  // get all scripts with tag -> block-script
  const scripts = await chrome.scripting.getRegisteredContentScripts({ids: ["block-script"]});

  console.log(scripts);

  if(scripts.length > 0){
    // means script already exists no need to execute again
    callback(true);
  }else{
    // first register the script
    const blockScript = {
      id: "block-script",
      js: ["contentScript.js"],
      matches: ["<all_urls>"],
    };
    try {
      await chrome.scripting.registerContentScripts([blockScript]);
      chrome.scripting.executeScript({
        injectImmediately: true,
        target: { tabId: tabId, allFrames: allFrames },
        files: [ "contentScript.js" ]
      })
      .then(() => {
        console.log("script injected in all frames from background script")
        callback(true);
      })
      .catch(() => {
        callback(false);
      });
    } catch (err) {
      console.log(`failed to register content scripts: ${err}`);
    }
  }
}

function changeIcon(){
  getStorage((state) => {
    if(state){
      chrome.action.setIcon({path: "icons/red.png"});
      chrome.action.setTitle({title: "❌Youtube not blocked - press to block"});
      chrome.tabs.reload();
      setStorage(false);
    }else{
      chrome.action.setIcon({path: "icons/green.png"});
      chrome.action.setTitle({title: "✅Youtube blocked - press to unblock"});
      chrome.tabs.reload();
      setStorage(true);
    }
  })
}

function setupStorage(){
  chrome.storage.local.set({
    active: false
  })
}

function getStorage(callback){
  chrome.storage.local.get(['active'], (info) => {
    callback(info.active);
  })
}

function setStorage(data){
  chrome.storage.local.set({
    active: data
  });
}