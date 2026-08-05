/**
 * Seed script to populate MongoDB with initial data from the CSV files.
 * 
 * Usage: node seed.js
 * 
 * This creates the same test accounts, profiles, and products
 * that were originally in the CSV seed files.
 * Passwords are bcrypt-hashed (unlike the original plaintext CSVs).
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Auth = require('./models/Auth');
const Profile = require('./models/Profile');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/identeefi';
const saltRounds = 10;

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        // Clear existing data
        await Auth.deleteMany({});
        await Profile.deleteMany({});
        await Product.deleteMany({});
        // ==================== Seed Auth ====================
        const authData = [
            { username: 'admin', password: 'admin', role: 'admin' },
            { username: 'supp', password: 'supp', role: 'supplier' },
            { username: 'manu', password: 'manu', role: 'manufacturer' },
            { username: 'retailer', password: 'retailer', role: 'retailer' },
        ];

        for (const user of authData) {
            user.password = await bcrypt.hash(user.password, saltRounds);
        }

        await Auth.insertMany(authData);
        // ==================== Seed Profiles ====================
        const profileData = [
            {
                username: 'manu',
                name: 'Manu Group',
                description: 'Manu Group is one of the biggest manufacturer company in Malaysia, covering the majority of the luxury industry',
                website: 'www.manu.com.my',
                location: 'Kuala Lumpur, Malaysia',
                image: '',
                role: 'manufacturer'
            },
            {
                username: 'supp',
                name: 'CK Supplier',
                description: 'CK supplier supplies a myriad of luxury items and has a long term contract with Chanel, LV, Dior, etc.',
                website: 'www.cksupp.com.my',
                location: 'Bangsar South, Malaysia',
                image: '',
                role: 'supplier'
            },
            {
                username: 'retailer',
                name: 'RE retailer',
                description: 'RE retailer is the only authorized retailer to resell certain goods from certain luxury brands only, namely Chloe, Hermes, Chanel and more',
                website: 'www.reretailer.com.my',
                location: 'Kuala Lumpur, Malaysia',
                image: '',
                role: 'retailer'
            }
        ];

        await Profile.insertMany(profileData);
        // ==================== Seed Products ====================
        const productData = [
            { name: 'Classic Handbag', serialNumber: 'c12345', brand: 'Chanel' },
            { name: 'Flap Bag', serialNumber: 'c123', brand: 'Chanel' },
            { name: 'Mini Flap Bag', serialNumber: 'c32145', brand: 'Chanel' },
            { name: 'Mini Flap Bag', serialNumber: 'c54321', brand: 'Chanel' },
            { name: 'Classic', serialNumber: '456', brand: 'Chanel' },
        ];

        await Product.insertMany(productData);
    } catch (err) {
        console.error('Seed error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
