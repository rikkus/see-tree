"use strict"

let myPort = browser.runtime.connect({name: "port-from-cs"});
myPort.onMessage.addListener(function(m) {
  // console.log(`Content script received message from background: ${m.message}`);
  var selection = window.getSelection().toString();
  if (selection == "") {
    alert("Sorry, can't graph this because we can't get the code editor's selection.")
  } else {
    // console.log(`Selection: '${selection}'`);
    myPort.postMessage({ message: selection });
  }
});