import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchDetailProduct } from '../services/product-service';
import { formatVND } from '../utils/formatVND';

export default function ProductDetail() {
  const id = localStorage.getItem('productId'); 
  const [product, setProduct] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetail(id);
  }, [id])


  const fetchDetail = async (id) => {
    try {
      const response = await fetchDetailProduct(id)
      setProduct(response.data)
      console.log(product)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    }
  }

  const handleAddToCart = () => {
    // Lưu thông tin sản phẩm vào localStorage
    localStorage.setItem('buyingProduct', JSON.stringify(product));
    navigate('/buy');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-center mb-8 mt-8">
            <video 
              src={product.video} 
              controls 
              className="w-2/3 h-auto"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="flex flex-col md:flex-row p-6">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
              <img 
                src={product.image} 
                alt={product.name} 
                width={500} 
                height={500} 
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-8">{product.name}</h1>
              <p className="text-gray-600 mb-2">Launch Date: {new Date(product.releaseDate).toLocaleDateString("en-GB")}</p>
              <p className="text-2xl font-semibold text-blue-600 mb-6">{formatVND(product.price)}</p>
              <div className="mt-16">
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center block"
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}