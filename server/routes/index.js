const authRouter = require('./auth-route');
const productRouter = require('./product-route');
const postRouter = require('./post-route');
const chatRouter = require('./chat-route');
const verificationRouter = require('./verification-route');
const historyRouter = require('./history-route');
const transactionRouter = require('./transaction-route');
const express = require('express');

const router = express.Router();

// Gắn các router vào đường dẫn tương ứng
router.use('/auth', authRouter);
router.use('/product', productRouter);
router.use('/post', postRouter);
router.use('/chat', chatRouter);
router.use('/verification', verificationRouter);
router.use('/history', historyRouter);
router.use('/transaction', transactionRouter);

module.exports = router;