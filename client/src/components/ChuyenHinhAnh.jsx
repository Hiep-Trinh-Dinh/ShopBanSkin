import { useState, useEffect } from "react";

const images = [
  "/image/hinh2.jpg",
  "/image/hinh3.jpg",
  // Thêm đường dẫn hình ảnh nếu cần
];

export default function ChuyenHinhAnh() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen"> 
      <img
        src={images[currentImage]}
        alt="Carousel Image"
        className="object-cover w-full h-full"
      />
    </div>
  );
}