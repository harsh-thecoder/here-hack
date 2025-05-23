import Header from '@/components/Header';
import MapComponent from '@/components/MapComponent';

export const metadata = {
  title: 'Here We Go',
};

export default function Home() {
  return (
    <div className="bg-offwhite min-h-screen">
      <Header />
      <MapComponent />
    </div>
  );
}
