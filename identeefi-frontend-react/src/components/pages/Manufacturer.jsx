import React from 'react';
import RoleHome from './RoleHome';

const Manufacturer = () => (
  <RoleHome
    heading="Your products"
    actions={[
      { title: 'Add product', text: 'Register a new product with a photo and print its QR code.', to: '/add-product', needsWallet: true, primary: true },
      { title: 'Products', text: 'See every registered product and where it is now.', to: '/products' },
      { title: 'Profile', text: 'Check how your account appears to others.', to: '/profile', needsWallet: true },
    ]}
  />
);

export default Manufacturer;
