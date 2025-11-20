// inspired by https://github.com/TurboWarp/desktop/blob/master/src-main/protocols.js

import path from 'node:path';
import fs from 'node:fs/promises';
import { protocol } from 'electron';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

protocol.registerSchemesAsPrivileged([
  { scheme: 'amp-gui', privileges: { standard: true, supportFetchAPI: true, secure: true } },
  { scheme: 'ampmod-extension-gallery', privileges: { standard: true, supportFetchAPI: true, secure: true } },
]);

const MIME_TYPES = {
  '.txt': 'text/plain',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf'
};

const IS_DEV = process.argv.includes('--dev');

export const setupProtocols = () => {
  protocol.handle('amp-gui', async (request) => {
    try {
      if (IS_DEV) {
        let url = request.url.replace('amp-gui://', '');
        return await fetch(`http://localhost:8601/${url}`);
      }

      let urlPath = request.url.replace('amp-gui://', '');
      urlPath = urlPath.replace(/^\/+|\/+$/g, '');

      let filePath = path.join(__dirname, 'dist-rendered', urlPath);

      let stat = await fs.stat(filePath);

      const content = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

      return new Response(content, {
        headers: { 'content-type': mimeType }
      });

    } catch (err) {
      return new Response(`<h1>Failed to load</h1><p>Please report on <a href="https://ampmod.flarum.cloud/t/bugs-and-glitches">the forums</a>.</p><pre>${err.message}</pre>`, {
        status: 500,
        headers: { 'content-type': 'text/html' }
      });
    }
  });
  protocol.handle('ampmod-extension-gallery', async (request) => {
    try {
      let urlPath = request.url.replace('ampmod-extension-gallery://', '');
      urlPath = urlPath.replace(/^\/+|\/+$/g, '');

      let filePath = path.join(__dirname, 'extensions', urlPath);

      // Auto-append .html if missing AND the raw path does not exist
      let stat;
      try {
        stat = await fs.stat(filePath);
      } catch {
        if (!path.extname(filePath)) {
          const htmlPath = filePath + '.html';
          try {
            stat = await fs.stat(htmlPath);
            filePath = htmlPath;
          } catch {
            throw new Error(`Not found: ${filePath}`);
          }
        } else {
          return;
        }
      }

      const content = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

      return new Response(content, {
        headers: { 'content-type': mimeType }
      });

    } catch (err) {
      return new Response(
        `alert('Please report on https://ampmod.flarum.cloud/t/bugs-and-glitches: ' + ${JSON.stringify(err.message)})`,
        {
          status: 200,
          headers: { 'content-type': 'application/javascript' }
        }
      );
    }
  });
};