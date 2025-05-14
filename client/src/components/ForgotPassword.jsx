import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendCode, verifyCode } from '../services/verification-service';
import * as Alert from './Alert';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);  // Không khởi tạo giá trị mặc định cho timeLeft
  const navigate = useNavigate();

  const mutationSendCode = useMutation({
    mutationFn: async (data) => {
      return await sendCode(data);
    },
    onSuccess: (data) => {
      setTimeLeft(60);  // Bắt đầu đếm ngược khi mã đã được gửi thành công
    },
    onError: (error) => {
      console.error('Error:', error);
      Alert.error(error.response.data.message);
    }
  });

  const mutationVerifyCode = useMutation({
    mutationFn: async (data) => {
      return await verifyCode(data);
    },
    onSuccess: (data) => {
      Alert.success(data.message);
      navigate(`/confirm?email=${email}`);
    },
    onError: (error) => {
      console.error('Error:', error);
      Alert.error(error.response.data.message);
    }
  });

  const handleSendCode = () => {
    mutationSendCode.mutate({ email: email });
  };

  useEffect(() => {
    if (timeLeft === 0) return; // Nếu thời gian hết, không thực hiện gì

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer); // Cleanup timer khi component unmount hoặc timeLeft thay đổi
  }, [timeLeft]); // Chạy effect khi timeLeft thay đổi

  const handleSubmit = (e) => {
    e.preventDefault();
    mutationVerifyCode.mutate({ code: confirmationCode });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <Link to="/" className="text-2xl text-blue-600 font-bold absolute top-4 left-4 z-10">
        Home
      </Link>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleSendCode}
              className="w-full bg-blue-600 text-white py-2 rounded-md"
            >
              Send Code
            </button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Mã Xác Nhận"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={timeLeft === 0}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Time: {timeLeft} s</span>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md"
            disabled={timeLeft === 0}
          >
            Confirm
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back To Login
          </Link>
        </div>
      </div>
    </div>
  );
}
