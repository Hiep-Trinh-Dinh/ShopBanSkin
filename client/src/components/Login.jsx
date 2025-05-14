'use client'

import { useState, useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useSearchParams } from 'next/navigation'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import { useMutation } from '@tanstack/react-query'
import { loginUser, fetchDetailUser } from '../services/auth-service'
import * as Alert from './Alert'
import { useDispatch } from 'react-redux'
import { updateUser } from '../redux/slides/user-slide'
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const searchParams = useSearchParams()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mutationLogin = useMutation({
    mutationFn: async (data) => {
      return await loginUser(data);
    },
    onSuccess: (data) => {
      Alert.success(data.message);
      localStorage.setItem("access_token", JSON.stringify(data?.token));
      // Lưu refresh token vào localStorage
      localStorage.setItem("refresh_token", data?.refreshToken);
      
      if (data?.token) {
        const decoded = jwtDecode(data?.token);
        if (decoded?.id) {
          handleGetDetailUser(decoded?.id, data?.token);
        }
      }
      if(data.role === 'admin'){
        navigate('/admin')
      } else {
        navigate('/');
      }
    },
    onError: (error) => {
      Alert.error(error.response.data.message);
      console.error('Login failed:', error)
    }
  })

  useEffect(() => {
    if (searchParams && searchParams.get('registered') === 'true') {
      setShowSuccessMessage(true)
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const handleGetDetailUser = async (id, token) => {
    const res = await fetchDetailUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    mutationLogin.mutate({ email: email, password: password})
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <Link to="/" className="text-2xl text-blue-600 font-bold absolute top-4 left-4 z-10">
        Home
      </Link>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {showSuccessMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            Registration successful! You can now log in.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
            <Link to="/register" className="text-blue-600 hover:underline">
              Register Account
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <div className="mt-6 space-y-2">
          <button className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            <FaGoogle className="text-red-600" />
            <span>Login with Google</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            <FaFacebook className="text-blue-600" />
            <span>Login with Facebook</span>
          </button>
        </div>
      </div>
    </div>
  )
}