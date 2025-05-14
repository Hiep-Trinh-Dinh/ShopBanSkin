import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

export const sendMessage = async (data) => {
    try {
        const formData = new FormData();
        
        // Thêm các trường text vào form data
        if (data.content) formData.append('content', data.content);
        formData.append('channel', data.channel);
        formData.append('sender[name]', data.sender.name);
        if (data.sender.avatar) formData.append('sender[avatar]', data.sender.avatar);
        
        // Thêm file nếu có
        if (data.attachment) {
            formData.append('attachment', data.attachment);
        }

        const response = await axios.post(
            `${API_KEY}/chat/send`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to send message", error);
        throw error;
    }
};

export const getMessages = async () => {
    try {
        const response = await axios.get(
            `${API_KEY}/chat/messages`
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch messages", error);
        throw error;
    }
};

export const getChannelMessages = async (channelName) => {
    try {
        const response = await axios.get(
            `${API_KEY}/chat/channel/${channelName}`
        );
        return response.data;
    } catch (error) {
        console.error("Failed to fetch channel messages", error);
        throw error;
    }
};

export const deleteMessage = async (messageId) => {
    try {
        const response = await axios.delete(
            `${API_KEY}/chat/message/${messageId}`
        );
        return response.data;
    } catch (error) {
        console.error("Failed to delete message", error);
        throw error;
    }
};