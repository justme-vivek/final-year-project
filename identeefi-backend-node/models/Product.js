const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100
    },
    name: {
        type: String,
        maxlength: 100
    },
    brand: {
        type: String,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 1000
    },
    image: {
        type: String,   // local filename
        default: ''
    },
    imageUrl: {
        type: String,   // IPFS URL
        default: ''
    },
    metadataUrl: {
        type: String,   // IPFS metadata URL
        default: ''
    },
    manuName: {
        type: String,
        maxlength: 100
    },
    manuLocation: {
        type: String,
        maxlength: 255
    },
    manuDate: {
        type: String    // unix timestamp string
    },
    txHash: {
        type: String,   // blockchain transaction hash
        default: ''
    },
    registeredBy: {
        type: String,   // username of the manufacturer
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
