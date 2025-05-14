'use client'

import { useEffect, useState } from 'react'
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import Pagination from '../Pagination'
import { fetchAllUser } from '../../services/auth-service'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const customersPerPage = 6
  const [newCustomer, setNewCustomer] = useState(
    { name: '', 
      username: '', 
      email: '', 
      createdAt: '', 
      totalOrders: '', 
      image: '' 
    })
  
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)

  const handleEdit = (customer) => {
    setNewCustomer(customer)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleDelete = (customerId) => {
    setCustomers(customers.filter(c => c.id !== customerId))
  }

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      setCustomers(customers.map(c => c.id === newCustomer.id ? newCustomer : c))
    } else {
      const newCustomerWithId = { ...newCustomer, id: customers.length + 1 }
      setCustomers([...customers, newCustomerWithId])
    }
    setNewCustomer({ name: '', username: '', email: '', createdAt: '', totalOrders: '', image: '' })
    setIsEditing(false)
    setIsModalOpen(false)
  }

  const indexOfLastCustomer = currentPage * customersPerPage
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer)

  useEffect(() => {
    fetchUsers();
  }, [currentPage, refresh])

  const fetchUsers = async () => {
    try {
      const response = await fetchAllUser(currentPage, customersPerPage)
      setCustomers(response.data)
      setTotalPages(response.totalPages)
      setTotalUsers(response.totalUsers)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden flex-grow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCustomers.map((customer) => (
              <tr key={customer._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={customer.image} alt={customer.name} className="w-16 h-16 rounded-full" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(customer.createdAt).toLocaleDateString("en-GB")}</td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.totalOrders}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => handleViewDetails(customer)} className="text-green-600 hover:text-green-900 mr-2">
                    <FaEye />
                  </button>
                  <button onClick={() => handleEdit(customer)} className="text-blue-600 hover:text-blue-900 mr-2">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(customer.id)} className="text-red-600 hover:text-red-900">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={newCustomer.username}
                  onChange={(e) => setNewCustomer({ ...newCustomer, username: e.target.value })}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày đăng ký</label>
                <input
                  type="date"
                  value={newCustomer.registeredDate}
                  onChange={(e) => setNewCustomer({ ...newCustomer, registeredDate: e.target.value })}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tổng số đơn hàng</label>
                <input
                  type="number"
                  value={newCustomer.totalOrders}
                  onChange={(e) => setNewCustomer({ ...newCustomer, totalOrders: e.target.value })}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end mt-4">
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

      {selectedCustomer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">{selectedCustomer.name}</h2>
            <img src={selectedCustomer.image} alt={selectedCustomer.name} className="w-full mb-4" />
            <p><strong>Username:</strong> {selectedCustomer.username}</p>
            <p><strong>Email:</strong> {selectedCustomer.email}</p>
            <p><strong>Ngày đăng ký:</strong> {new Date(selectedCustomer.createdAt).toLocaleDateString("en-GB")}</p>
            <p><strong>Tổng số đơn hàng:</strong> {selectedCustomer.totalOrders}</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setSelectedCustomer(null)} className="bg-gray-300 px-4 py-2 rounded">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <Pagination 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          totalCustomers={customers.length} 
          customersPerPage={customersPerPage} 
        />
      </div>
    </div>
  )
}