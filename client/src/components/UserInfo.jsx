import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser, updateUser } from '../redux/slides/user-Slide';
import { logoutUser, uploadAvatar, changePassword } from '../services/auth-service';
import { getUserBalance, getUserTransactions } from '../services/transaction-service';
import { formatVND } from '../utils/formatVND';
import * as Alert from './Alert';

// Thay thế mock data bằng state
export default function UserInfoPage() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  
  // Form state cho đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Fetch data khi component mount
  useEffect(() => {
    if (user._id) {
      fetchUserBalance();
      fetchTransactions();
    }
  }, [user._id]);

  // Hàm lấy số dư tài khoản
  const fetchUserBalance = async () => {
    try {
      setIsLoadingBalance(true);
      const response = await getUserBalance(user.access_token);
      if (response.success) {
        setBalance(response.data.balance);
      }
    } catch (error) {
      console.error("Không thể lấy số dư:", error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Hàm lấy lịch sử giao dịch
  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      const response = await getUserTransactions(user.access_token);
      if (response.success) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error("Không thể lấy lịch sử giao dịch:", error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const openTransactionModal = (transaction) => {
    setSelectedTransaction(transaction);
  }

  const handleLogoutUser = async () => {
    try {
      await logoutUser(user.access_token);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      dispatch(resetUser());
      Alert.success("Logout successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.error("Logout failed. Please try again.");
    }
  };

  const handleAvatarChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      // Kiểm tra kích thước file (ví dụ: giới hạn 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Alert.error("File size should not exceed 5MB");
        return;
      }

      // Kiểm tra định dạng file
      if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
        Alert.error("Only JPG, PNG & GIF files are allowed");
        return;
      }

      setIsLoading(true);

      const formData = new FormData();
      formData.append('image', file);

      const response = await uploadAvatar(formData, user.access_token);
      
      if (response.success) {
        dispatch(updateUser({
          ...user,
          image: response.data.image
        }));
        Alert.success("Avatar updated successfully");
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
      Alert.error(error.response?.data?.message || "Failed to update avatar. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đổi mật khẩu
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await changePassword(
        user._id, 
        {
          password: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword
        },
        user.access_token
      );
      
      if (response.success) {
        Alert.success(response.message || "Password changed successfully");
        setShowChangePasswordModal(false);
        // Reset form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error("Change password failed:", error);
      Alert.error(error.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl">
          <Link to='/'>Home</Link>
        </h1>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 p-8 bg-gray-50 relative">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={user.image || '/avatar-placeholder.png'}
                    alt={`${user.name}'s avatar`}
                    className="rounded-full w-32 h-32 mx-auto mb-4 object-cover"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current.click()} 
                  className="absolute top-16 left-80 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors"
                  disabled={isLoading}
                >
                  <FaEdit />
                </button>
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/gif" 
                  className="hidden" 
                  onChange={handleAvatarChange} 
                  ref={fileInputRef}
                />
                <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                <p className="text-gray-600 mb-4">@{user.username}</p>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            
            {/* Phần còn lại của component giữ nguyên */}
            <div className="md:w-2/3 p-8">
              <h3 className="text-xl font-semibold mb-4">User Information</h3>
              <div className="mb-6">
                <p className="text-gray-600 mb-2">Current Balance</p>
                <p className="text-2xl font-bold">
                  {isLoadingBalance ? (
                    <span className="text-gray-500">Đang tải...</span>
                  ) : (
                    formatVND(balance)
                  )}
                </p>
              </div>
              <div className="space-y-2 mb-6">
                <button
                  onClick={() => navigate('/deposit')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Deposit
                </button>
                <button
                  onClick={() => setShowChangePasswordModal(true)}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Change Password
                </button>
              </div>
              <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
              <div className="overflow-x-auto">
                {isLoadingTransactions ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Đang tải lịch sử giao dịch...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    Chưa có giao dịch nào
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2">Ngày</th>
                        <th className="py-2">Loại</th>
                        <th className="py-2">Số tiền</th>
                        <th className="py-2">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction._id} className="border-b cursor-pointer hover:bg-gray-50" onClick={() => openTransactionModal(transaction)}>
                          <td className="py-2">{new Date(transaction.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td className="py-2">
                            {transaction.type === 'deposit' ? 'Nạp tiền' : 'Mua hàng'}
                          </td>
                          <td className={`py-2 ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'deposit' ? '+' : '-'}{formatVND(transaction.amount)}
                          </td>
                          <td className="py-2">
                            <span 
                              className={`px-2 py-1 rounded-full text-xs ${
                                transaction.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : transaction.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {transaction.status === 'completed' 
                                ? 'Hoàn thành' 
                                : transaction.status === 'pending'
                                  ? 'Đang xử lý'
                                  : 'Đã hủy'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="flex justify-center p-4">
        <button
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={handleLogoutUser}
        >
          Log Out
        </button>
      </div>

      {/* Modal đổi mật khẩu */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}