import type { Metadata } from 'next';
import PageTransition from '../../components/page-transition';
import AboutView from './about-view';

export const metadata: Metadata = {
  title: 'About',
  description: 'SHAIS.PK brings together a salon, authentic cosmetics and ready-made fashion — a curated blend of beauty, fashion and lifestyle.',
  alternates: { canonical: '/about' },
  openGraph: { title: 'About — SHAIS.PK', description: 'SHAIS.PK brings together a salon, authentic cosmetics and ready-made fashion — a curated blend of beauty, fashion and lifestyle.', url: '/about' },
};

export default function About() {
  return (
    <PageTransition>
      <AboutView />
    </PageTransition>
  );
}
