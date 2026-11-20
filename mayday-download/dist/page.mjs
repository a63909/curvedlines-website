import { androidRelease, macRelease, testFlightInvite } from './release.mjs?v=klweb-1';
import { ui } from './ui.mjs?v=klweb-1';

(function setupPage({ androidRelease, macRelease, testFlightInvite }, ui, releaseBase, optionalFonts = []) {
  const byId = id => document.getElementById(id);
  const url = new URL(location.href);
  const lang = document.documentElement.lang === 'en' ? 'en' : 'ru';
  const text = ui[lang];
  const referral = url.searchParams.get('from') === 'bankomet';
  byId('bankomet').hidden = !referral;

  const language = byId('language');
  const languageHref = language.getAttribute('href');
  function setLanguageDestination() {
    const alternate = new URL(languageHref, url);
    if (referral) alternate.searchParams.set('from', 'bankomet');
    if (['#network', '#bots', '#install', '#android', '#windows', '#macos', '#iphone', '#linux'].includes(location.hash)) {
      alternate.hash = location.hash;
    }
    language.href = alternate.href;
  }
  setLanguageDestination();
  window.addEventListener('hashchange', setLanguageDestination);

  const demo = byId('demo-actions');
  const replies = Array.from(document.querySelectorAll('[data-reply]'));
  const choices = Array.from(demo.querySelectorAll('[data-demo]'));
  for (const button of choices) {
    button.addEventListener('click', () => {
      for (const choice of choices) choice.setAttribute('aria-pressed', String(choice === button));
      for (const reply of replies) reply.hidden = reply.dataset.reply !== button.dataset.demo;
    });
  }
  demo.hidden = false;

  if (androidRelease) {
    const { filename, version, bytes, sha256 } = androidRelease;
    const valid = typeof filename === 'string' && /^mayday-[0-9]+\.apk$/.test(filename)
      && typeof version === 'string' && /^[0-9]+(?:\.[0-9]+)*$/.test(version)
      && Number.isSafeInteger(bytes) && bytes > 0
      && typeof sha256 === 'string' && /^[a-f0-9]{64}$/.test(sha256);

    if (valid) {
      const href = new URL(filename, releaseBase).href;
      const download = byId('download');
      download.href = href;
      download.download = filename;
      download.hidden = false;
      const size = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }).format(bytes / 1e6);
      byId('release-note').textContent = text.androidFile.replace('{version}', version).replace('{size}', size);
      byId('android-status').hidden = true;
      byId('android-steps').hidden = false;
      byId('file-hash').textContent = sha256;
      byId('file-details').hidden = false;
      const platform = navigator.userAgentData?.platform || navigator.userAgent;
      byId('platform-note').hidden = /Android/i.test(platform);
    }
  }

  if (macRelease) {
    const { filename, version, bytes, sha256 } = macRelease;
    const valid = typeof filename === 'string' && /^mayday-macos-(?:(?:universal|arm64|x64)-)?[0-9]+(?:\.[0-9]+)+\.dmg$/.test(filename)
      && typeof version === 'string' && /^[0-9]+(?:\.[0-9]+)+$/.test(version)
      && Number.isSafeInteger(bytes) && bytes > 0
      && typeof sha256 === 'string' && /^[a-f0-9]{64}$/.test(sha256);

    if (valid) {
      const download = byId('mac-download');
      download.href = new URL(filename, releaseBase).href;
      download.download = filename;
      download.hidden = false;
      byId('mac-status').hidden = true;
      const size = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }).format(bytes / 1e6);
      byId('mac-note').textContent = text.macFile.replace('{version}', version).replace('{size}', size);
      byId('mac-hash').textContent = sha256;
      byId('mac-details').hidden = false;
    }
  }

  if (typeof testFlightInvite === 'string' && /^https:\/\/testflight\.apple\.com\/join\/[A-Za-z0-9]{8,24}$/.test(testFlightInvite)) {
    const invite = byId('ios-invite');
    invite.href = testFlightInvite;
    invite.hidden = false;
    byId('ios-status').hidden = true;
  }

  const share = byId('share');
  const canShare = url.protocol !== 'file:' && typeof navigator.share === 'function';
  const canCopy = url.protocol !== 'file:' && typeof navigator.clipboard?.writeText === 'function';
  share.hidden = !canShare && !canCopy;
  if (!canShare && canCopy) share.textContent = text.copy;
  share.addEventListener('click', async () => {
    const clean = new URL(location.href);
    clean.search = '';
    clean.hash = '';
    try {
      if (canShare) await navigator.share({ title: 'Mayday', url: clean.href });
      else {
        await navigator.clipboard.writeText(clean.href);
        byId('share-status').textContent = text.copied;
        share.textContent = text.copied;
      }
    } catch (error) {
      if (error.name !== 'AbortError') byId('share-status').textContent = text.shareError;
    }
  });

  if (optionalFonts.length && typeof FontFace === 'function' && typeof AbortController === 'function') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        for (const { family, path, descriptors } of optionalFonts) {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000);
          fetch(path, { signal: controller.signal })
            .then(response => {
              if (!response.ok) throw new Error('Font unavailable');
              return response.arrayBuffer();
            })
            .then(bytes => new FontFace(family, bytes, descriptors).load())
            .then(face => document.fonts.add(face))
            .catch(() => {
              // The system font remains readable if an optional font cannot be loaded.
            })
            .finally(() => clearTimeout(timeout));
        }
      }, 0);
    }, { once: true });
  }
})({ androidRelease, macRelease, testFlightInvite }, ui, new URL('./releases/', import.meta.url));
