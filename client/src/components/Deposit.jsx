import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import { formatVND } from '../utils/formatVND';
import * as Alert from './Alert';
import { useSelector } from 'react-redux';
import { createTransaction, getUserBalance } from '../services/transaction-service';

export default function Deposit() {
  const [amount, setAmount] = useState('');
  const [paymentImage, setPaymentImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isLoggedIn = !!user?._id;

  // Lấy số dư hiện tại của user
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserBalance();
    }
  }, [isLoggedIn]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra kích thước file (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Alert.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Kiểm tra định dạng file
    if (!file.type.match(/^image\/(jpeg|png|jpg|gif)$/)) {
      Alert.error("Chỉ chấp nhận file ảnh (JPG, PNG, GIF)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPaymentImage({
        file,
        preview: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmDeposit = async () => {
    if (!isLoggedIn) {
      Alert.error("Vui lòng đăng nhập để tiếp tục nạp tiền");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    if (!paymentImage) {
      Alert.error("Vui lòng tải lên ảnh chứng minh thanh toán");
      return;
    }

    setIsSubmitting(true);

    try {
      // Tạo form data để gửi ảnh
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('type', 'deposit');
      formData.append('description', 'Nạp tiền vào tài khoản');
      formData.append('image', paymentImage.file);

      const response = await createTransaction(formData, user.access_token);

      if (response.success) {
        Alert.success("Đã gửi yêu cầu nạp tiền thành công! Tài khoản của bạn sẽ được cập nhật trong vòng 12h");
        setTimeout(() => {
          navigate('/user-info');
        }, 2000);
      } else {
        Alert.error(response.message || "Nạp tiền thất bại, vui lòng thử lại sau!");
      }
    } catch (error) {
      console.error("Lỗi nạp tiền:", error);
      Alert.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Bạn cần đăng nhập</h1>
          <p className="mb-6">Vui lòng đăng nhập để sử dụng tính năng nạp tiền.</p>
          <Link to="/login" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 mt-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Nạp tiền vào tài khoản</h1>

          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
              <img
                src="../../public\image\43bad6f207a0b2feebb1.jpg"
                alt="QR Code"
                width={300}
                height={300}
                className="mx-auto"
              />
              <p className="text-center mt-4 text-gray-600">
                Quét mã QR để nạp tiền vào tài khoản. Lưu ý chụp lại màn hình giao dịch để xác nhận khi có lỗi xảy ra. 
                Tài khoản của bạn sẽ được cập nhật trong vòng 12h kể từ khi bạn chuyển khoản.
              </p>
              
              {/* Phần nhập số tiền */}
              <div className="mt-6 text-center">
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
                    Số tiền muốn nạp
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Nhập số tiền"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    min="10000"
                  />
                  {amount && !isNaN(amount) && Number(amount) > 0 && (
                    <p className="text-gray-600 mt-1">Số tiền: {formatVND(amount)}</p>
                  )}
                </div>
              
                {/* Phần tải ảnh thanh toán */}
                <div className="mb-4">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mr-2"
                  >
                    Tải lên ảnh thanh toán
                  </button>
                </div>
                
                {paymentImage && (
                  <div className="mb-4">
                    <p className="text-green-600 mb-2">Đã tải lên ảnh thanh toán</p>
                    <img
                      src={paymentImage.preview}
                      alt="Payment confirmation"
                      className="w-48 h-auto mx-auto rounded-md object-cover"
                    />
                  </div>
                )}
                
                <button
                  onClick={handleConfirmDeposit}
                  disabled={isSubmitting || !amount || isNaN(amount) || Number(amount) <= 0}
                  className={`mt-4 py-2 px-6 rounded-md ${
                    isSubmitting || !amount || isNaN(amount) || Number(amount) <= 0
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white font-semibold`}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Xác nhận nạp tiền'}
                </button>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Thông tin tài khoản</h2>
                <div className="mb-4">
                  <p className="mb-2"><strong>Tên người dùng:</strong> {user.name}</p>
                  <p className="mb-2"><strong>Tên đăng nhập:</strong> {user.username}</p>
                  {/* Hiển thị số dư hiện tại thực tế */}
                  <p className="mb-2">
                    <strong>Số dư hiện tại:</strong>{' '}
                    {isLoadingBalance ? (
                      <span className="text-gray-500">Đang tải...</span>
                    ) : (
                      formatVND(balance)
                    )}
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Hướng dẫn nạp tiền</h3>
                  <ol className="list-decimal list-inside text-blue-800 space-y-1">
                    <li>Nhập số tiền bạn muốn nạp</li>
                    <li>Quét mã QR và chuyển khoản theo số tiền đã nhập</li>
                    <li>Chụp màn hình giao dịch và tải lên</li>
                    <li>Nhấn xác nhận để hoàn tất quá trình nạp tiền</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 