import PageTransition from '../components/page-transition';
import HomeView from './home-view';

export default function Home() {
  return (
    <PageTransition>
      <HomeView />
    </PageTransition>
  );
}
