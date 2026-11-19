import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../shared/Logo';
import './public.css';

export const Navbar = () => (
  <header className="nav">
    <div className="wrap">
      <Logo />
      <nav className="nav-links" aria-label="Main">
        <a href="/#verify">Verify</a>
        <a href="/#roles">Who records what</a>
      </nav>
      <div className="nav-right">
        <Link to="/login" className="nav-staff">Staff login</Link>
        <Link to="/scanner" className="btn sm">Scan a product</Link>
      </div>
    </div>
  </header>
);
export default Navbar;
