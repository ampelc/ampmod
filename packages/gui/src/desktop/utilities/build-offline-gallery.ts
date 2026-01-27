import { shell, app } from 'electron';
import path from 'path';
import ExtDocsWindow from '../windows/extension-documentation';

export const buildOfflineGallery = (win: { webContents: { session: any; setWindowOpenHandler: (arg0: ({ url }: { url: any; }) => { action: string; } | undefined) => void; }; }) => {
  const session = win.webContents.session;

  session.webRequest.onBeforeRequest(
    {
      urls: [
        "https://ampmod.codeberg.page/extensions/*",
        "https://extensions.turbowarp.org/*"
      ]
    },
    (details: { url: string | URL; }, callback: (arg0: { cancel?: boolean; redirectURL?: string; }) => void) => {
      const url = new URL(details.url);
      
      let localPath: string;

      if (url.hostname === 'extensions.turbowarp.org') {
        const segment = url.pathname.split('/').filter(Boolean)[0];
        if (!segment || segment.includes('.')) return callback({ cancel: false }); // ignore assets
        localPath = `ampmod-extension-gallery://./${segment}`;
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

    if (u.hostname === "extensions.turbowarp.org") {
      const segment = u.pathname.split('/').filter(Boolean)[0];
      if (segment && !segment.includes('.')) {
        const galleryURL = `ampmod-extension-gallery://./${segment}`;
        new ExtDocsWindow(galleryURL);
        return { action: 'deny' };
      }
      shell.openExternal(url);
      return { action: 'deny' };
    }

    if (u.hostname === "ampmod.codeberg.page") {
      const segments = u.pathname.split('/').filter(Boolean);
      
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