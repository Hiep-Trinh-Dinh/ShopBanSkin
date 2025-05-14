const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'], //allow user or admin roles
        default: 'user',
    }, 
    isVerified: {
        type: Boolean,
        default: false  
    },
    image: {
        type: String,
        default: null,
    },
    online: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
},
{
    timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);