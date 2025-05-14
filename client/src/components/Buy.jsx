import { useEffect, useState, useRef } from 'react';
import Header from './Header';
import { formatVND } from '../utils/formatVND';
import { Link, useNavigate } from 'react-router-dom';
import * as Alert from './Alert';
import { useSelector } from 'react-redux';
import { createTransaction } from '../services/transaction-service';
import { getUserBalance } from '../services/transaction-service';

export default function Buy() {
  const [product, setProduct] = useState(null);
  const [paymentImage, setPaymentImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('qr'); // 'qr' hoặc 'balance'
  const [userBalance, setUserBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isLoggedIn = !!user?._id;

  useEffect(() => {
    // Lấy thông tin sản phẩm từ localStorage
    const buyingProduct = localStorage.getItem('buyingProduct');
    if (buyingProduct) {
      setProduct(JSON.parse(buyingProduct));
    }

    // Nếu đã đăng nhập, lấy số dư tài khoản
    if (isLoggedIn) {
      fetchUserBalance();
    }
  }, [isLoggedIn]);

  const fetchUserBalance = async () => {
    try {
      setIsLoadingBalance(true);
      const response = await getUserBalance(user.access_token);
      if (response.success) {
        setUserBalance(response.data.balance);
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

  const handleConfirmPurchase = async () => {
    if (!isLoggedIn) {
      Alert.error("Vui lòng đăng nhập để tiếp tục thanh toán");
      return;
    }

    if (paymentMethod === 'qr' && !paymentImage) {
      Alert.error("Vui lòng tải lên ảnh chụp màn hình thanh toán");
      return;
    }

    if (paymentMethod === 'balance' && userBalance < product.price) {
      Alert.error("Số dư tài khoản không đủ để thanh toán");
      return;
    }

    setIsSubmitting(true);

    try {
      // Chuẩn bị dữ liệu giao dịch
      const formData = new FormData();
      formData.append('amount', product.price);
      formData.append('type', 'purchase');
      formData.append('description', `Mua sản phẩm: ${product.name}`);
      formData.append('productId', product._id);
      formData.append('paymentMethod', paymentMethod);
      
      // Nếu thanh toán bằng QR, thêm ảnh chứng minh
      if (paymentMethod === 'qr' && paymentImage) {
        formData.append('image', paymentImage.file);
      }

      const response = await createTransaction(formData, user.access_token);

      if (response.success) {
        if (paymentMethod === 'balance') {
          Alert.success("Thanh toán thành công! Trang phục sẽ được gửi trong vòng 12h");
        } else {
          Alert.success("Đã gửi yêu cầu thanh toán! Trang phục sẽ được gửi sau khi admin xác nhận giao dịch");
        }
        
        localStorage.removeItem('buyingProduct'); // Xóa sản phẩm đang mua
        setTimeout(() => {
          navigate('/'); // Chuyển hướng về trang chủ
        }, 2000);
      } else {
        Alert.error(response.message || "Thanh toán thất bại! Vui lòng thử lại sau.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      Alert.error("Có lỗi xảy ra! Vui lòng thử lại sau.");
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy thông tin sản phẩm</h2>
          <p className="mb-4">Vui lòng quay lại trang sản phẩm để chọn mua.</p>
          <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Xem Sản Phẩm
          </Link>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Bạn cần đăng nhập để mua hàng</h2>
          <p className="mb-4">Vui lòng đăng nhập để tiếp tục quá trình mua hàng.</p>
          <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Đăng Nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-bold mb-6">Xác nhận mua hàng</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Thông tin sản phẩm</h3>
                <div className="flex items-center mb-4">
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-blue-600 font-bold">{formatVND(product.price)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Phương thức thanh toán</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={paymentMethod === 'qr'}
                      onChange={() => setPaymentMethod('qr')}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span>Chuyển khoản (Quét mã QR)</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={paymentMethod === 'balance'}
                      onChange={() => setPaymentMethod('balance')}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span>Thanh toán bằng số dư tài khoản</span>
                  </label>
                  
                  {paymentMethod === 'balance' && (
                    <div className="ml-7 mt-2 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600 mb-1">Số dư hiện tại:</p>
                      <p className="font-semibold">
                        {isLoadingBalance ? 'Đang tải...' : formatVND(userBalance)}
                      </p>
                      {userBalance < product.price && (
                        <p className="text-red-500 text-sm mt-1">
                          Không đủ số dư! Bạn cần thêm {formatVND(product.price - userBalance)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {paymentMethod === 'qr' ? (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Tải lên ảnh thanh toán</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Sau khi quét mã QR và chuyển khoản thành công, vui lòng chụp màn hình và tải lên.
                  </p>
                  
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-4"
                  >
                    Tải lên ảnh
                  </button>
                  
                  {paymentImage && (
                    <div className="mt-4">
                      <p className="text-green-600 mb-2">Đã tải lên ảnh thanh toán</p>
                      <img
                        src={paymentImage.preview}
                        alt="Payment confirmation"
                        className="w-full h-auto max-h-48 object-contain rounded-md"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Thanh toán bằng số dư</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Số tiền {formatVND(product.price)} sẽ được trừ trực tiếp từ số dư tài khoản của bạn.
                  </p>
                </div>
              )}
              
              <button
                onClick={handleConfirmPurchase}
                disabled={isSubmitting || (paymentMethod === 'qr' && !paymentImage) || (paymentMethod === 'balance' && userBalance < product.price)}
                className={`w-full py-3 rounded-md font-semibold ${
                  isSubmitting || (paymentMethod === 'qr' && !paymentImage) || (paymentMethod === 'balance' && userBalance < product.price)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isSubmitting
                  ? 'Đang xử lý...'
                  : paymentMethod === 'balance'
                    ? 'Xác nhận thanh toán'
                    : 'Xác nhận gửi thanh toán'}
              </button>
            </div>
            
            <div className="md:w-1/2 bg-gray-50 p-8">
              <h3 className="text-xl font-semibold mb-4">Thông tin thanh toán</h3>
              
              {paymentMethod === 'qr' && (
                <>
                  <p className="text-gray-600 mb-4">
                    Quét mã QR bên dưới để chuyển khoản số tiền <span className="font-semibold">{formatVND(product.price)}</span>
                  </p>
                  
                  <div className="flex justify-center mb-6">
              <img
                src="../../public\image\43bad6f207a0b2feebb1.jpg"
                alt="QR Code"
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                  
                  <div className="bg-white p-4 rounded-md mb-6">
                    <h4 className="font-semibold mb-2">Thông tin chuyển khoản:</h4>
                    <p className="mb-1"><span className="font-medium">Ngân hàng:</span> VIETCOMBANK</p>
                    <p className="mb-1"><span className="font-medium">Số tài khoản:</span> 1234567890</p>
                    <p className="mb-1"><span className="font-medium">Chủ tài khoản:</span> NGUYEN VAN A</p>
                    <p className="mb-1"><span className="font-medium">Nội dung CK:</span> {user.username} mua {product.name}</p>
            </div>
                </>
              )}
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h4 className="text-blue-800 font-semibold mb-2">Lưu ý quan trọng:</h4>
                <ul className="text-blue-700 text-sm space-y-1 list-disc pl-5">
                  {paymentMethod === 'qr' ? (
                    <>
                      <li>Vui lòng chuyển đúng số tiền và nội dung chuyển khoản</li>
                      <li>Sau khi chuyển khoản, hãy chụp màn hình xác nhận và tải lên</li>
                      <li>Đơn hàng sẽ được xác nhận sau khi admin kiểm tra giao dịch</li>
                      <li>Sản phẩm sẽ được gửi trong vòng 12 giờ sau khi xác nhận</li>
                    </>
                  ) : (
                    <>
                      <li>Số tiền sẽ được trừ trực tiếp từ số dư tài khoản</li>
                      <li>Giao dịch sẽ được xác nhận ngay lập tức</li>
                      <li>Sản phẩm sẽ được gửi trong vòng 12 giờ sau khi xác nhận</li>
                      <li>Nếu cần hỗ trợ, vui lòng liên hệ admin qua mục liên hệ</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}