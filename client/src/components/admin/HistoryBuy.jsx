'use client'

import { useState, useEffect } from 'react'
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import Pagination from '../Pagination'
import { useSelector } from 'react-redux'
import { formatVND } from '../../utils/formatVND'
import { getAllTransactions, updateTransactionStatus } from '../../services/transaction-service'
import * as Alert from '../Alert'

export default function HistoryBuy() {
  const [transactions, setTransactions] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    customerName: '',
    productName: '',
    purchaseDate: '',
    price: '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all') // 'all', 'deposit', 'purchase'
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'pending', 'completed', 'rejected'

  const transactionsPerPage = 10
  const user = useSelector((state) => state.user)

  useEffect(() => {
    if (user.access_token) {
      fetchTransactions()
    }
  }, [user])

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const response = await getAllTransactions(user.access_token)
      if (response.success) {
        setTransactions(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
      Alert.error("Không thể tải danh sách giao dịch")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (transactionId, newStatus) => {
    try {
      setIsLoading(true)
      const response = await updateTransactionStatus(transactionId, newStatus, user.access_token)
      if (response.success) {
        Alert.success("Cập nhật trạng thái thành công")
        setShowModal(false)
        await fetchTransactions()
      } else {
        Alert.error(response.message || "Cập nhật trạng thái thất bại")
      }
    } catch (error) {
      console.error("Failed to update transaction status:", error)
      Alert.error("Không thể cập nhật trạng thái giao dịch")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction)
    setNewTransaction(transaction)
    setIsEditModalOpen(true)
  }

  const handleDelete = (transactionId) => {
    setTransactions(transactions.filter(t => t._id !== transactionId))
  }

  const handleView = (transaction) => {
    setSelectedTransaction(transaction)
    setShowModal(true)
  }

  const handleUpdateTransaction = (e) => {
    e.preventDefault()
    setTransactions(transactions.map(t => t._id === selectedTransaction._id ? { ...newTransaction, price: parseFloat(newTransaction.price) } : t))
    setIsEditModalOpen(false)
    setNewTransaction({ customerName: '', productName: '', purchaseDate: '', price: '' })
  }

  // Lọc giao dịch theo loại và trạng thái
  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = filter === 'all' || transaction.type === filter
    const statusMatch = statusFilter === 'all' || transaction.status === statusFilter
    return typeMatch && statusMatch
  })

  // Phân trang
  const indexOfLastTransaction = currentPage * transactionsPerPage
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction)

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý giao dịch</h1>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Loại giao dịch
          </label>
          <select
            id="typeFilter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">Tất cả</option>
            <option value="deposit">Nạp tiền</option>
            <option value="purchase">Mua hàng</option>
          </select>
        </div>

        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="rejected">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Bảng giao dịch */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        Không có giao dịch nào
                      </td>
                    </tr>
                  ) : (
                    currentTransactions.map((transaction) => (
                      <tr key={transaction._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction._id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.userId?.name || transaction.userId?.username || transaction.userId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.type === 'deposit' ? 'Nạp tiền' : 'Mua hàng'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatVND(transaction.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : transaction.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status === 'completed' 
                              ? 'Hoàn thành' 
                              : transaction.status === 'pending'
                                ? 'Đang xử lý'
                                : 'Đã hủy'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            onClick={() => handleView(transaction)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{indexOfFirstTransaction + 1}</span> đến <span className="font-medium">{Math.min(indexOfLastTransaction, filteredTransactions.length)}</span> của <span className="font-medium">{filteredTransactions.length}</span> giao dịch
                </p>
              </div>
              <div>
                <nav className="flex items-center">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Tiếp
                  </button>
                </nav>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal chi tiết giao dịch */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">Chi tiết giao dịch</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">ID Giao dịch:</p>
                <p className="font-medium">{selectedTransaction._id}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Người dùng:</p>
                <p className="font-medium">{selectedTransaction.userId?.name || selectedTransaction.userId?.username || selectedTransaction.userId}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Ngày tạo:</p>
                <p className="font-medium">{new Date(selectedTransaction.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Loại giao dịch:</p>
                <p className="font-medium">{selectedTransaction.type === 'deposit' ? 'Nạp tiền' : 'Mua hàng'}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Số tiền:</p>
                <p className="font-medium">{formatVND(selectedTransaction.amount)}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Trạng thái:</p>
                <p className={`font-medium ${
                  selectedTransaction.status === 'completed' 
                    ? 'text-green-600' 
                    : selectedTransaction.status === 'pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}>
                  {selectedTransaction.status === 'completed' 
                    ? 'Hoàn thành' 
                    : selectedTransaction.status === 'pending'
                      ? 'Đang xử lý'
                      : 'Đã hủy'}
                </p>
              </div>
              {selectedTransaction.description && (
                <div className="col-span-2">
                  <p className="text-gray-600 mb-1">Mô tả:</p>
                  <p className="font-medium">{selectedTransaction.description}</p>
                </div>
              )}
              {selectedTransaction.productId && (
                <div className="col-span-2">
                  <p className="text-gray-600 mb-1">Sản phẩm:</p>
                  <div className="flex items-center mt-1">
                    {selectedTransaction.productId.image ? (
                      <img 
                        src={selectedTransaction.productId.image} 
                        alt={selectedTransaction.productId.name} 
                        className="w-12 h-12 object-cover rounded-md mr-3"
                      />
                    ) : null}
                    <div>
                      <p className="font-medium">{selectedTransaction.productId.name || "Sản phẩm không xác định"}</p>
                      {selectedTransaction.productId.price ? (
                        <p className="text-gray-600 text-xs">Giá: {formatVND(selectedTransaction.productId.price)}</p>
                      ) : null}
                      <p className="text-gray-500 text-xs">ID: {typeof selectedTransaction.productId === 'object' ? selectedTransaction.productId._id : selectedTransaction.productId}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedTransaction.imageProof && (
              <div className="mb-4">
                <p className="text-gray-600 mb-1 text-sm">Ảnh chứng minh:</p>
                <img 
                  src={selectedTransaction.imageProof}
                  alt="Payment proof"
                  className="max-w-full h-auto max-h-48 mx-auto rounded-md"
                />
              </div>
            )}

            {/* Cập nhật trạng thái */}
            <div className="mt-4 border-t pt-3">
              <h3 className="text-base font-semibold mb-2">Cập nhật trạng thái</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedTransaction._id, 'completed')}
                  disabled={selectedTransaction.status === 'completed' || isLoading}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedTransaction.status === 'completed' || isLoading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  Hoàn thành
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedTransaction._id, 'rejected')}
                  disabled={selectedTransaction.status === 'rejected' || isLoading}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedTransaction.status === 'rejected' || isLoading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  Từ chối
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedTransaction._id, 'pending')}
                  disabled={selectedTransaction.status === 'pending' || isLoading}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedTransaction.status === 'pending' || isLoading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  }`}
                >
                  Đang xử lý
                </button>
          </div>
        </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}