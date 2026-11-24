import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { help } from './help.mjs';
import { copy } from './copy.mjs';

export async function renderHelp(output, site, escape) {
  await copyFile(new URL('./help.css', import.meta.url), new URL('help.css', output));

  for (const [lang, text] of Object.entries(help)) {
    const english = lang === 'en';
    const home = english ? 'en/' : '';
    const otherHome = english ? '' : 'en/';

    for (const topic of [null, ...text.topics]) {
      const subpath = topic ? topic.slug + '/' : '';
      const path = home + 'help/' + subpath;
      const root = '../'.repeat(path.split('/').length - 1);
      const title = topic ? topic.title + ' · ' + text.title : text.title;
      const list = text.topics.map(item => {
        const current = item === topic ? ' aria-current="page"' : '';
        return `<li><a href="${root}${home}help/${item.slug}/"${current}>${escape(item.title)}</a></li>`;
      }).join('\n');

      const sidebar = `<nav class="help-nav" aria-label="${escape(text.navigation)}">
        <a href="${root}${home}help/"${topic ? '' : ' aria-current="page"'}>${escape(text.title)}</a>
        <ul>${list}</ul>
      </nav>`;

      const article = topic ? renderArticle(topic, text, root + home, escape) : `
        <div class="help-intro">
          <h1>${escape(text.title)}</h1>
          <p>${escape(text.summary)}</p>
        </div>
        ${['user', 'developer'].map(group => `
          <section class="help-topic-group">
            <h2>${escape(text[group])}</h2>
            <ul class="help-topic-list">
              ${text.topics.filter(item => item.group === group).map(item => `<li>
                <a class="help-topic" href="${item.slug}/">
                  <span class="icon-tile"><img src="${root}assets/${item.icon}.svg" alt="" width="22" height="22"></span>
                  <span><strong>${escape(item.title)}</strong><span>${escape(item.summary)}</span></span>
                </a>
              </li>`).join('')}
            </ul>
          </section>`).join('')}`;

      const html = `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escape(topic?.summary ?? text.summary)}">
  <meta name="referrer" content="no-referrer">
  <title>${escape(title)}</title>
  <link rel="canonical" href="${site}${path}">
  <link rel="alternate" hreflang="ru" href="${site}help/${subpath}">
  <link rel="alternate" hreflang="en" href="${site}en/help/${subpath}">
  <link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${root}style.css">
  <link rel="stylesheet" href="${root}help.css">
</head>
<body>
  <a class="skip" href="#main">${escape(copy[lang].skip)}</a>
  <header class="shell header help-header">
    <a class="brand" href="${root}${home}" aria-label="${escape(text.home)}">
      <span class="mark"><img src="${root}assets/mayday-mark.svg" alt="" width="24" height="24"></span>Mayday
    </a>
    <a class="language" href="${root}${otherHome}help/${subpath}" lang="${english ? 'ru' : 'en'}" hreflang="${english ? 'ru' : 'en'}">${escape(copy[lang].language)}</a>
  </header>
  <div class="shell help-layout">
    ${sidebar}
    <main id="main">${article}</main>
  </div>
  <footer class="shell footer help-footer">
    <a href="${root}${home}">${escape(text.home)}</a>
    <a href="${root}${home}#install">${escape(text.download)}</a>
  </footer>
</body>
</html>
`;
      const directory = new URL(path, output);
      await mkdir(directory, { recursive: true });
      await writeFile(new URL('index.html', directory), html);
    }
  }
}

function renderArticle(topic, text, home, escape) {
  const contents = topic.sections.map(section =>
    `<li><a href="#${section.id}">${escape(section.title)}</a></li>`
  ).join('');
  const sections = topic.sections.map(section => `
    <section class="help-section" aria-labelledby="${section.id}">
      <h2 id="${section.id}">${escape(section.title)}</h2>
      ${(section.paragraphs ?? []).map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}
      ${section.steps ? '<ol>' + section.steps.map(step => `<li>${escape(step)}</li>`).join('') + '</ol>' : ''}
      ${section.code ? `<pre><code>${escape(section.code)}</code></pre>` : ''}
      ${(section.links ?? []).map(([fragment, label]) => `<p><a href="${home}${fragment}">${escape(label)}</a></p>`).join('')}
    </section>`).join('');
  return `<article class="help-article">
    <div class="help-intro">
      <h1>${escape(topic.title)}</h1>
      <p>${escape(topic.summary)}</p>
    </div>
    <nav class="help-contents" aria-label="${escape(text.contents)}">
      <strong>${escape(text.contents)}</strong>
      <ul>${contents}</ul>
    </nav>
    ${sections}
  </article>`;
}
