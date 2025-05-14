import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

export const sendCodeAgain = async (email) => {
    try {
      const response = await axios.get(
        `${API_KEY}/verification/send-again?email=${email}`, 
      );
      return response.data;
    } catch (error) {
      console.error("Failed to send code again", error);
      throw error;
    }
};

export const verifyCode = async (code) => {
  try {
    const response = await axios.post(`${API_KEY}/verification/verify-code`, code);
    return response.data;
  } catch (error) {
    console.error("Failed to verify code", error);
    throw error;
  }
};

export const sendCode = async (email) => {
  try {
    const response = await axios.post(
      `${API_KEY}/verification/send-code`, email 
    );
    return response.data;
  } catch (error) {
    console.error("Failed to send code again", error);
    throw error;
  }
};