import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

// Create new product with image and video
export const createProduct = async (formData) => {
    try {
        const response = await axios.post(
            `${API_KEY}/product/create`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to create product", error);
        throw error;
    }
};

// Fetch all products with pagination and sorting
export const fetchAllProducts = async (page = 1, limit = 6, sortBy = 'createdAt', sortOrder = 'desc', searchTerm = '') => {
    try {
      const response = await axios.get(
        `${API_KEY}/product/fetch-all`,
        {
          params: {
            page,
            limit,
            sortBy,
            sortOrder,
            searchTerm
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch products", error);
      throw error;
    }
  };

// Fetch single product detail
export const fetchDetailProduct = async (id) => {
    try {
        const response = await axios.get(`${API_KEY}/product/fetch-detail/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch product detail", error);
        throw error;
    }
};

// Edit product
export const editProduct = async (id, formData) => {
    try {
        const response = await axios.put(
            `${API_KEY}/product/edit/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to edit product", error);
        throw error;
    }
};

// Delete product
export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${API_KEY}/product/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete product", error);
        throw error;
    }
};