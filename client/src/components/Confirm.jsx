import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '../services/auth-service';
import * as Alert from './Alert';

export default function NewPasswordPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const navigate = useNavigate();

  const mutationForgotPassword = useMutation({
    mutationFn: async (data) => {
      return await forgotPassword(email, data)
    },
    onSuccess: (data) => {
      Alert.success(data.message);
      navigate('/login');
    },
    onError: (error) => {
      Alert.error(error.response.data.message);
      console.error('Error forgot password:', error);
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    mutationForgotPassword.mutate({newPassword: newPassword, confirmPassword: confirmNewPassword})
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <Link to="/" className="text-2xl text-blue-600 font-bold absolute top-4 left-4 z-10">
        Home
      </Link>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">New password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}