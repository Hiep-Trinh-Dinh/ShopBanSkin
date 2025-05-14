import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

// Create new post with image
export const createPost = async (formData) => {
    try {
        const response = await axios.post(
            `${API_KEY}/post/create`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to create post", error);
        throw error;
    }
};

// Fetch all posts with pagination and sorting
export const fetchAllPosts = async (page = 1, limit = 6, sortBy = 'createdAt', sortOrder = 'desc') => {
    try {
        const response = await axios.get(
            `${API_KEY}/post/fetch-all`,
            {
                params: {
                    page,
                    limit,
                    sortBy,
                    sortOrder
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch posts", error);
        throw error;
    }
};

// Fetch single post detail
export const fetchDetailPost = async (id) => {
    try {
        const response = await axios.get(`${API_KEY}/post/fetch-detail/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch post detail", error);
        throw error;
    }
};

// Edit post
export const editPost = async (id, formData) => {
    try {
        const response = await axios.put(
            `${API_KEY}/post/edit/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to edit post", error);
        throw error;
    }
};

// Delete post
export const deletePost = async (id) => {
    try {
        const response = await axios.delete(`${API_KEY}/post/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete post", error);
        throw error;
    }
};