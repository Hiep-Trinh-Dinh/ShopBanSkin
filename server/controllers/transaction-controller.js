const Transaction = require('../models/Transaction');
const User = require('../models/User');
const {uploadToCloudinary} = require('../helpers/cloudinary-helper');

// Tạo giao dịch mới
const createTransaction = async (req, res) => {
  try {
    const { amount, type, description, productId, paymentMethod } = req.body;
    const userId = req.user.id;

    // Validate dữ liệu đầu vào
    if (!amount || !type) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin giao dịch! Vui lòng thử lại!'
      });
    }

    // Kiểm tra số tiền hợp lệ
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền không hợp lệ! Vui lòng thử lại!'
      });
    }

    // Xử lý ảnh chứng minh giao dịch nếu có
    let imageProofUrl = null;
    if (req.file) {
      const { url } = await uploadToCloudinary(req.file.path);
      imageProofUrl = url;
    }

    // Nếu thanh toán bằng số dư, kiểm tra số dư và tự động hoàn thành giao dịch
    let transactionStatus = 'pending';
    
    if (type === 'purchase' && paymentMethod === 'balance') {
      // Tính toán số dư hiện tại
      const completedTransactions = await Transaction.find({
        userId,
        status: 'completed'
      });
      
      let currentBalance = 0;
      completedTransactions.forEach(transaction => {
        if (transaction.type === 'deposit') {
          currentBalance += transaction.amount;
        } else if (transaction.type === 'purchase') {
          currentBalance -= transaction.amount;
        }
      });
      
      // Kiểm tra nếu đủ số dư
      if (currentBalance < amount) {
        return res.status(400).json({
          success: false,
          message: 'Số dư tài khoản không đủ để thanh toán!'
        });
      }
      
      // Nếu đủ số dư, đánh dấu giao dịch là đã hoàn thành
      transactionStatus = 'completed';
    }

    // Tạo giao dịch mới
    const newTransaction = new Transaction({
      userId,
      amount,
      type,
      description,
      productId,
      imageProof: imageProofUrl,
      status: transactionStatus,
      paymentMethod: paymentMethod || 'qr' // Mặc định là thanh toán qua QR
    });

    await newTransaction.save();

    res.status(201).json({
      success: true,
      message: 'Tạo giao dịch thành công!',
      data: newTransaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server! Vui lòng thử lại sau!'
    });
  }
};

// Lấy lịch sử giao dịch của người dùng
const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .populate('productId', 'name price image');

    res.status(200).json({
      success: true,
      message: 'Lấy lịch sử giao dịch thành công!',
      data: transactions
    });
  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server! Vui lòng thử lại sau!'
    });
  }
};

// Cập nhật trạng thái giao dịch (chỉ admin)
const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate trạng thái
    if (!['pending', 'completed', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ!'
      });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giao dịch!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái giao dịch thành công!',
      data: transaction
    });
  } catch (error) {
    console.error('Update transaction status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server! Vui lòng thử lại sau!'
    });
  }
};

// Tính toán số dư của người dùng
const getUserBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({
      userId,
      status: 'completed'
    });

    // Tính toán số dư từ lịch sử giao dịch
    let balance = 0;
    transactions.forEach(transaction => {
      if (transaction.type === 'deposit') {
        balance += transaction.amount;
      } else if (transaction.type === 'purchase') {
        balance -= transaction.amount;
      }
    });

    res.status(200).json({
      success: true,
      message: 'Lấy số dư thành công!',
      data: { balance }
    });
  } catch (error) {
    console.error('Get user balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server! Vui lòng thử lại sau!'
    });
  }
};

// Lấy tất cả giao dịch (chỉ admin)
const getAllTransactions = async (req, res) => {
  try {
    // Kiểm tra nếu là admin (có thể đã được xử lý bởi middleware)
    const transactions = await Transaction.find({})
      .sort({ createdAt: -1 })
      .populate('productId', 'name price image description')
      .populate('userId', 'name username email');
    
    res.status(200).json({
      success: true,
      message: 'Lấy tất cả giao dịch thành công!',
      data: transactions
    });
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server! Vui lòng thử lại sau!'
    });
  }
};

module.exports = {
  createTransaction,
  getUserTransactions,
  updateTransactionStatus,
  getUserBalance,
  getAllTransactions
}; 