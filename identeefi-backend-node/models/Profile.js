const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxlength: 50
    },
    name: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String,
        maxlength: 500
    },
    website: {
        type: String
    },
    location: {
        type: String,
        maxlength: 50
    },
    image: {
        type: String,
        maxlength: 50
    },
    role: {
        type: String,
        maxlength: 50
    }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
