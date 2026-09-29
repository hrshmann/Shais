'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { THEMES, themeName, type ThemeId } from '../lib/themes';
import { applyVisitorTheme, readVisitorTheme, subscribeVisitorTheme } from '../lib/theme-client';
import { useSiteSettings } from './site-settings';

/**
 * Discreet appearance control for visitors. Their choice is remembered in this
 * browser only and never changes the owner's published default.
 */
export default function ThemeSwitcher({ placement = 'nav' }: { placement?: 'nav' | 'menu' }) {
  const { defaultTheme } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const choice = useSyncExternalStore(subscribeVisitorTheme, readVisitorTheme, () => null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    // the nav hides on scroll, so the panel closes with it
    const onScroll = () => setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  const active = choice ?? defaultTheme;
  const current = THEMES.find((t) => t.id === active) ?? THEMES[0];

  const pick = (id: ThemeId | null, e: React.MouseEvent) => {
    applyVisitorTheme(id, { x: e.clientX, y: e.clientY });
  };

  return (
    <div className={`theme-switch theme-switch--${placement}`} ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="theme-switch__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="theme-switch__dot" aria-hidden="true">
          {current.swatch.map((c) => <span key={c} style={{ background: c }} />)}
        </span>
        <span className="theme-switch__label">Appearance</span>
      </button>

      <div id={panelId} className={`theme-switch__panel${open ? ' is-open' : ''}`} hidden={!open}>
        <p className="theme-switch__title">Appearance</p>
        <div role="radiogroup" aria-label="Choose an appearance">
          <button
            type="button"
            role="radio"
            aria-checked={choice === null}
            className="theme-switch__option"
            onClick={(e) => pick(null, e)}
          >
            <span className="theme-switch__option-name">Site default</span>
            <span className="theme-switch__option-note">{themeName(defaultTheme)}</span>
          </button>
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={choice === t.id}
              className="theme-switch__option"
              onClick={(e) => pick(t.id, e)}
            >
              <span className="theme-switch__swatch" aria-hidden="true">
                {t.swatch.map((c) => <span key={c} style={{ background: c }} />)}
              </span>
              <span className="theme-switch__option-name">{t.name}</span>
            </button>
          ))}
        </div>
        <p className="theme-switch__foot">Saved on this device only.</p>
      </div>
    </div>
  );
}
