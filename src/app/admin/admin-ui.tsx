'use client';

import { useActionState, useState } from 'react';
import { login, logout, publishTheme, restorePreviousTheme, saveWhatsapp, type FormState } from './actions';
import { THEMES, themeName, PREVIEW_PARAM, type ThemeId } from '../lib/themes';
import { formatWhatsapp, waHref, waMessage } from '../lib/whatsapp';
import type { SiteSettings } from '../lib/settings';

const ROUTES = [
  { href: '/', label: 'Home' },
  { href: '/salon', label: 'Salon' },
  { href: '/cosmetics', label: 'Cosmetics' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const Status = ({ state }: { state: FormState }) =>
  state.error ? <p className="admin__status admin__status--error" role="alert">{state.error}</p>
    : state.message ? <p className="admin__status" role="status">{state.message}</p> : null;

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className="admin__form">
      <label className="admin__field">
        <span>Password</span>
        <input type="password" name="password" autoComplete="current-password" required />
      </label>
      <button className="admin__button" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
      <Status state={state} />
    </form>
  );
}

export function AdminDashboard({ settings }: { settings: SiteSettings }) {
  const [preview, setPreview] = useState<ThemeId>(settings.theme);
  const [route, setRoute] = useState('/');
  const [pubState, publish, publishing] = useActionState(publishTheme, {});
  const [restoreState, restore, restoring] = useActionState(async () => restorePreviousTheme(), {});
  const [waState, saveWa, savingWa] = useActionState(saveWhatsapp, {});
  const testLink = waHref(settings.whatsapp, waMessage.general());

  return (
    <div className="admin">
      <header className="admin__header">
        <div>
          <p className="admin__eyebrow">SHAIS.PK · Admin</p>
          <h1 className="admin__title">Appearance &amp; contact</h1>
        </div>
        <form action={logout}>
          <button className="admin__link">Sign out</button>
        </form>
      </header>

      <section className="admin__section" aria-labelledby="theme-h">
        <div className="admin__section-head">
          <h2 id="theme-h">Site theme</h2>
          <p>
            Published default: <strong>{themeName(settings.theme)}</strong>
            {settings.updatedAt && <> · updated {new Date(settings.updatedAt).toLocaleString()}</>}
          </p>
          <p className="admin__hint">
            Choose a theme to preview it below. Publishing makes it the default for every visitor. Visitors who picked
            their own appearance keep their choice on their device.
          </p>
        </div>

        <div className="admin__themes" role="radiogroup" aria-label="Theme to preview">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={preview === t.id}
              className="admin__theme"
              onClick={() => setPreview(t.id)}
            >
              <span className="admin__swatch" aria-hidden="true">
                {t.swatch.map((c) => <span key={c} style={{ background: c }} />)}
              </span>
              <span className="admin__theme-name">
                {t.name}
                {settings.theme === t.id && <em> · live</em>}
              </span>
              <span className="admin__theme-note">{t.note}</span>
            </button>
          ))}
        </div>

        <div className="admin__preview">
          <div className="admin__preview-bar">
            <span>Preview — {themeName(preview)}</span>
            <div className="admin__routes">
              {ROUTES.map((r) => (
                <button key={r.href} type="button" aria-pressed={route === r.href} onClick={() => setRoute(r.href)}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <iframe
            key={`${preview}${route}`}
            title={`Preview of ${route} in ${themeName(preview)}`}
            src={`${route}?${PREVIEW_PARAM}=${preview}`}
            className="admin__frame"
          />
        </div>

        <div className="admin__actions">
          <form action={publish}>
            <input type="hidden" name="theme" value={preview} />
            <button className="admin__button" disabled={publishing || preview === settings.theme}>
              {preview === settings.theme ? 'This theme is live' : publishing ? 'Publishing…' : `Publish ${themeName(preview)}`}
            </button>
          </form>
          {settings.previousTheme && (
            <form action={restore}>
              <button className="admin__button admin__button--ghost" disabled={restoring}>
                Restore previous ({themeName(settings.previousTheme)})
              </button>
            </form>
          )}
        </div>
        <Status state={pubState.error || pubState.message ? pubState : restoreState} />
      </section>

      <section className="admin__section" aria-labelledby="wa-h">
        <div className="admin__section-head">
          <h2 id="wa-h">WhatsApp</h2>
          <p className="admin__hint">
            Used by every WhatsApp button on the site. Leave empty to hide them. Current:{' '}
            <strong>{settings.whatsapp ? formatWhatsapp(settings.whatsapp) : 'not set'}</strong>
          </p>
        </div>
        <form action={saveWa} className="admin__form admin__form--inline">
          <label className="admin__field">
            <span>Business WhatsApp number (international, e.g. 92…)</span>
            <input
              name="whatsapp"
              inputMode="tel"
              defaultValue={settings.whatsapp}
              placeholder="923001234567"
              pattern="[0-9 +()\-]*"
            />
          </label>
          <button className="admin__button" disabled={savingWa}>{savingWa ? 'Saving…' : 'Save number'}</button>
          {testLink && (
            <a className="admin__link" href={testLink} target="_blank" rel="noopener noreferrer">Test link ↗</a>
          )}
        </form>
        <Status state={waState} />
      </section>
    </div>
  );
}
