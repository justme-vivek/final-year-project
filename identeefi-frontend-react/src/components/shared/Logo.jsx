import React from 'react';
import { Link } from 'react-router-dom';
import { colors } from '../../theme/tokens';

export const Mark = ({ size = 32 }) => (
  <span style={{ width: size, height: size, borderRadius: 8, border: '1px solid rgba(109,74,255,0.6)', background: colors.surface, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
    <svg width={size / 2} height={size / 2} viewBox="0 0 24 24" fill="none" stroke={colors.violetText} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16" /></svg>
  </span>
);

// props: to (default '/'), size, hideText
const Logo = ({ to = '/', size = 32, hideText = false }) => (
  <Link to={to} aria-label="AuthentiScan home" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: colors.textPrimary, fontWeight: 800, fontSize: 18 }}>
    <Mark size={size} />
    {!hideText && 'AuthentiScan'}
  </Link>
);
export default Logo;
