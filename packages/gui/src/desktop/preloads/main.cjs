const { ipcRenderer, contextBridge, webFrame } = require("electron");

contextBridge.exposeInMainWorld("_AMP_INTERNAL_API", {
  openAbout: () => ipcRenderer.send("open-about"),
  openDesktopSettings: () => ipcRenderer.send("open-desktop-settings"),
  openAddon: addonID => ipcRenderer.send("open-addon", addonID),
  openAddonSettings: () => ipcRenderer.send("open-addon-settings")
});

const platformClass = (() => {
  switch (process.platform) {
    case "win32":
      return "desktop-windows";
    case "linux":
      return "desktop-linux";
    case "darwin":
      return "desktop-macos";
    default:
      return null;
  }
})();

const patchZoomIssues = () => {
  const zoomFactor = webFrame.getZoomFactor();
  const inverse = 1 / zoomFactor;
  const root = document.documentElement;

  let basePadding = 0;
  if (process.platform === "win32") {
    basePadding = 128;
  } else if (process.platform === "linux") {
    basePadding = 96;
  }

  root.style.setProperty('--zoom-estimate', `${basePadding * inverse}px`);
};

window.addEventListener('resize', patchZoomIssues);

// https://github.com/TurboWarp/desktop/blob/6c52ba5/src-preload/extension-documentation.js

/**
 * @param {string} selector
 * @returns {Promise<Element>}
 */
const waitForElement = selector =>
  new Promise(resolve => {
    let element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      element = document.querySelector(selector);
      if (element) {
        resolve(element);
        observer.disconnect();
      }
    });

    observer.observe(document, {
      childList: true,
      subtree: true
    });
  });

waitForElement("html").then(html => {
  html.classList.add("is-desktop");

  if (platformClass) {
    html.classList.add(platformClass);
  }

  patchZoomIssues();
});
