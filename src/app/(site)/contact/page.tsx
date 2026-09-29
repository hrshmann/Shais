import type { Metadata } from 'next';
import PageTransition from '../../components/page-transition';
import ContactView from './contact-view';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with SHAIS.PK — salon appointments, cosmetics advice and boutique styling.',
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact — SHAIS.PK', description: 'Get in touch with SHAIS.PK — salon appointments, cosmetics advice and boutique styling.', url: '/contact' },
};

export default function Contact() {
  return (
    <PageTransition>
      <ContactView />
    </PageTransition>
  );
}
