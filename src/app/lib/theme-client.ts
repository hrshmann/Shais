'use client';

import { isThemeId, VISITOR_THEME_KEY, type ThemeId } from './themes';

const CHANGE = 'shais-theme-change';

/** Subscribe to visitor-theme changes (this tab and other tabs). For useSyncExternalStore. */
export function subscribeVisitorTheme(cb: () => void) {
  window.addEventListener(CHANGE, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(CHANGE, cb);
    window.removeEventListener('storage', cb);
  };
}

/** A visitor's own preference. Browser-only; never affects the owner's published default. */
export function readVisitorTheme(): ThemeId | null {
  try {
    const v = localStorage.getItem(VISITOR_THEME_KEY);
    return isThemeId(v) ? v : null;
  } catch {
    return null;
  }
}

/**
 * Apply a visitor theme (null = follow the site default).
 * The new palette is revealed as a circle growing from `origin`.
 */
export function applyVisitorTheme(id: ThemeId | null, origin?: { x: number; y: number }) {
  try {
    if (id) localStorage.setItem(VISITOR_THEME_KEY, id);
    else localStorage.removeItem(VISITOR_THEME_KEY);
  } catch {
    /* storage unavailable: still apply for this page view */
  }
  window.dispatchEvent(new Event(CHANGE));

  const html = document.documentElement;
  const swap = () => {
    if (id) html.setAttribute('data-theme', id);
    else html.removeAttribute('data-theme');
  };

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return swap();

  if (typeof document.startViewTransition === 'function') {
    html.style.setProperty('--vt-x', origin ? `${origin.x}px` : '50%');
    html.style.setProperty('--vt-y', origin ? `${origin.y}px` : '0px');
    html.classList.add('theme-vt');
    const vt = document.startViewTransition(swap);
    vt.finished.finally(() => html.classList.remove('theme-vt'));
    return;
  }

  html.classList.add('theme-fade');
  swap();
  window.setTimeout(() => html.classList.remove('theme-fade'), 650);
}
