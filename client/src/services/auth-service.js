import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const axiosJWT = axios.create();

const API_KEY = import.meta.env.VITE_API_KEY;

export const loginUser = async (data) => {
    try {
      const response = await axios.post(
        `${API_KEY}/auth/login`, 
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to login user", error);
      throw error;
    }
}

export const registerUser = async (data) => {
    try {
      const response = await axios.post(
        `${API_KEY}/auth/register`, data
      );
      return response.data;
    } catch (error) {
      console.error("Failed to register user", error);
      throw error;
    }
};

export const forgotPassword = async (email, data) => {
  try {
    const response = await axios.post(
      `${API_KEY}/auth/forgot-password?email=${email}`, data
    );
    return response.data;
  } catch (error) {
    console.error("Failed to forgot password user", error);
    throw error;
  }
};

export const fetchAllUser = async () => {
  try {
      const response = await axios.get(`${API_KEY}/auth/fetch-all`);
      return response.data;
  } catch (error) {
      console.error("Failed to fetch all users", error);
      throw error;
  }
};

export const fetchDetailUser = async (id, access_token) => {
  try {
    const response = await axiosJWT.get(`${API_KEY}/auth/fetch-detail/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch detail user", error);
    throw error;
  }
};


export const logoutUser = async (access_token) => {
  try {
      const response = await axios.post(
          `${API_KEY}/auth/log-out`, 
          {}, 
          {
              headers: {
                  Authorization: `Bearer ${access_token}`,
              },
              withCredentials: true
          }
      );
      return response.data;
  } catch (error) {
      console.error("Failed to log out user", error);
      throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${API_KEY}/auth/refresh-token`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to refresh token", error); 
    throw error;
  }
};

axiosJWT.interceptors.request.use(
  async (config) => {
    const accessToken = JSON.parse(localStorage.getItem("access_token"));
    
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken); // Sử dụng jwtDecode thay vì jwt_decode
      const currentTime = new Date().getTime() / 1000;

      if (decodedToken.exp < currentTime) {
        try {
          const response = await refreshToken();
          const newAccessToken = response.accessToken;
          
          localStorage.setItem("access_token", JSON.stringify(newAccessToken));
          config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        } catch (error) {
          window.location.href = "/login";
        }
      } else {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const uploadAvatar = async (formData, access_token) => {
  try {
    const response = await axiosJWT.put(
      `${API_KEY}/auth/upload-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to upload avatar", error);
    throw error;
  }
};

export const changePassword = async (id, data, access_token) => {
  try {
    const response = await axiosJWT.post(
      `${API_KEY}/auth/change-password/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to change password", error);
    throw error;
  }
};