import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { logoutUser } from '../../services/auth-service';
import { useDispatch } from 'react-redux';
import { resetUser } from '../../redux/slides/user-slide';
import * as Alert from '../Alert';

export default function AdminLayout() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogoutUser = async () => {
    try {
      const access_token = JSON.parse(localStorage.getItem("access_token"));
      await logoutUser(access_token);
      localStorage.removeItem("access_token");
      dispatch(resetUser());
      Alert.success("Logout successfully");
      navigate("/");
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
      Alert.error("Đăng xuất thất bại");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link to="/admin/customers" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
                <span className="material-icons text-xl"></span>
                <span>Customers</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/productadmin" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
                <span className="material-icons text-xl"></span>
                <span>Products</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/post" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
                <span className="material-icons text-xl"></span>
                <span>Posts</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/history" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
                <span className="material-icons text-xl"></span>
                <span>History</span>
              </Link>
            </li>
          </ul>
        </nav>
        {/* Đăng xuất */}
      <div className="flex justify-center p-4">
        <button
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={handleLogoutUser}
        >
          Log Out
        </button>
      </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
        
      </main>
      
    </div>
  );
}