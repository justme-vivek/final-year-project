require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import Mongoose models
const Auth = require('./models/Auth');
const Profile = require('./models/Profile');
const Product = require('./models/Product');

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(bodyParser.json({ limit: '200kb' }));
// Set CORS_ORIGINS="https://your-site.com,http://localhost:5173" in production. Empty allows any origin (development only).
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean);
app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : undefined));

const port = 5000;

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/identeefi';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

// ==================== AUTH ROUTES ====================

const saltRounds = 10;

// Get all auth records
app.get('/authAll', async (req, res) => {
    try {
        const data = await Auth.find({});
        const formatted = data.map(d => ({
            id: d._id,
            username: d.username,
            password: d.password,
            role: d.role
        }));
        res.header('Access-Control-Allow-Credentials', true);
        res.send(formatted);
    } catch (err) {
        console.error("Error fetching auth data:", err);
        res.status(500).send('Internal Server Error');
    }
});

// Login
app.post('/auth/:username/:password', async (req, res) => {
    const { username, password } = req.params;
    try {
        const user = await Auth.findOne({ username: username });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                // Return in array format to match original API response
                res.status(200).send([{
                    username: user.username,
                    password: user.password,
                    role: user.role,
                    id: user._id
                }]);
            } else {
                res.status(401).send('Invalid password');
            }
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).send('Internal Server Error');
    }
});

// Create account
app.post('/addaccount', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await Auth.create({ username, password: hashedPassword, role });
        res.send('Data inserted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error creating account');
    }
});

// Change password
app.post('/changepsw', async (req, res) => {
    try {
        const { username, password } = req.body;
        await Auth.updateOne({ username: username }, { password: password });
        res.send('Data updated');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error updating password');
    }
});

// ==================== PROFILE ROUTES ====================

// Get all profiles
app.get('/profileAll', async (req, res) => {
    try {
        const data = await Profile.find({});
        const formatted = data.map(d => ({
            id: d._id,
            username: d.username,
            name: d.name,
            description: d.description,
            website: d.website,
            location: d.location,
            image: d.image,
            role: d.role
        }));
        res.header('Access-Control-Allow-Credentials', true);
        res.send(formatted);
    } catch (err) {
        console.error("Error fetching profiles:", err);
        res.status(500).send('Internal Server Error');
    }
});

// Get profile by username
app.get('/profile/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const data = await Profile.find({ username: username });
        const formatted = data.map(d => ({
            id: d._id,
            username: d.username,
            name: d.name,
            description: d.description,
            website: d.website,
            location: d.location,
            image: d.image,
            role: d.role
        }));
        res.send(formatted);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).send('Internal Server Error');
    }
});

// Create profile
app.post('/addprofile', async (req, res) => {
    try {
        const { username, name, description, website, location, image, role } = req.body;
        await Profile.create({ username, name, description, website, location, image, role });
        res.send('Data inserted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error creating profile');
    }
});

// Update profile role
app.put('/profile/:username/role', async (req, res) => {
    try {
        const { username } = req.params;
        const { role } = req.body;
        await Profile.updateOne({ username }, { role });
        await Auth.updateOne({ username }, { role }); // Keep auth role in sync
        res.send('Role updated successfully');
    } catch (err) {
        console.error("Error updating role:", err);
        res.status(500).send('Error updating role');
    }
});

// Update full profile (used by edit user form)
app.put('/profile/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { name, description, website, location, image, role, password } = req.body;
        
        // update profile
        const profileUpdate = { name, description, website, location, role };
        if (image) profileUpdate.image = image;
        await Profile.updateOne({ username }, profileUpdate);

        // update auth
        const authUpdate = { role };
        if (password) {
            authUpdate.password = await bcrypt.hash(password, saltRounds);
        }
        await Auth.updateOne({ username }, authUpdate);

        res.send('Profile updated successfully');
    } catch (err) {
        console.error("Error updating profile full:", err);
        res.status(500).send('Error updating profile full');
    }
});

// Delete profile and account
app.delete('/profile/:username', async (req, res) => {
    try {
        const { username } = req.params;
        await Profile.deleteOne({ username });
        await Auth.deleteOne({ username }); // Delete from auth as well
        res.send('User deleted successfully');
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).send('Error deleting user');
    }
});

// ==================== IMAGE UPLOAD ROUTES ====================

// ==================== IPFS (PINATA) UPLOADS ====================
// Images never touch this server's disk. The browser sends the file here, the server pins it to IPFS
// with the Pinata JWT (kept in this server's env, never sent to the browser) and returns the gateway URL.
const PINATA_JWT = process.env.PINATA_JWT || '';
const IPFS_GATEWAY = (process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud').replace(/\/$/, '');
const ALLOWED_IMAGES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const pinLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many uploads. Try again later.' } });
const memUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (req, file, cb) => cb(ALLOWED_IMAGES.includes(file.mimetype) ? null : new Error('Only JPG, PNG, WebP or GIF images are allowed.'), ALLOWED_IMAGES.includes(file.mimetype)),
});

const pinToPinata = async (buffer, filename, contentType) => {
    if (!PINATA_JWT) throw Object.assign(new Error('Server is missing PINATA_JWT.'), { status: 500 });
    const form = new FormData();
    form.append('file', new Blob([buffer], { type: contentType }), filename);
    const r = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', { method: 'POST', headers: { Authorization: `Bearer ${PINATA_JWT}` }, body: form });
    if (!r.ok) throw Object.assign(new Error('Pinata rejected the upload.'), { status: 502 });
    const json = await r.json();
    return `${IPFS_GATEWAY}/ipfs/${json.IpfsHash}`;
};

// Upload a photo (product or profile). Field name: image. Returns { url }.
app.post('/pin/image', pinLimiter, (req, res) => {
    memUpload.single('image')(req, res, async (err) => {
        if (err) return res.status(400).send({ error: err.message });
        if (!req.file) return res.status(400).send({ error: 'Please select an image to upload.' });
        try {
            const url = await pinToPinata(req.file.buffer, req.file.originalname, req.file.mimetype);
            res.send({ url });
        } catch (e) {
            console.error('Pin image failed:', e.message);
            res.status(e.status || 500).send({ error: e.message });
        }
    });
});

// Upload product metadata JSON (max 20 KB). Returns { url }.
app.post('/pin/json', pinLimiter, async (req, res) => {
    try {
        const body = JSON.stringify(req.body || {});
        if (!req.body || typeof req.body !== 'object' || body.length > 20000) return res.status(400).send({ error: 'Invalid metadata.' });
        const url = await pinToPinata(Buffer.from(body), 'metadata.json', 'application/json');
        res.send({ url });
    } catch (e) {
        console.error('Pin json failed:', e.message);
        res.status(e.status || 500).send({ error: e.message });
    }
});

// Old disk-based routes are gone.
const imagesMoved = (req, res) => res.status(410).send({ error: 'Image uploads moved to IPFS. Use /pin/image.' });
app.post('/upload/profile', imagesMoved);
app.post('/upload/product', imagesMoved);
app.get('/file/profile/:fileName', imagesMoved);
app.get('/file/product/:fileName', imagesMoved);

// ==================== PRODUCT ROUTES ====================

// Get all serial numbers
app.get('/products/serialNumbers', async (req, res) => {
    try {
        const data = await Product.find({}, { serialNumber: 1, _id: 0 });
        // Transform to match original format: [{serialnumber: "..."}]
        const formatted = data.map(d => ({ serialnumber: d.serialNumber }));
        res.send(formatted);
    } catch (err) {
        console.error("Error fetching serial numbers:", err);
        res.status(500).send('Internal Server Error');
    }
});

// Get single product by serial number
app.get('/product/:serialNumber', async (req, res) => {
    try {
        const { serialNumber } = req.params;
        const product = await Product.findOne({ serialNumber });
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.send({
            id: product._id,
            serialNumber: product.serialNumber,
            name: product.name,
            brand: product.brand,
            description: product.description,
            image: product.image,
            imageUrl: product.imageUrl,
            metadataUrl: product.metadataUrl,
            manuName: product.manuName,
            manuLocation: product.manuLocation,
            manuDate: product.manuDate,
            txHash: product.txHash,
            registeredBy: product.registeredBy,
            createdAt: product.createdAt
        });
    } catch (err) {
        console.error('Error fetching product by serial:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Add product (full data)
app.post('/addproduct', async (req, res) => {
    try {
        const {
            serialNumber, name, brand, description,
            image, imageUrl, metadataUrl,
            manuName, manuLocation, manuDate,
            txHash, registeredBy
        } = req.body;
        await Product.create({
            serialNumber, name, brand, description,
            image: image || '',
            imageUrl: imageUrl || '',
            metadataUrl: metadataUrl || '',
            manuName: manuName || '',
            manuLocation: manuLocation || '',
            manuDate: manuDate || '',
            txHash: txHash || '',
            registeredBy: registeredBy || ''
        });
        res.send('Data inserted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error adding product');
    }
});

// Get all products (full data)
app.get('/productAll', async (req, res) => {
    try {
        const data = await Product.find({});
        const formatted = data.map(d => ({
            id: d._id,
            serialNumber: d.serialNumber,
            name: d.name,
            brand: d.brand,
            description: d.description,
            image: d.image,
            imageUrl: d.imageUrl,
            metadataUrl: d.metadataUrl,
            manuName: d.manuName,
            manuLocation: d.manuLocation,
            manuDate: d.manuDate,
            txHash: d.txHash,
            registeredBy: d.registeredBy,
            createdAt: d.createdAt
        }));
        res.send(formatted);
    } catch (err) {
        console.error('Error fetching all products:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
});
