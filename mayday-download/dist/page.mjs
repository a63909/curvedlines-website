import { androidRelease, macRelease, testFlightInvite } from './release.mjs?v=klweb-1';
import { ui } from './ui.mjs?v=klweb-1';

(function setupPage({ androidRelease, macRelease, testFlightInvite }, ui, releaseBase, optionalFonts = []) {
  const byId = id => document.getElementById(id);
  const url = new URL(location.href);
  const lang = document.documentElement.lang === 'en' ? 'en' : 'ru';
  const text = ui[lang];
  const bankometPath = /\/(?:en\/)?bankomet\/$/.test(url.pathname);
  const invitePath = /\/(?:en\/)?invite\/$/.test(url.pathname);
  const nardyPath = /\/(?:en\/)?nardy\/$/.test(url.pathname);
  const botPath = /\/(?:en\/)?bot\/$/.test(url.pathname);
  const referral = bankometPath || url.searchParams.get('from') === 'bankomet';
  byId('bankomet').hidden = !referral;

  const profileId = invitePath ? /^\?id=([0-9a-f]{40})$/i.exec(url.search)?.[1] : null;
  const validProfileInvite = Boolean(profileId && !/^0{40}$/.test(profileId));
  const candidateBot = botPath ? /^\?id=([a-f0-9]{40})$/.exec(url.search)?.[1] : null;
  const botId = candidateBot && !/^0{40}$/.test(candidateBot) ? candidateBot : null;
  const requestId = bankometPath ? /^#requestId=([A-Za-z0-9_-]{43})$/.exec(url.hash)?.[1] : null;
  let challengeId = null;
  const openMayday = byId('open-mayday');
  if (openMayday && validProfileInvite) {
    openMayday.href = 'mayday://profile/' + profileId.toLowerCase();
    openMayday.hidden = false;
  } else if (openMayday && requestId) {
    openMayday.href = 'mayday://auth/v1?requestId=' + requestId;
    openMayday.hidden = false;
  } else if (openMayday && botId) {
    openMayday.href = 'mayday://bot/v1?id=' + botId;
    openMayday.hidden = false;
  }

  function updateChallenge() {
    const id = /^#id=([0-9a-f]{40})$/i.exec(location.hash)?.[1]?.toLowerCase();
    challengeId = id && !/^0{40}$/.test(id) ? id : null;
    if (openMayday) {
      if (challengeId) openMayday.href = 'mayday://nardy/v1?id=' + challengeId;
      else openMayday.removeAttribute('href');
      openMayday.hidden = !challengeId;
    }
    const note = document.querySelector('.nardy-install-note');
    if (note) note.hidden = !challengeId;
  }

  if (nardyPath) {
    updateChallenge();
    const secondary = byId('hero-secondary');
    for (const action of [openMayday, secondary]) {
      action?.addEventListener('click', () => {
        // A browser with no Mayday handler stays here and can offer the APK.
        window.setTimeout(() => {
          if (document.visibilityState === 'visible') byId('android')?.scrollIntoView();
        }, 900);
      });
    }
    // Preserve the original invite on returning after a download or switching languages.
    for (const anchor of document.querySelectorAll('a[href^="#"]')) {
      const section = byId(anchor.getAttribute('href').slice(1));
      if (!section) continue;
      anchor.addEventListener('click', event => {
        if (!challengeId || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        section.scrollIntoView();
      });
    }
  }

  const language = byId('language');
  const languageHref = language.getAttribute('href');
  function setLanguageDestination() {
    const alternate = new URL(languageHref, url);
    if (referral && !bankometPath) alternate.searchParams.set('from', 'bankomet');
    if (profileId) alternate.searchParams.set('id', profileId);
    if (botId) alternate.searchParams.set('id', botId);
    if (requestId) alternate.hash = 'requestId=' + requestId;
    if (challengeId) alternate.hash = 'id=' + challengeId;
    if (['#network', '#bots', '#install', '#android', '#windows', '#macos', '#iphone', '#linux'].includes(location.hash)) {
      alternate.hash = location.hash;
    }
    language.href = alternate.href;
  }
  setLanguageDestination();
  window.addEventListener('hashchange', () => {
    if (nardyPath) updateChallenge();
    setLanguageDestination();
  });

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

  for (const link of document.querySelectorAll('a[download][href]')) {
    link.addEventListener('click', () => {
      if (typeof globalThis.crypto?.randomUUID !== 'function') return;
      const target = new URL(link.href);
      target.searchParams.set('download', crypto.randomUUID().replaceAll('-', ''));
      link.href = target.href;
    });
  }

  const share = byId('share');
  const canShare = url.protocol !== 'file:' && typeof navigator.share === 'function';
  const canCopy = url.protocol !== 'file:' && typeof navigator.clipboard?.writeText === 'function';
  share.hidden = !canShare && !canCopy;
  if (!canShare && canCopy) share.textContent = text.copy;
  share.addEventListener('click', async () => {
    const clean = new URL(location.href);
    if ((invitePath && !validProfileInvite) || bankometPath) {
      clean.pathname = clean.pathname.replace(/(?:invite|bankomet)\/$/, '');
    }
    clean.search = '';
    if (botId) clean.searchParams.set('id', botId);
    if (validProfileInvite) clean.searchParams.set('id', profileId);
    clean.hash = challengeId ? 'id=' + challengeId : '';
    try {
      if (canShare) {
        const data = validProfileInvite && text.inviteTitle
          ? { title: text.inviteTitle, text: text.inviteDescription, url: clean.href }
          : { title: 'Mayday', url: clean.href };
        await navigator.share(data);
      } else {
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
