const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    time: {
        type: Date,
        default: Date.now,
        expires: 60 // 1 minute
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Verification', VerificationSchema);