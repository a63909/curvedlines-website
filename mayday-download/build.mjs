import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { copy } from './src/copy.mjs';

const SITE = 'https://mayday.colorchain.ru/';
const template = await readFile(new URL('./src/template.html', import.meta.url), 'utf8');
const escape = value => String(value).replace(/[&<>"']/g, ch => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[ch]));

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
    if (key === 'featuresHtml') return featuresHtml;
    if (typeof values[key] !== 'string') throw new Error('Missing copy: ' + lang + '/' + key);
    return escape(values[key]);
  });
  const out = new URL(english ? './dist/en/' : './dist/', import.meta.url);
  await mkdir(out, { recursive: true });
  await writeFile(new URL('index.html', out), html + '\n');
}

const uiKeys = ['androidFile', 'macFile', 'copy', 'copied', 'shareError'];
const ui = Object.fromEntries(Object.entries(copy).map(([lang, text]) => [
  lang, Object.fromEntries(uiKeys.map(key => [key, text[key]]))
]));
await writeFile(new URL('./dist/ui.mjs', import.meta.url), 'export const ui = ' + JSON.stringify(ui, null, 2) + ';\n');
