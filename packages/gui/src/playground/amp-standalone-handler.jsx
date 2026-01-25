import './import-first.js';
import React from 'react';
import Interface from './render-interface.jsx';
import render from './app-target.js';

const themes = {
  default: require.context('scratch-blocks/media', true, /\.(png|jpg|svg|gif|mp3|wav)$/),
  highContrast: require.context('../lib/themes/blocks/high-contrast-media/blocks-media', true, /\.(png|jpg|svg|gif|mp3|wav)$/),
  dark: require.context('../lib/themes/blocks/dark-media/blocks-media', true, /\.(png|jpg|svg|gif|mp3|wav)$/)
};

const mediaMaps = {};
Object.entries(themes).forEach(([name, context]) => {
  mediaMaps[name] = context.keys().reduce((map, key) => {
    map[key.replace(/^\.\//, '')] = context(key);
    return map;
  }, {});
});

function resolveVirtualPath(url) {
  if (typeof url !== 'string') return url;

  const hashIndex = url.indexOf('#blocks-media/');
  if (hashIndex === -1) return url;

  const fragment = url.slice(hashIndex);

  const match = fragment.match(
    /^#blocks-media\/(default|high-contrast|dark)\/(.+)$/
  );
  if (!match) return url;

  const [, theme, path] = match;
  const themeKey =
    theme === 'high-contrast' ? 'highContrast' : theme;
  if (mediaMaps[themeKey]?.[path]) {
    return mediaMaps[themeKey][path];
  }
  if (mediaMaps.default?.[path]) {
    return mediaMaps.default[path];
  }
  return url;
}

const originalSetAttribute = Element.prototype.setAttribute;
const originalSetAttributeNS = Element.prototype.setAttributeNS;

Element.prototype.setAttribute = function(name, value) {
  return originalSetAttribute.call(this, name, resolveVirtualPath(value));
};

Element.prototype.setAttributeNS = function(ns, name, value) {
  return originalSetAttributeNS.call(this, ns, name, resolveVirtualPath(value));
};

const observer = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;
      
      const imgs = node.tagName === 'IMAGE' || node.tagName === 'IMG' ? [node] : node.querySelectorAll('image, img');
      
      imgs.forEach(img => {
        const src = img.getAttribute('src');
        const href = img.getAttribute('xlink:href');
        
        if (src && src.includes('#blocks-media')) img.setAttribute('src', src);
        if (href && href.includes('#blocks-media')) img.setAttribute('xlink:href', href);
      });
    });
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('addon-settings')) {
  const AddonSettings = require("../addons/settings/settings").default;
  const Clippy = require('../containers/amp-clippy.jsx').default;
  render(
    <React.Fragment>
      <Clippy isFixed />
      <AddonSettings onExportSettings={s => {
        const blob = new Blob([JSON.stringify(s)]);
        require('../lib/download-blob.js').default('settings.json', blob);
      }} />
    </React.Fragment>
  );
} else {
  render(<Interface />);
}