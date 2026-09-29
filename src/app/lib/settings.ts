import { promises as fs } from 'node:fs';
import path from 'node:path';
import { DEFAULT_THEME, isThemeId, type ThemeId } from './themes';
import { SITE } from './site';

/**
 * Owner-controlled, site-wide settings (the published theme and the WhatsApp number).
 *
 * Storage: a JSON file on the server's disk (SHAIS_SETTINGS_FILE, default ./.data/settings.json).
 * That persists on a normal Node host (VPS, Docker with a volume, `next start`).
 * It does NOT persist on serverless/read-only hosts (e.g. Vercel) — there, replace
 * `fileStore` with a database/KV implementation of the same `SettingsStore` interface.
 */
export type SiteSettings = {
  theme: ThemeId;
  previousTheme: ThemeId | null;
  /** digits only, international format; empty = not configured */
  whatsapp: string;
  updatedAt: string | null;
};

export interface SettingsStore {
  read(): Promise<Partial<SiteSettings> | null>;
  write(s: SiteSettings): Promise<void>;
}

const file = path.resolve(/*turbopackIgnore: true*/ process.env.SHAIS_SETTINGS_FILE ?? path.join(process.cwd(), '.data', 'settings.json'));

const fileStore: SettingsStore = {
  async read() {
    try {
      return JSON.parse(await fs.readFile(/*turbopackIgnore: true*/ file, 'utf8'));
    } catch {
      return null;
    }
  },
  async write(s) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(s, null, 2), 'utf8');
    await fs.rename(tmp, file); // atomic replace
  },
};

const store: SettingsStore = fileStore;

export function normalizeWhatsapp(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const digits = v.replace(/[\s()+-]/g, '');
  if (digits === '') return '';
  return /^\d{10,15}$/.test(digits) ? digits : null;
}

export async function getSettings(): Promise<SiteSettings> {
  const raw = (await store.read()) ?? {};
  return {
    theme: isThemeId(raw.theme) ? raw.theme : DEFAULT_THEME,
    previousTheme: isThemeId(raw.previousTheme) ? raw.previousTheme : null,
    whatsapp: normalizeWhatsapp(raw.whatsapp) || normalizeWhatsapp(SITE.contact.whatsapp) || '',
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : null,
  };
}

export async function saveSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  const next = { ...(await getSettings()), ...patch, updatedAt: new Date().toISOString() };
  await store.write(next);
  return next;
}
