import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendCodeAgain, verifyCode } from '../services/verification-service';
import * as Alert from './Alert';
import { Link } from 'react-router-dom';

export default function ConfirmEmail() {
    const [code, setCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const navigate = useNavigate();
    const location = useLocation(); 
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
  
    const mutationSendCodeAgain = useMutation({
      mutationFn: async () => {
        return await sendCodeAgain(email)
      },
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.error('Error sending confirmation code:', error);
      },
    })

    const mutationVerifyCode = useMutation({
      mutationFn: async (code) => {
        return await verifyCode(code)
      },
      onSuccess: (data) => {
        Alert.success(data.message);
        navigate('/login');
      },
      onError: (error) => {
        Alert.error(error.response.data.message);
        console.error('Error verifying code:', error);
      },
    })

    useEffect(() => {
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      mutationVerifyCode.mutate({code: code});
    };

    const handleResendCode = () => {
      setTimeLeft(60);
      mutationSendCodeAgain.mutate();
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <Link to="/" className="text-2xl text-blue-600 font-bold absolute top-4 left-4 z-10">
        Home
      </Link>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Verification</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Mã Xác Nhận"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={timeLeft === 0}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Time: {timeLeft} s</span>
            <button
              type="button"
              onClick={handleResendCode}
              className={`ml-4 text-blue-600 hover:underline cursor-pointer`}
              disabled={timeLeft > 0}
            >
              Send code again
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md"
            disabled={timeLeft === 0}
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
}