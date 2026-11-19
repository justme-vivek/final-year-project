import React from 'react';
import { Link } from 'react-router-dom';
import './public.css';

export const Footer = () => (
  <footer className="foot">
    <div className="wrap">
      <span className="live"><s aria-hidden="true" />Reading records from the Sepolia test network</span>
      <span className="links"><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link></span>
    </div>
  </footer>
);
export default Footer;
