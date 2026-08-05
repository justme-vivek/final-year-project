# Project Setup Guide

Welcome to the Anti-Counterfeit Product Identification System setup guide. This guide will help you install, run, and understand the core components of the project.

## 1. Installation & Setup

Ensure you have **Node.js** and **MongoDB** installed on your system before proceeding.

### Clone the Repository
```bash
git clone <your-repository-url>
cd anti-counterfeit-product-identification-system-using-blockchain
```

### Start the Backend Server
The backend relies on MongoDB. Make sure MongoDB is running locally on the default port (`mongodb://localhost:27017`), or update `MONGO_URI` in the `.env` file.

```bash
cd identeefi-backend-node
npm install

# (Optional but recommended) Seed the database with default accounts and sample data:
node seed.js

# Start the Express server (runs on port 5000)
npm start
```

### Start the Frontend Application
In a new terminal window, navigate to the frontend directory.

```bash
cd identeefi-frontend-react
npm install

# Start the React development server (runs on port 3000)
npm start
```

### Connect to MetaMask
1. Install the MetaMask extension in your browser.
2. Switch your network to the **Sepolia Testnet**.
3. Connect your wallet to the application when prompted.

### Getting Sepolia Testnet ETH
To perform transactions (like adding or updating products), you will need testnet ETH on the Sepolia network. You can claim free Sepolia ETH from the following faucets:
- **Alchemy Sepolia Faucet**: [sepoliafaucet.com](https://sepoliafaucet.com/) (Requires an Alchemy account)
- **Infura Sepolia Faucet**: [infura.io/faucet/sepolia](https://www.infura.io/faucet/sepolia) (Requires an Infura account)
- **Google Web3 Faucet**: [cloud.google.com/application/web3/faucet](https://cloud.google.com/application/web3/faucet)

---

## 2. Default Test Credentials
If you ran the `seed.js` script in the backend folder, the database is populated with the following default test accounts:

| User Role      | Username | Password |
|----------------|----------|----------|
| **Admin**      | `admin`  | `admin`  |
| **Manufacturer**| `manu`   | `manu`   |
| **Supplier**   | `supp`   | `supp`   |
| **Retailer**   | `retailer`| `retailer`|

---

## 3. Application Routes (Categorized by User Role)

### 🌍 Public / Unauthenticated Users
These frontend pages and backend endpoints are accessible to anyone, primarily to scan and verify products.

**Frontend Pages:**
- `/` - Home Page
- `/login` - Login Page
- `/scanner` - QR Code Scanner
- `/product` - Product Verification & History Viewer
- `/authentic-product` - Authentic Product Result Screen
- `/fake-product` - Fake Product Result Screen

**Backend Endpoints:**
- `GET /profileAll` - Retrieve all profile names and roles to map actors.
- `GET /file/profile/:fileName` - Serve profile images.
- `GET /file/product/:fileName` - Serve product images.

---

### 🛡️ Admin Role
Admins are responsible for managing system accounts.

**Frontend Pages:**
- `/admin` - Admin Dashboard
- `/manage-account` - Manage Users (View, Edit Roles, Delete Accounts)
- `/add-account` - Create new users (or edit existing users)

**Backend Endpoints:**
- `GET /authAll` - Get all authentication records.
- `POST /addaccount` - Create new login credentials.
- `POST /addprofile` - Create new profile details.
- `PUT /profile/:username` - Update full profile and optionally change password.
- `PUT /profile/:username/role` - Quickly change a user's role.
- `DELETE /profile/:username` - Delete a user's profile and credentials completely.

---

### 🏭 Manufacturer Role
Manufacturers register new authentic products onto the blockchain.

**Frontend Pages:**
- `/manufacturer` - Manufacturer Dashboard
- `/add-product` - Register a new product to the system and generate a QR Code.
- `/profile` - View their own profile details.
- `/products` - View a list of their products.

**Backend Endpoints:**
- `GET /profile/:username` - Fetch their specific profile details.
- `POST /upload/product` - Upload a new product image during product registration.

---

### 🚚 Supplier Role
Suppliers scan authentic products and update their location/ownership history on the blockchain.

**Frontend Pages:**
- `/supplier` - Supplier Dashboard
- `/update-product` - Search or scan a product to update it.
- `/update-product-details` - Form to confirm the new location/date of the product.
- `/profile` - View their own profile details.
- `/products` - View a list of their products.

---

### 🏬 Retailer Role
Retailers act similarly to suppliers, marking the final stage before a product is sold.

**Frontend Pages:**
- `/retailer` - Retailer Dashboard
- `/update-product` - Search or scan a product to update it.
- `/update-product-details` - Form to mark the product as sold or update its location.
- `/profile` - View their own profile details.
- `/products` - View a list of their products.
