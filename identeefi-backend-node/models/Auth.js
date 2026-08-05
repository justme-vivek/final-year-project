const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        maxlength: 50
    }
}, { timestamps: true });

module.exports = mongoose.model('Auth', authSchema);
