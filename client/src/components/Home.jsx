import Header from './Header.jsx';
import ImageCarousel from './ChuyenHinhAnh.jsx';
import AI from './AI.jsx';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <ImageCarousel />
      <AI />
    </main>
  );
}