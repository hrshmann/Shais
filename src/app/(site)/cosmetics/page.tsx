import type { Metadata } from 'next';
import PageTransition from '../../components/page-transition';
import CosmeticsView from './cosmetics-view';

export const metadata: Metadata = {
  title: 'Cosmetics',
  description: 'Authentic skincare, makeup, fragrance and hair care from trusted brands, curated by SHAIS.PK.',
  alternates: { canonical: '/cosmetics' },
  openGraph: { title: 'Cosmetics — SHAIS.PK', description: 'Authentic skincare, makeup, fragrance and hair care from trusted brands, curated by SHAIS.PK.', url: '/cosmetics' },
};

export default function Cosmetics() {
  return (
    <PageTransition>
      <CosmeticsView />
    </PageTransition>
  );
}
