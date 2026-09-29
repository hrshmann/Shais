import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Cursor from '../components/cursor';
import { SiteSettingsProvider } from '../components/site-settings';
import { WhatsAppFloat } from '../components/whatsapp';
import { getSettings } from '../lib/settings';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <SiteSettingsProvider whatsapp={settings.whatsapp} defaultTheme={settings.theme}>
      <a href="#content" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="content">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <Cursor />
    </SiteSettingsProvider>
  );
}
