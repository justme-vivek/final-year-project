import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './public.css';

// Wraps public pages with the shared top bar and footer.
const PublicShell = ({ children, nav = true }) => (
  <div className="pub">
    {nav && <Navbar />}
    {children}
    <Footer />
  </div>
);
export default PublicShell;
