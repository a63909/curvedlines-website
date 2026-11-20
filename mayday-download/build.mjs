import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { copy } from './src/copy.mjs';
import { setupPage } from './src/page.mjs';
import { androidRelease, macRelease, testFlightInvite } from './dist/release.mjs';

const SITE = 'https://mayday.colorchain.ru/';
const template = await readFile(new URL('./src/template.html', import.meta.url), 'utf8');
const stylesheet = (await readFile(new URL('./dist/style.css', import.meta.url), 'utf8')).trimEnd();
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

const bundledAsset = /"(?:\.\/|\.\.\/)assets\/((?:[\w-]+\/)*[\w-]+\.(svg|woff2))"/g;
const assetUrls = new Map();
const mediaTypes = { svg: 'image/svg+xml', woff2: 'font/woff2' };

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
      return `(${initializer})(${scriptData(releaseConfig)}, ${scriptData({ [lang]: ui[lang] })}, new URL('${root}releases/', location.href));`;
    }
    if (key === 'featuresHtml') return featuresHtml;
    if (typeof values[key] !== 'string') throw new Error('Missing copy: ' + lang + '/' + key);
    return escape(values[key]);
  });
  const out = new URL(english ? './dist/en/' : './dist/', import.meta.url);
  for (const [, path, ext] of html.matchAll(bundledAsset)) {
    if (assetUrls.has(path)) continue;
    const bytes = await readFile(new URL('./dist/assets/' + path, import.meta.url));
    assetUrls.set(path, `data:${mediaTypes[ext]};base64,${bytes.toString('base64')}`);
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
