const express = require('express');
const router = express.Router();

const { 
  createTransaction,
  getUserTransactions,
  updateTransactionStatus,
  getUserBalance,
  getAllTransactions
} = require('../controllers/transaction-controller');

const authMiddleware = require('../middlewares/auth-middleware');
const adminMiddleware = require('../middlewares/admin-middleware');
const uploadMiddleware = require('../middlewares/upload-middleware');

// Route tạo giao dịch (yêu cầu đăng nhập)
router.post(
  '/create',
  authMiddleware,
  uploadMiddleware.single('image'),
  createTransaction
);

// Route lấy lịch sử giao dịch của người dùng
router.get('/history', authMiddleware, getUserTransactions);

// Route lấy số dư người dùng
router.get('/balance', authMiddleware, getUserBalance);

// Route lấy tất cả giao dịch (chỉ dành cho admin)
router.get(
  '/all',
  authMiddleware,
  adminMiddleware,
  getAllTransactions
);

// Route cập nhật trạng thái giao dịch (chỉ dành cho admin)
router.put(
  '/status/:id',
  authMiddleware,
  adminMiddleware,
  updateTransactionStatus
);

module.exports = router; 