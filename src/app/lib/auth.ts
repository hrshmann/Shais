import { createHmac, scryptSync, timingSafeEqual, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Owner authentication for /admin.
 *
 * Requires two server environment variables (never committed, never NEXT_PUBLIC_):
 *   SHAIS_ADMIN_PASSWORD_HASH  scrypt hash — generate with: node scripts/hash-admin-password.mjs
 *   SHAIS_ADMIN_SECRET         random string (32+ chars) used to sign the session cookie
 * If either is missing the admin area stays locked.
 */
const COOKIE = 'shais_admin';
const SESSION_SECONDS = 60 * 60 * 8;

export function adminConfigured() {
  const secret = process.env.SHAIS_ADMIN_SECRET ?? '';
  return Boolean(process.env.SHAIS_ADMIN_PASSWORD_HASH) && secret.length >= 32;
}

/** Hash format: scrypt:<saltHex>:<hashHex> (':' because Next expands '$' in .env files) */
export function verifyPassword(password: string): boolean {
  const stored = process.env.SHAIS_ADMIN_PASSWORD_HASH ?? '';
  const [scheme, saltHex, hashHex] = stored.split(':');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function sign(payload: string) {
  return createHmac('sha256', process.env.SHAIS_ADMIN_SECRET ?? '').update(payload).digest('hex');
}

export async function createSession() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${exp}.${randomBytes(12).toString('hex')}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const i = raw.lastIndexOf('.');
  const payload = raw.slice(0, i);
  const sig = Buffer.from(raw.slice(i + 1), 'hex');
  const good = Buffer.from(sign(payload), 'hex');
  if (sig.length !== good.length || !timingSafeEqual(sig, good)) return false;
  return Number(payload.split('.')[0]) > Date.now() / 1000;
}

/* Simple in-memory login throttle (per server instance): 5 attempts / 15 min per client. */
const attempts = new Map<string, { n: number; until: number }>();
export function throttle(key: string): boolean {
  const now = Date.now();
  const a = attempts.get(key);
  if (a && a.until > now && a.n >= 5) return false;
  if (!a || a.until <= now) attempts.set(key, { n: 1, until: now + 15 * 60_000 });
  else a.n += 1;
  return true;
}
export function clearThrottle(key: string) {
  attempts.delete(key);
}
