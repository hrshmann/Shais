'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { adminConfigured, clearThrottle, createSession, destroySession, isAdmin, throttle, verifyPassword } from '../lib/auth';
import { getSettings, normalizeWhatsapp, saveSettings } from '../lib/settings';
import { isThemeId } from '../lib/themes';

export type FormState = { ok?: boolean; error?: string; message?: string };

async function clientKey() {
  const h = await headers();
  return (h.get('x-forwarded-for') ?? h.get('x-real-ip') ?? 'local').split(',')[0].trim();
}

/** Every mutating action re-checks the session — the page gate alone is not enough. */
async function requireAdmin() {
  if (!(await isAdmin())) throw new Error('Not authorised');
}

/** Rebuild every public page so visitors get the new default. */
function republish() {
  revalidatePath('/', 'layout');
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  if (!adminConfigured()) return { error: 'The admin area has not been configured on this server.' };
  const key = await clientKey();
  if (!throttle(key)) return { error: 'Too many attempts. Please wait 15 minutes and try again.' };
  const password = String(form.get('password') ?? '');
  if (!verifyPassword(password)) return { error: 'That password is not correct.' };
  clearThrottle(key);
  await createSession();
  redirect('/admin');
}

export async function logout() {
  await destroySession();
  redirect('/admin');
}

export async function publishTheme(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const theme = form.get('theme');
  if (!isThemeId(theme)) return { error: 'Unknown theme.' };
  const current = await getSettings();
  if (current.theme === theme) return { ok: true, message: 'That theme is already the site default.' };
  await saveSettings({ theme, previousTheme: current.theme });
  republish();
  return { ok: true, message: 'Published. All visitors now see this theme by default.' };
}

export async function restorePreviousTheme(): Promise<FormState> {
  await requireAdmin();
  const current = await getSettings();
  if (!current.previousTheme) return { error: 'There is no previous theme to restore.' };
  await saveSettings({ theme: current.previousTheme, previousTheme: current.theme });
  republish();
  return { ok: true, message: 'Previous theme restored.' };
}

export async function saveWhatsapp(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const number = normalizeWhatsapp(form.get('whatsapp'));
  if (number === null) {
    return { error: 'Enter the full international number, digits only (10–15 digits, e.g. 92 followed by the mobile number).' };
  }
  await saveSettings({ whatsapp: number });
  republish();
  return { ok: true, message: number ? 'WhatsApp number saved. Buttons across the site now use it.' : 'WhatsApp number removed. WhatsApp buttons are now hidden.' };
}
