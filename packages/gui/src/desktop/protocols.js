// inspired by https://github.com/TurboWarp/desktop/blob/master/src-main/protocols.js

import electron from 'electron'; const { app } = electron;
import path from 'node:path';
import fs from 'node:fs/promises';
import { protocol } from 'electron';
import { fileURLToPath } from 'node:url';
import { execSync } from "child_process";
import zlib from "node:zlib";
import { promisify } from "node:util";
const brotliDecompress = promisify(zlib.brotliDecompress);

protocol.registerSchemesAsPrivileged([
  { scheme: 'amp-gui', privileges: { standard: true, supportFetchAPI: true, secure: true } },
  { scheme: 'ampmod-extension-gallery', privileges: { standard: true, supportFetchAPI: true, secure: true } },
  { scheme: 'desktop-info', privileges: { standard: true, supportFetchAPI: true, secure: true } },
  { scheme: 'attached-file', privileges: { standard: true, supportFetchAPI: true, secure: true } },
]);

let hasUsedAttachedFile = false;

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
  '.otf': 'font/otf',
  '.apz': 'application/vnd.ampmod.project',
  '.sb3': 'application/x.scratch.sb3'
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

      let filePath = path.join(app.getAppPath(), 'gui', urlPath);

      let stat = await fs.stat(filePath);

      const content = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

      return new Response(content, {
        headers: { 'content-type': mimeType }
      });

    } catch (err) {
      return new Response(`<h1>Failed to load</h1><p>Please report on <a href="https://codeberg.org/ampmod/ampmod/issues">the issue tracker</a>.</p><pre>${err.message}</pre>`, {
        status: 500,
        headers: { 'content-type': 'text/html' }
      });
    }
  });
  protocol.registerFileProtocol('desktop-info', (request, callback) => {
    let url = request.url.replace('desktop-info://', '');
    url = url.replace(/^\/+|\/+$/g, '');
    const filePath = path.join(app.getAppPath(), 'pages', url);
    callback({ path: filePath });
  });
  protocol.handle('ampmod-extension-gallery', async (request) => {
    try {
      let urlPath = request.url.replace('ampmod-extension-gallery://', '');
      urlPath = urlPath.replace(/^\/+|\/+$/g, '');

      let filePath = path.join(app.getAppPath(), 'extensions', urlPath);

      let brPath = filePath + '.br';
      let content;
      let finalPath = filePath;

      try {
        const compressedData = await fs.readFile(brPath);
        content = await brotliDecompress(compressedData);
        finalPath = brPath;
      } catch {
        try {
          content = await fs.readFile(filePath);
        } catch {
          if (!path.extname(filePath)) {
            const htmlBrPath = filePath + '.html.br';
            try {
              const compressedData = await fs.readFile(htmlBrPath);
              content = await brotliDecompress(compressedData);
              finalPath = htmlBrPath;
            } catch {
              const htmlPath = filePath + '.html';
              content = await fs.readFile(htmlPath);
              finalPath = htmlPath;
            }
          } else {
            throw new Error('File not found');
          }
        }
      }

      const effectiveExt = path.extname(finalPath.endsWith('.br') ? finalPath.slice(0, -3) : finalPath).toLowerCase();
      const mimeType = MIME_TYPES[effectiveExt] || 'application/octet-stream';

      return new Response(content, {
        headers: { 'content-type': mimeType }
      });

    } catch (err) {
      return new Response(
        `alert('Please report on https://codeberg.org/ampmod/ampmod/issues: ' + ${JSON.stringify(err.message)})`,
        {
          status: 200,
          headers: { 'content-type': 'application/javascript' }
        }
      );
    }
  });
  protocol.handle('attached-file', async () => {
    try {
      const targetPath = process.argv.slice(1).find(arg => !arg.startsWith('-') && !arg.endsWith('.js'));

      if (!targetPath || hasUsedAttachedFile) {
        return new Response('', { 
          status: 400, 
          headers: { 'content-type': 'text/plain' } 
        });
      }

      const absolutePath = path.resolve(targetPath);
      const content = await fs.readFile(absolutePath);
      
      const ext = path.extname(absolutePath).toLowerCase();
      const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

      hasUsedAttachedFile = true;
      return new Response(content, {
        headers: { 'content-type': mimeType }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 404,
        headers: { 'content-type': 'application/json' }
      });
    }
  });
};