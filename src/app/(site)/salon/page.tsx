import type { Metadata } from 'next';
import PageTransition from '../../components/page-transition';
import SalonView from './salon-view';

export const metadata: Metadata = {
  title: 'Salon',
  description: 'Hair, makeup, skincare and nails at the SHAIS.PK salon — book an appointment.',
  alternates: { canonical: '/salon' },
  openGraph: { title: 'Salon — SHAIS.PK', description: 'Hair, makeup, skincare and nails at the SHAIS.PK salon — book an appointment.', url: '/salon' },
};

export default function Salon() {
  return (
    <PageTransition>
      <SalonView />
    </PageTransition>
  );
}
