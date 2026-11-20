import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { copy } from './src/copy.mjs';
import { setupPage } from './src/page.mjs';
import { androidRelease, macRelease, testFlightInvite } from './dist/release.mjs';

const SITE = 'https://mayday.colorchain.ru/';
const template = await readFile(new URL('./src/template.html', import.meta.url), 'utf8');
const fontFaces = [];
const stylesheet = (await readFile(new URL('./dist/style.css', import.meta.url), 'utf8'))
  .replace(/@font-face\s*\{([^}]+)\}/g, (_, block) => {
    const props = Object.fromEntries([...block.matchAll(/([\w-]+):\s*([^;]+);/g)]
      .map(([, property, value]) => [property, value.trim()]));
    const path = props.src?.match(/^url\("(\.\/assets\/fonts\/[\w-]+\.woff2)"\)/)?.[1];
    if (!path || !props['font-family']) throw new Error('Unsupported font-face declaration');
    fontFaces.push({
      family: props['font-family'].replace(/^"|"$/g, ''),
      path: path.slice(2),
      descriptors: {
        style: props['font-style'],
        weight: props['font-weight'],
        unicodeRange: props['unicode-range']
      }
    });
    return '';
  }).trim();
const releaseConfig = { androidRelease, macRelease, testFlightInvite };
const uiKeys = ['androidFile', 'macFile', 'copy', 'copied', 'shareError'];
const ui = Object.fromEntries(Object.entries(copy).map(([lang, text]) => [
  lang, Object.fromEntries(uiKeys.map(key => [key, text[key]]))
]));
const initializer = setupPage.toString();
const scriptData = value => JSON.stringify(value).replaceAll('<', '\\u003c');
const escape = value => String(value).replace(/[&<>"']/g, ch => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[ch]));

const bundledAsset = /"(?:\.\/|\.\.\/)assets\/((?:[\w-]+\/)*[\w-]+\.svg)"/g;
const assetUrls = new Map();

for (const lang of ['ru', 'en']) {
  const english = lang === 'en';
  const text = copy[lang];
  const root = english ? '../' : './';
  const values = {
    ...text, root, lang,
    canonical: english ? SITE + 'en/' : SITE,
    shareImage: SITE + (english ? 'assets/share-en.png' : 'assets/share.png') + '?v=mayday-2',
    locale: english ? 'en_US' : 'ru_RU',
    alternateLocale: english ? 'ru_RU' : 'en_US',
    otherLang: english ? 'ru' : 'en',
    languageHref: english ? '../' : './en/'
  };
  const featuresHtml = text.features.map(([icon, title, body]) => `
        <article class="feature">
          <span class="icon-tile"><img src="${root}assets/${escape(icon)}.svg" alt="" width="24" height="24"></span>
          <h3>${escape(title)}</h3><p>${escape(body)}</p>
        </article>`).join('\n');
  const html = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (key === 'pageStyles') return stylesheet;
    if (key === 'pageScript') {
      const fonts = fontFaces.map(({ path, ...face }) => ({ ...face, path: root + path }));
      return `(${initializer})(${scriptData(releaseConfig)}, ${scriptData({ [lang]: ui[lang] })}, new URL('${root}releases/', location.href), ${scriptData(fonts)});`;
    }
    if (key === 'featuresHtml') return featuresHtml;
    if (typeof values[key] !== 'string') throw new Error('Missing copy: ' + lang + '/' + key);
    return escape(values[key]);
  });
  const out = new URL(english ? './dist/en/' : './dist/', import.meta.url);
  for (const [, path] of html.matchAll(bundledAsset)) {
    if (assetUrls.has(path)) continue;
    const svg = await readFile(new URL('./dist/assets/' + path, import.meta.url), 'utf8');
    const encoded = encodeURIComponent(svg.trim()).replaceAll('%20', ' ').replaceAll('%2F', '/').replaceAll('%3D', '=');
    assetUrls.set(path, `data:image/svg+xml,${encoded}`);
  }
  const bundledHtml = html.replace(bundledAsset, (_, path) => `"${assetUrls.get(path)}"`);
  await mkdir(out, { recursive: true });
  await writeFile(new URL('index.html', out), bundledHtml.trimEnd() + '\n');
}

// Older cached pages still request these modules.
const legacyPage = `import { androidRelease, macRelease, testFlightInvite } from './release.mjs?v=klweb-1';
import { ui } from './ui.mjs?v=klweb-1';

(${initializer})({ androidRelease, macRelease, testFlightInvite }, ui, new URL('./releases/', import.meta.url));
`;
await writeFile(new URL('./dist/page.mjs', import.meta.url), legacyPage);
await writeFile(new URL('./dist/ui.mjs', import.meta.url), 'export const ui = ' + JSON.stringify(ui, null, 2) + ';\n');
