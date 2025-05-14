const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'purchase'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'rejected'],
    default: 'pending'
  },
  description: {
    type: String
  },
  imageProof: {
    type: String
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  paymentMethod: {
    type: String,
    enum: ['qr', 'balance'],
    default: 'qr'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema); 