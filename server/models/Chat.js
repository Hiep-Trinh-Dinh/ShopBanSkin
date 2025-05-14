// Chat.js
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    sender: {
        name: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: null
        }
    },
    content: {
        type: String,
        required: false, // Đổi thành false vì có thể chỉ gửi ảnh/file mà không có text
        trim: true
    },
    channel: {
        type: String,
        default: 'General'
    },
    attachment: {
        type: String,
        default: null
    },
    attachmentType: {
        type: String,
        enum: ['image', 'video', 'file', null],
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Chat', ChatSchema);