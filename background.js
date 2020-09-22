"use strict"

browser.contextMenus.create({
  id: "see-tree",
  title: "See Tree",
  contexts: ["selection"],
});

let ports = []

function connected(p) {
  // console.log(`Background: Connection from tab ${p.sender.tab.id}`);
  ports[p.sender.tab.id] = p;
  p.onMessage.addListener(function (m) {
    // console.log(`Background: Got message: ${m.message}`);
    var url = browser.extension.getURL("graph.html") + "?tree=" + encodeURI(m.message);
    browser.tabs.create({ url: url });
  });
}

browser.runtime.onConnect.addListener(connected);

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "see-tree") { return; }
  // console.log("Background: Click on see tree menu from tab: " + tab.id);
  let port = ports[tab.id];
  if (!port) {
    alert("Sorry, can't show graph due to internal error.")
    // console.log("Tab has not previous connected a port to us, so we can't talk to it. Maybe its content script crashed?");
  } else {
    // console.log("Background: Sending message to tab to ask for selection");
    port.postMessage({ message: "Please show a graph" });
  }
});