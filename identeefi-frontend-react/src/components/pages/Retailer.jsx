import React from 'react';
import RoleHome from './RoleHome';

const Retailer = () => (
  <RoleHome
    heading="Check in products"
    actions={[
      { title: 'Check in a product', text: 'Scan a QR code and log where the product is now.', to: '/scanner', state: { action: 'update' }, needsWallet: true, primary: true },
      { title: 'Products', text: 'See every registered product and where it is now.', to: '/products' },
      { title: 'Profile', text: 'Check how your account appears to others.', to: '/profile', needsWallet: true },
    ]}
  />
);

export default Retailer;
