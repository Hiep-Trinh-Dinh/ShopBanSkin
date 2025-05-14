'use client'

import { useEffect, useState } from 'react'
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa'
import Pagination from '../Pagination'
import { createProduct, deleteProduct, editProduct, fetchAllProducts } from '../../services/product-service'
import * as Alert from '../Alert'
import { useMutation } from '@tanstack/react-query'
import { formatVND } from '../../utils/formatVND'

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productsPerPage = 6; // Thay đổi từ 2 thành 6
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDetail, setIsDetail] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)

  useEffect(() => {
      fetchProducts();
    }, [currentPage, refresh])
  
  const fetchProducts = async () => {
    try {
      const response = await fetchAllProducts(currentPage, productsPerPage)
      setProducts(response.data)
      setTotalPages(response.totalPages)
      setTotalPosts(response.totalProducts)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    }
  }

  const [newProduct, setNewProduct] = useState({
    name: '',
    image: '',
    releaseDate: '',
    price: '',
    video: '',
    story: '',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setNewProduct(prev => ({
      ...prev,
      image: file
    }))
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    setNewProduct(prev => ({
      ...prev,
      video: file
    }))
  }

  const handleEdit = (product) => {
    setNewProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
    // setSelectedProduct(product);
  }

  const handleDelete = (productId) => {
    mutationDeleteProduct.mutate(productId);
  }

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetail(true);
  }

  const handleAddProduct = () => {
    setIsEditing(false);
    setIsModalOpen(true);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append('name', newProduct.name)
    formData.append('price', newProduct.price)
    formData.append('story', newProduct.story)
    formData.append('releaseDate', newProduct.releaseDate)
    if (newProduct.image) {
      formData.append('image', newProduct.image)
    }
    if (newProduct.video) {
      formData.append('video', newProduct.video)
    }
    if (isEditing) {
      mutationEditProduct.mutate({ id: newProduct._id, data: formData })
    } else {
      mutationCreateProduct.mutate(formData)
    }
  }

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const mutationCreateProduct = useMutation({
    mutationFn: async (data) => {
      return await createProduct(data)
    },
    onSuccess: (data) => {
      Alert.success(data.message);
      setRefresh(!refresh);
      setIsModalOpen(false);
      setNewProduct({
        name: '',
        image: '',
        releaseDate: '',
        price: '',
        video: '',
        story: ''
      });
    },
    onError: (error) => {
      Alert.error(error.response.data.message);
      console.error('Failed to create post:', error)
    }
  })

  const mutationEditProduct = useMutation({
    mutationFn: async ({ id, data }) => {
      return await editProduct(id, data); 
  },
    onSuccess: (data) => {
      Alert.success(data.message);
      setRefresh(!refresh);
      setIsEditing(false);
      setIsModalOpen(false);
    },
    onError: (error) => {
      Alert.error(error.response.data.message);
      console.error('Failed to create post:', error)
    }
  })

  const mutationDeleteProduct = useMutation({
    mutationFn: async (id) => {
      return await deleteProduct(id)
    },
    onSuccess: (data) => {
      Alert.success(data.message);
      setRefresh(!refresh);
    },
    onError: (error) => {
      Alert.error(error.response.data.message);
      console.error('Failed to create post:', error)
    }
  })

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button 
          onClick={handleAddProduct} 
          className="flex items-center text-green-600 hover:text-green-900"
        >
          <FaPlus className="mr-1" /> Thêm sản phẩm mới
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Tên sản phẩm</label>
                <input 
                  type="text" 
                  value={newProduct.name} 
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required 
                  className="border rounded w-full py-2 px-3" 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Hình ảnh</label>
                <input 
                  type="file" 
                  onChange={handleImageChange}
                  required={!isEditing}
                  className="border rounded w-full py-2 px-3" 
                  accept="image/*"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Ngày phát hành</label>
                <input 
                  type="date" 
                  value={newProduct.releaseDate} 
                  onChange={(e) => setNewProduct({ ...newProduct, releaseDate: e.target.value })}
                  required={!isEditing}
                  className="border rounded w-full py-2 px-3" 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Giá</label>
                <input 
                  type="number" 
                  value={newProduct.price} 
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  required 
                  className="border rounded w-full py-2 px-3" 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Video</label>
                <input 
                  type="file" 
                  onChange={handleVideoChange} 
                  required={!isEditing} 
                  className="border rounded w-full py-2 px-3" 
                  accept="video/*"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Cốt truyện</label>
                <textarea 
                  value={newProduct.story} 
                  onChange={(e) => setNewProduct({ ...newProduct, story: e.target.value })}
                  required 
                  className="border rounded w-full py-2 px-3" 
                  rows="4"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
                  {isEditing ? 'Cập nhật' : 'Thêm'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal hiển thị thông tin sản phẩm */}
      {selectedProduct && isDetail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">{selectedProduct.name}</h2>
            <img src={selectedProduct.image} alt={selectedProduct.name} className="h-[200px] mx-auto block mb-4" />
            <p><strong>Ngày phát hành:</strong> {new Date(selectedProduct.releaseDate).toLocaleDateString('en-GB')}</p>
            <p><strong>Giá:</strong>{formatVND(selectedProduct.price)}</p>
            <p><strong>Video:</strong>
            <video className="w-full mt-2" controls>
              <source src={selectedProduct.video} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ phát video.
            </video>
            </p>
            <p><strong>Cốt truyện:</strong> {selectedProduct.story}</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setSelectedProduct(null)} className="bg-gray-300 px-4 py-2 rounded">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden flex-grow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Release Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={product.image} alt={product.name} className="w-16 h-16 rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(product.releaseDate).toLocaleDateString('en-GB')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatVND(product.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => handleViewDetails(product)} className="text-green-600 hover:text-green-900 mr-2">
                    <FaEye />
                  </button>
                  <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900 mr-2">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Pagination 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          totalProducts={products.length} 
          productsPerPage={productsPerPage} 
        />
      </div>
    </div>
  )
}