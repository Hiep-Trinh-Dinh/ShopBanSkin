const Chat = require('../models/Chat');

// Gửi tin nhắn
const sendMessage = async (req, res) => {
    try {
        const { content, channel, sender } = req.body;
        let attachment = null;
        let attachmentType = null;

        // Xử lý file nếu có
        if (req.file) {
            attachment = req.file.path;
            
            // Xác định loại tệp
            if (req.file.mimetype.startsWith('image')) {
                attachmentType = 'image';
            } else if (req.file.mimetype.startsWith('video')) {
                attachmentType = 'video';
            } else {
                attachmentType = 'file';
            }
        }

        // Kiểm tra xem có ít nhất một trong hai: nội dung hoặc tệp đính kèm
        if (!content && !attachment) {
            return res.status(400).json({
                success: false,
                message: 'Message must contain either text content or an attachment'
            });
        }

        const newMessage = new Chat({
            sender,
            content: content || "",
            channel,
            attachment,
            attachmentType
        });

        await newMessage.save();

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: newMessage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error! Please try again!'
        });
    }
};

// Lấy tất cả tin nhắn
const getMessages = async (req, res) => {
    try {
        const messages = await Chat.find()
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error! Please try again!'
        });
    }
};

// Lấy tin nhắn theo kênh
const getChannelMessages = async (req, res) => {
    try {
        const { channelName } = req.params;
        const messages = await Chat.find({ channel: channelName })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error! Please try again!'
        });
    }
};

// Xóa tin nhắn
const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        
        const message = await Chat.findById(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found!'
            });
        }

        await Chat.findByIdAndDelete(messageId);

        res.status(200).json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error! Please try again!'
        });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    deleteMessage,
    getChannelMessages
};