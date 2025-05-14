import axios from "axios";
import { axiosJWT } from "./auth-service";

const API_KEY = import.meta.env.VITE_API_KEY;

// Tạo một giao dịch mới (nạp tiền hoặc mua hàng)
export const createTransaction = async (formData, access_token) => {
  try {
    const response = await axiosJWT.post(
      `${API_KEY}/transaction/create`,
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
    console.error("Failed to create transaction", error);
    throw error;
  }
};

// Lấy lịch sử giao dịch của người dùng
export const getUserTransactions = async (access_token) => {
  try {
    const response = await axiosJWT.get(
      `${API_KEY}/transaction/history`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get transaction history", error);
    throw error;
  }
};

// Lấy số dư tài khoản
export const getUserBalance = async (access_token) => {
  try {
    const response = await axiosJWT.get(
      `${API_KEY}/transaction/balance`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get user balance", error);
    throw error;
  }
};

// Cập nhật trạng thái giao dịch (chỉ dành cho admin)
export const updateTransactionStatus = async (transactionId, status, access_token) => {
  try {
    const response = await axiosJWT.put(
      `${API_KEY}/transaction/status/${transactionId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update transaction status", error);
    throw error;
  }
};

// Lấy tất cả giao dịch (chỉ dành cho admin)
export const getAllTransactions = async (access_token) => {
  try {
    const response = await axiosJWT.get(
      `${API_KEY}/transaction/all`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get all transactions", error);
    throw error;
  }
}; 