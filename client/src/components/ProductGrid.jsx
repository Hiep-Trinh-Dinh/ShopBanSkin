import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllProducts } from "../services/product-service";
import { formatVND } from "../utils/formatVND";

export default function ProductGrid({ searchTerm }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const productsPerPage = 6;
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [currentPage, refresh, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await fetchAllProducts(currentPage, productsPerPage);
      let filteredProducts = response.data;

      if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setProducts(filteredProducts);
      setTotalPages(response.totalPages);
      setTotalPosts(response.totalProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleViewDetails = (product) => {
    localStorage.setItem("productId", product._id);
    navigate(`/product-id/${product._id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {products.length === 0 ? (
        <div className="col-span-full text-center text-gray-600">
          Không tìm thấy sản phẩm
        </div>
      ) : (
        products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600">{formatVND(product.price)}</p>
              <button
                onClick={() => handleViewDetails(product)}
                className="mt-4 block w-full bg-blue-600 text-white py-2 text-center rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                View Details
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}