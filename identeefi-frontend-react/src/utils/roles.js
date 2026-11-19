// Role helpers and role-based navigation for the app shell.
export const ROLES = ['manufacturer', 'supplier', 'retailer', 'admin'];
export const ROLE_LABEL = { manufacturer: 'Manufacturer', supplier: 'Supplier', retailer: 'Retailer', admin: 'Admin', customer: 'You' };
export const CHAIN_ORDER = ['manufacturer', 'supplier', 'retailer'];

export const NAV_BY_ROLE = {
  manufacturer: [
    { to: '/manufacturer', label: 'Home', icon: 'home' },
    { to: '/add-product', label: 'Add product', icon: 'plus' },
    { to: '/products', label: 'Products', icon: 'box' },
    { to: '/profile', label: 'Profile', icon: 'user' },
  ],
  supplier: [
    { to: '/supplier', label: 'Home', icon: 'home' },
    { to: '/update-product', label: 'Check in', icon: 'scan' },
    { to: '/products', label: 'Products', icon: 'box' },
    { to: '/profile', label: 'Profile', icon: 'user' },
  ],
  retailer: [
    { to: '/retailer', label: 'Home', icon: 'home' },
    { to: '/update-product', label: 'Check in', icon: 'scan' },
    { to: '/products', label: 'Products', icon: 'box' },
    { to: '/profile', label: 'Profile', icon: 'user' },
  ],
  admin: [
    { to: '/admin', label: 'Home', icon: 'home' },
    { to: '/add-account', label: 'Add account', icon: 'plus' },
    { to: '/manage-account', label: 'Accounts', icon: 'users' },
  ],
};

export const homeFor = (role) => (NAV_BY_ROLE[role] ? NAV_BY_ROLE[role][0].to : '/login');
export const APP_PREFIXES = ['/admin', '/add-account', '/manage-account', '/profile', '/products', '/update-product', '/update-product-details', '/manufacturer', '/add-product', '/supplier', '/retailer'];
