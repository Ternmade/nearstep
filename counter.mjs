// The optional website counter is independent of the app and its private data.
export const counterKey = 'nearstep.web-counter.v1';
export function parseCount(raw, now) {
  if (raw === null) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || Array.isArray(value) || value.version !== 1 ||
        Object.keys(value).length !== 2 || !Number.isSafeInteger(value.since) ||
        value.since < 0 || value.since > now) return null;
    return value.since;
  } catch { return null; }
}
export function elapsedText(since, now) {
  const seconds = Math.max(0, Math.floor((now - since) / 1000));
  const days = Math.floor(seconds / 86400);
  const pad = value => String(value).padStart(2, '0');
  return `${days} ${days === 1 ? 'day' : 'days'} · ${pad(Math.floor(seconds / 3600) % 24)}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}`;
}

function connectCounter() {
  const panel = document.querySelector('[data-counter]');
  if (!panel) return;
  const clock = panel.querySelector('output');
  const status = panel.querySelector('[role="status"]');
  const start = panel.querySelector('[data-start]');
  const clear = panel.querySelector('[data-clear]');
  const confirmation = panel.querySelector('[data-confirmation]');
  const cancel = panel.querySelector('[data-cancel]');
  const confirm = panel.querySelector('[data-confirm]');
  let since = null;
  let stored = false;
  function refresh() {
    clock.textContent = since === null ? 'Not started' : elapsedText(since, Date.now());
    start.hidden = since !== null || stored;
    clear.hidden = since === null && !stored;
  }
  function restore() {
    try {
      const raw = window.localStorage.getItem(counterKey);
      stored = raw !== null;
      since = parseCount(raw, Date.now());
      status.textContent = stored && since === null
        ? 'This browser count could not be read. Clear it to start again.'
        : since === null ? 'Start when you choose. No account needed.' : 'Your count is saved in this browser.';
    } catch {
      status.textContent = 'Your browser cannot save this count. You can still use it while this page stays open.';
    }
    refresh();
  }
  start.addEventListener('click', () => {
    since = Date.now();
    try {
      window.localStorage.setItem(counterKey, JSON.stringify({version: 1, since}));
      stored = true;
      status.textContent = 'Started now and saved in this browser.';
    } catch {
      status.textContent = 'Started now, but this browser could not save it. Closing this page may lose the count.';
    }
    refresh();
  });
  clear.addEventListener('click', () => {
    confirmation.hidden = false;
    cancel.focus();
  });
  cancel.addEventListener('click', () => {
    confirmation.hidden = true;
    clear.focus();
  });
  confirm.addEventListener('click', () => {
    try {
      window.localStorage.removeItem(counterKey);
      stored = false;
      since = null;
      confirmation.hidden = true;
      status.textContent = 'Cleared from this browser. Your Nearstep app has not changed.';
      refresh();
      start.focus();
    } catch {
      status.textContent = 'This browser could not clear the saved count. Nothing was changed; you can try again.';
    }
  });
  window.addEventListener('storage', event => {
    if (event.key === counterKey) { confirmation.hidden = true; restore(); }
  });
  document.addEventListener('visibilitychange', refresh);
  restore();
  window.setInterval(refresh, 1000);
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', connectCounter, {once: true});
  else connectCounter();
}
