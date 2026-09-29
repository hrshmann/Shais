import type { Metadata } from 'next';
import PageTransition from '../../components/page-transition';
import BoutiqueView from './boutique-view';

export const metadata: Metadata = {
  title: 'Boutique',
  description: 'Ready-made fashion for every occasion — formals, casual luxe, accessories and bridal at SHAIS.PK.',
  alternates: { canonical: '/boutique' },
  openGraph: { title: 'Boutique — SHAIS.PK', description: 'Ready-made fashion for every occasion — formals, casual luxe, accessories and bridal at SHAIS.PK.', url: '/boutique' },
};

export default function Boutique() {
  return (
    <PageTransition>
      <BoutiqueView />
    </PageTransition>
  );
}
