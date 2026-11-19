import React from 'react';
import RoleHome from './RoleHome';

const Admin = () => (
  <RoleHome
    heading="Accounts"
    actions={[
      { title: 'Add account', text: 'Create a manufacturer, supplier or retailer account with a photo.', to: '/add-account', primary: true },
      { title: 'Manage accounts', text: 'Edit details, change photos or remove accounts.', to: '/manage-account' },
    ]}
  />
);

export default Admin;
