import Header from './Header.jsx';
import ImageCarousel from './ChuyenHinhAnh.jsx';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <ImageCarousel />
    </main>
  );
}