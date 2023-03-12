import React from "react";
import ReactDOM from "react-dom";
import NextApp from "./NextApp";
import * as Sentry from "@sentry/browser";
import * as serviceWorker from "./serviceWorker";
import { version } from "../package.json";

const environment = process.env.NODE_ENV;

if (environment === "production") {
  Sentry.init({
    dsn: "https://f6ab49f370a547b48430377d7e520f65@sentry.io/1491760",
    release: version,
    environment: process.env.NODE_ENV,
  });
}

/*---- Start: Disable Inspect Elements ----*/
var isCtrl, isShift, isAlt, isMeta;

function checkIE(event) {
  if (event.button === 2) {
    return false;
  }
  if (window.event.ctrlKey) isCtrl = true;
  // ctrl
  else isCtrl = false;
  if (window.event.shiftKey) isShift = true;
  // shift
  else isShift = false;
  if (window.event.altKey) isAlt = true;
  // alt
  else isAlt = false;
  if (window.event.metaKey) isMeta = true;
  // command/windows (meta) key
  else isMeta = false;
  return checkForbiddenKeys(event.keyCode);
}

function checkNS(e) {
  if (e.which === 2 || e.which === 3) {
    return false;
  }
  if (e.ctrlKey) isCtrl = true;
  // ctrl
  else isCtrl = false;
  if (e.shiftKey) isShift = true;
  // shift
  else isShift = false;
  if (e.altKey) isAlt = true;
  // alt
  else isAlt = false;
  if (e.metaKey) isMeta = true;
  // command/windows (meta) key
  else isMeta = false;
  return checkForbiddenKeys(e.which);
}

if (navigator.appName === "Netscape") {
  document.captureEvents(Event.MOUSEDOWN);
  document.onmousedown = checkNS;
  document.onkeypress = checkNS;
  document.onkeydown = checkNS;
} else if (navigator.appVersion.indexOf("MSIE") !== -1) {
  document.onmousedown = checkIE;
  document.onkeypress = checkIE;
  document.onkeydown = checkIE;
}

document.oncontextmenu = function () {
  return false;
};

function checkForbiddenKeys(key) {
  if (key === 123) {
    // Check for F-12
    return false;
  }

  if (isCtrl) {
    // Check for Ctrl + U
    if ("u".toLowerCase() === String.fromCharCode(key).toLowerCase()) {
      return false;
    }
    if (isShift) {
      // Check for Ctrl + Shift + I || Ctrl + Shift + C
      if (
        "i".toLowerCase() === String.fromCharCode(key).toLowerCase() ||
        "c".toLowerCase() === String.fromCharCode(key).toLowerCase()
      ) {
        return false;
      }
    }
  }

  //Check for Mac OS
  if (isMeta) {
    if (isAlt) {
      // Check for Cmd + Alt + U or Cmd + Alt + I or Cmd + Alt + J
      if (
        "u".toLowerCase() === String.fromCharCode(key).toLowerCase() ||
        "i".toLowerCase() === String.fromCharCode(key).toLowerCase() ||
        "j".toLowerCase() === String.fromCharCode(key).toLowerCase()
      ) {
        return false;
      }
    }
    if (isShift) {
      // Check for Cmd + Shift + C
      if ("c".toLowerCase() === String.fromCharCode(key).toLowerCase()) {
        return false;
      }
    }
  }
}
/*---- End: Disable Inspect Elements ----*/

ReactDOM.render(<NextApp />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
