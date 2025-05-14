// chat-route.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload-middleware');
const {
    sendMessage,
    getMessages,
    deleteMessage,
    getChannelMessages
} = require('../controllers/chat-controller');

router.post('/send', upload.single('attachment'), sendMessage);
router.get('/messages', getMessages);
router.get('/channel/:channelName', getChannelMessages);
router.delete('/message/:id', deleteMessage);

module.exports = router;