const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
    uploadBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: "677e79fe36038b1b949536b6"
    }
},{
    timestamps: true
});
    
module.exports = mongoose.model('Image', ImageSchema);