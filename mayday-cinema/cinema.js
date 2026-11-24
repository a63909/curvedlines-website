import { catalogue } from './catalogue.js';

const byId = new Map(catalogue.map(item => [item.id, item]));
let archive = [];
let archiveStatus = 'loading';
const PAGE_SIZE = 24;
const search = document.querySelector('#search');
const dialog = document.querySelector('#details');
const player = document.querySelector('#player');
const provider = document.querySelector('#provider');
const grid = document.querySelector('#titles');
const genreList = document.querySelector('#genres');
const hero = document.querySelector('#hero');
const detailSave = document.querySelector('#detail-save');

const labels = { home:'Новинки', film:'Фильмы', series:'Сериалы', archive:'Архив фильмов', saved:'Смотреть позже' };
const genreNames = ['Все', 'В плеере', 'Боевик', 'Драма', 'Фантастика', 'Комедия', 'Документальный', 'Классика'];
const storageKey = 'mayday-cinema-saved-v1';
const normalize = value => value.toLocaleLowerCase('ru').replaceAll('ё','е').trim();

function loadSaved() {
  try {
    const ids = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return new Set(Array.isArray(ids) ? ids.filter(id => typeof id === 'string') : []);
  } catch {
    return new Set();
  }
}

const state = { view:'home', genre:'Все', limit:PAGE_SIZE, saved:loadSaved() };

function node(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function artwork(item, large = false) {
  const pic = node('img');
  pic.alt = '';
  pic.decoding = 'async';
  if (!large) pic.loading = 'lazy';
  pic.src = item.imageUrl || './assets/' + (large ? item.cover || item.poster : item.poster);
  pic.addEventListener('error', () => pic.remove(), { once:true });
  return pic;
}

function setSaveState(button, item) {
  button.dataset.save = item.id;
  button.setAttribute('aria-pressed', String(state.saved.has(item.id)));
  button.setAttribute('aria-label', (state.saved.has(item.id) ? 'Убрать из списка: ' : 'Смотреть позже: ') + item.title);
}

function statusLabel(item) {
  return item.availableFrom && Date.now() >= Date.parse(item.availableFrom) ? 'На Кинопоиске' : item.access;
}

function movieCard(item) {
  const card = node('li','card');
  const open = node('button','card-link');
  open.type = 'button';
  open.dataset.movie = item.id;
  open.setAttribute('aria-label',item.title);
  const poster = node('span','poster');
  const image = artwork(item);
  image.addEventListener('error', () => poster.prepend(node('span','poster-placeholder',item.title)), { once:true });
  poster.append(image, node('span', item.embed ? 'poster-status open' : 'poster-status', statusLabel(item)));
  open.append(poster, node('span','card-title',item.title),
    node('span','card-meta',[item.year,item.genres[0]].filter(Boolean).join(' · ')));
  const save = node('button','card-save');
  save.type = 'button';
  save.append(node('span','save-glyph'));
  setSaveState(save,item);
  card.append(open, save);
  return card;
}

function genreMatches(item, genre) {
  if (genre === 'Все') return true;
  if (genre === 'В плеере') return Boolean(item.embed);
  return item.genres.includes(genre);
}

function render() {
  const query = normalize(search.value);
  const home = state.view === 'home' && !query;
  hero.hidden = !home;
  document.querySelector('#open-shelf').hidden = !home || state.genre !== 'Все';
  document.body.dataset.view = home ? 'home' : state.view === 'home' ? 'search' : state.view;
  document.querySelector('#catalog-period').hidden = !home;
  document.querySelector('#section-title').textContent = query ? 'Результаты поиска' : labels[state.view];


  const library = state.view === 'archive' ? archive :
    home ? catalogue.filter(item => item.year === 2026) :
      state.view === 'series' ? catalogue : [...catalogue,...archive];
  const pool = library.filter(item => {
    if (state.view === 'saved' && !state.saved.has(item.id)) return false;
    if ((state.view === 'film' || state.view === 'series') && state.view !== item.type) return false;
    if (!query) return true;
    return normalize([item.title,item.original,item.year,item.service,...item.genres].filter(Boolean).join(' ')).includes(query);
  });
  const genres = genreNames.filter(genre => genre === 'Все' || pool.some(item => genreMatches(item,genre)));
  if (!genres.includes(state.genre)) state.genre = 'Все';
  genreList.replaceChildren(...genres.map(genre => {
    const button = node('button','',genre);
    button.type = 'button';
    button.dataset.genre = genre;
    button.setAttribute('aria-pressed',String(state.genre === genre));
    return button;
  }));
  genreList.hidden = genres.length < 2;

  const filtered = pool.filter(item => genreMatches(item,state.genre));
  grid.replaceChildren(...filtered.slice(0,state.limit).map(movieCard));
  document.querySelector('#more').hidden = filtered.length <= state.limit;
  const empty = document.querySelector('#empty');
  empty.hidden = filtered.length > 0;
  empty.textContent = state.view === 'archive' && archiveStatus !== 'ready'
    ? archiveStatus === 'loading' ? 'Загружаем архив…' : 'Архив временно недоступен. Попробуйте обновить страницу.'
    : state.view === 'saved' && !query ? 'Сохраняйте фильмы и сериалы кнопкой закладки.'
      : 'По этому запросу ничего не найдено.';
  document.querySelector('#result-count').textContent = 'Найдено: ' + filtered.length;

  for (const button of document.querySelectorAll('.nav [data-view]')) {
    if (button.tagName !== 'BUTTON') continue;
    if (button.dataset.view === state.view) button.setAttribute('aria-current','page');
    else button.removeAttribute('aria-current');
  }
  for (const button of document.querySelectorAll('[data-save]')) setSaveState(button,byId.get(button.dataset.save));
}

function changeView(view) {
  state.view = view;
  state.genre = 'Все';
  state.limit = PAGE_SIZE;
  search.value = '';
  render();
  window.scrollTo({ top:0 });
}

function toggleSaved(item) {
  if (state.saved.has(item.id)) state.saved.delete(item.id);
  else state.saved.add(item.id);
  try {
    localStorage.setItem(storageKey,JSON.stringify([...state.saved]));
  } catch {
    // The list still works for this session if persistent storage is unavailable.
  }
  if (state.view === 'saved') render();
  else for (const button of document.querySelectorAll('[data-save="' + item.id + '"]')) setSaveState(button,item);
}

function showDetails(item) {
  document.querySelector('#detail-cover').replaceChildren(artwork(item,true));
  document.querySelector('#details-source').textContent = [item.service,item.period].filter(Boolean).join(' · ');
  document.querySelector('#details-title').textContent = item.title;
  const meta = node('span','',String(item.year));
  const genre = node('span','',item.genres.join(' · '));
  const extra = item.age ? node('span','age',item.age) : item.duration ? node('span','',item.duration) : null;
  document.querySelector('#details-meta').replaceChildren(...[meta,genre,extra].filter(Boolean));
  const description = document.querySelector('#details-description');
  description.textContent = item.description || '';
  description.hidden = !item.description;
  const note = document.querySelector('#details-note');
  note.textContent = item.note || '';
  if (item.license) {
    const license = node('a','',' Условия использования');
    license.href = item.license;
    license.target = '_blank';
    license.rel = 'noopener noreferrer';
    note.append(license);
  }
  setSaveState(detailSave,item);
  provider.href = item.source;
  provider.querySelector('span:last-child').textContent = item.embed ? 'Открыть у источника' :
    item.availableFrom && Date.now() < Date.parse(item.availableFrom) ? 'Страница на Кинопоиске' : 'Смотреть на ' + item.service;
  player.replaceChildren();
  player.hidden = !item.embed;
  if (item.embed) {
    const frame = node('iframe');
    const playerUrl = new URL(item.embed);
    if (playerUrl.hostname === 'video.blender.org') playerUrl.searchParams.set('p2p','0');
    frame.src = playerUrl.href;
    frame.title = 'Плеер ' + item.service + ' — ' + item.title;
    frame.allow = 'fullscreen; picture-in-picture; encrypted-media';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    player.append(frame);
  }
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}

document.querySelector('#hero-watch').addEventListener('click',() => showDetails(byId.get('courier')));
document.querySelector('.search').addEventListener('submit',event => event.preventDefault());
search.addEventListener('input',() => { state.genre = 'Все'; state.limit = PAGE_SIZE; render(); });
document.querySelector('#more').addEventListener('click', () => { state.limit += PAGE_SIZE; render(); });
provider.addEventListener('click',event => {
  if (typeof globalThis.Mayday?.openLink !== 'function') return;
  event.preventDefault();
  Promise.resolve(globalThis.Mayday.openLink(provider.href)).catch(() => {});
});
dialog.addEventListener('close',() => { player.replaceChildren(); player.hidden = true; });
dialog.addEventListener('click',event => { if (event.target === dialog) dialog.close(); });

document.addEventListener('click',event => {
  const button = event.target.closest('button');
  if (button?.dataset.view) changeView(button.dataset.view);
  else if (button?.dataset.genre) {
    const genre = button.dataset.genre;
    state.genre = genre;
    state.limit = PAGE_SIZE;
    render();
    [...genreList.children].find(child => child.dataset.genre === genre)?.focus();
  } else if (button?.dataset.movie) showDetails(byId.get(button.dataset.movie));
  else if (button?.dataset.save) toggleSaved(byId.get(button.dataset.save));
  else if (event.target.closest('a.brand')) { event.preventDefault(); changeView('home'); }
});

document.querySelector('#open-titles').replaceChildren(...catalogue.filter(item => item.embed).map(movieCard));
render();
fetch('./archive-catalogue.json')
  .then(response => {
    if (!response.ok) throw new Error('Archive unavailable');
    return response.json();
  })
  .then(items => {
    if (!Array.isArray(items)) throw new Error('Invalid archive');
    archive = items.filter(item => typeof item.title === 'string' &&
      /^ia-[A-Za-z0-9][A-Za-z0-9_.-]{1,99}$/.test(item.id));
    for (const item of archive) byId.set(item.id,item);
    archiveStatus = 'ready';
    document.querySelector('.archive-entry').textContent = 'Весь архив · ' + archive.length.toLocaleString('ru');
    render();
  })
  .catch(() => { archiveStatus = 'error'; render(); });


