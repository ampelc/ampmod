import { shell, app } from 'electron';
import path from 'path';
import ExtDocsWindow from '../windows/extension-documentation';

export const buildOfflineGallery = (win: { webContents: { session: any; setWindowOpenHandler: (arg0: ({ url }: { url: any; }) => { action: string; } | undefined) => void; }; }) => {
  const session = win.webContents.session;

  session.webRequest.onBeforeRequest(
    {
      urls: [
        "https://ampmod.codeberg.page/extensions/*",
        "https://extensions.turbowarp.org/*",
        "https://extensions.ampmod.org/*"
      ]
    },
    (details: { url: string | URL; }, callback: (arg0: { cancel?: boolean; redirectURL?: string; }) => void) => {
      const url = new URL(details.url);
      let localPath: string;

      if (url.hostname === 'extensions.turbowarp.org') {
        const segment = url.pathname.split('/').filter(Boolean)[0];
        if (!segment || segment.includes('.')) return callback({ cancel: false });
        localPath = `ampmod-extension-gallery://./${segment}`;
      } else if (url.hostname === 'raw.codeberg.page') {
        // Path format: /ampmod/extensions/@pages/extension-name
        const segments = url.pathname.split('/').filter(Boolean);
        if (segments.length <= 3) return callback({ cancel: false });
        localPath = `ampmod-extension-gallery://./${segments.slice(3).join('/')}`;
      } else {
        const segments = url.pathname.split('/').filter(Boolean);
        if (segments.length <= 1) return callback({ cancel: false });
        localPath = `ampmod-extension-gallery://./${segments.slice(1).join('/')}`;
      }
      
      callback({ redirectURL: localPath });
    }
  );

  win.webContents.setWindowOpenHandler(({ url }) => {
    const u = new URL(url);
    const segments = u.pathname.split('/').filter(Boolean);

    // Handle TurboWarp
    if (u.hostname === "extensions.turbowarp.org") {
      const segment = segments[0];
      if (segment && !segment.includes('.')) {
        new ExtDocsWindow(`ampmod-extension-gallery://./${segment}`);
        return { action: 'deny' };
      }
      shell.openExternal(url);
      return { action: 'deny' };
    }

    // Handle New Raw Codeberg Pattern
    if (u.hostname === "raw.codeberg.page" && segments[0] === "ampmod" && segments[1] === "extensions") {
      if (segments.length > 3 && segments[2] === "@pages") {
        const galleryURL = `ampmod-extension-gallery://./${segments.slice(3).join('/')}`;
        new ExtDocsWindow(galleryURL);
        return { action: 'deny' };
      }
      shell.openExternal(url);
      return { action: 'deny' };
    }

    // Handle Original Codeberg Pattern
    if (u.hostname === "ampmod.codeberg.page") {
      if (segments.length <= 1 && segments[0] === "extensions") {
        shell.openExternal(url);
        return { action: "deny" };
      }

      if (segments[0] === "extensions") {
        const galleryURL = `ampmod-extension-gallery://./${segments.slice(1).join('/')}`;
        new ExtDocsWindow(galleryURL);
        return { action: 'deny' };
      }
    }

    shell.openExternal(url);
    return { action: 'deny' };
  });
}