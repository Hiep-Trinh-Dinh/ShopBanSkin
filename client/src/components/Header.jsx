import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Đặt là true để mô phỏng

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if(user._id){
      setIsLoggedIn(true);
    }
  },[user]) 

  const pathname = window.location.pathname;
  return (
    <header className="bg-white bg-opacity-0 fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-blue-700 hover:text-2xl transition-all duration-300">Home</Link></li>
            <li><Link to="/products" className="hover:text-blue-700 hover:text-2xl transition-all duration-300">Products</Link></li>
            <li><Link to="/community" className="hover:text-blue-700 hover:text-2xl transition-all duration-300">Community</Link></li>
            <li><Link to="/information" className="hover:text-blue-700 hover:text-2xl transition-all duration-300">Information</Link></li>
          </ul>
        </nav>
        <div>
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 transition-transform duration-200 ease-in-out transform hover:scale-110">
                <img
                  src={user.image}
                  alt={`${user.name}'s avatar`}
                  className="rounded-full w-full h-full object-cover"
                  onClick={() => window.location.href = '/user-info'} // Điều hướng đến trang thông tin người dùng khi bấm vào avatar
                />
              </div>
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="text-blue-600 hover:text-blue-800">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}