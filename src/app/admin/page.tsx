import type { Metadata } from 'next';
import { connection } from 'next/server';
import { adminConfigured, isAdmin } from '../lib/auth';
import { getSettings } from '../lib/settings';
import { AdminDashboard, LoginForm } from './admin-ui';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // always render per request: auth state and env configuration are runtime facts
  await connection();
  if (!adminConfigured()) {
    return (
      <div className="admin admin--narrow">
        <p className="admin__eyebrow">SHAIS.PK · Admin</p>
        <h1 className="admin__title">Admin is locked</h1>
        <p className="admin__text">
          The owner area has not been configured on this server, so no one can sign in. To enable it, set these server
          environment variables and restart:
        </p>
        <pre className="admin__code">{`SHAIS_ADMIN_PASSWORD_HASH=...   # node scripts/hash-admin-password.mjs "your password"
SHAIS_ADMIN_SECRET=...          # printed by the same script`}</pre>
      </div>
    );
  }

  if (!(await isAdmin())) {
    return (
      <div className="admin admin--narrow">
        <p className="admin__eyebrow">SHAIS.PK · Admin</p>
        <h1 className="admin__title">Owner sign in</h1>
        <LoginForm />
      </div>
    );
  }

  const settings = await getSettings();
  return <AdminDashboard settings={settings} />;
}
