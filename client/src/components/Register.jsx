'use client'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { registerUser } from '../services/auth-service'
import * as Alert from './Alert'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate();

  const mutationRegister = useMutation({
    mutationFn: async (data) => {
      return await registerUser(data);
    },
    onSuccess: (data) => {
      console.log("Data from onSuccess:", data); 
      if (data.success === true){
        // Điều hướng đến trang xác nhận với email và mã xác nhận
        navigate(`/confirm-email?email=${email}`);
      } else if(data.success === false){
        Alert.error(data.message);
      }
    },
    onError: (error) => {
      Alert.error(error.response.data.message);
      console.error('Registration failed:', error)
    }
  })
  

  const handleSubmit = (e) => {
    e.preventDefault()
    mutationRegister.mutate({ 
      name: name, 
      email: email, 
      username: username, 
      password: password, 
      confirmPassword: confirmPassword
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <Link to="/" className="text-2xl text-blue-600 font-bold absolute top-4 left-4 z-10">
        Home
      </Link>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Link to="" className=" text-white hover:underline">
            Register
          </Link>
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}