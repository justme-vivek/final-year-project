import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import Logo from './Logo';
import Avatar from './Avatar';
import { colors } from '../../theme/tokens';
import { NAV_BY_ROLE, ROLE_LABEL } from '../../utils/roles';

const P = {
  home: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  plus: 'M12 5v14M5 12h14',
  box: 'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 20a7 7 0 0 1 14 0M17 4a3.5 3.5 0 0 1 0 7M22 20a6 6 0 0 0-4-5.6',
  scan: 'M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16',
};
const Icon = ({ n }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]} /></svg>
);

// Authenticated layout: bottom tab bar <768, 72px icon rail 768-1023, 248px sidebar >=1024. Renders <Outlet/>.
const AppShell = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const items = NAV_BY_ROLE[auth?.role] || [];
  const signOut = () => { setAuth({}); navigate('/login'); };

  const link = (bp) => ({ isActive }) => ({
    display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', borderRadius: 10, minHeight: 44,
    color: isActive ? colors.textPrimary : colors.textSecondary, background: isActive && bp !== 'tab' ? colors.surfaceRaised : 'transparent',
    fontSize: bp === 'tab' ? 12 : 15, fontWeight: isActive ? 700 : 600,
    flexDirection: bp === 'tab' ? 'column' : 'row', justifyContent: bp === 'tab' ? 'center' : bp === 'rail' ? 'center' : 'flex-start',
    padding: bp === 'tab' ? '6px 4px' : '0 12px', flex: bp === 'tab' ? 1 : 'none',
  });

  return (
    <Box sx={{ minHeight: '100vh', background: colors.bgPrimary, color: colors.textPrimary, display: 'flex' }}>
      <Box component="aside" sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 4, flex: 'none', width: { md: 72, lg: 248 }, p: { md: '24px 12px', lg: '24px 16px' }, background: colors.bgSecondary, borderRight: `1px solid ${colors.border}`, position: 'sticky', top: 0, height: '100vh', boxSizing: 'border-box' }}>
        <Box sx={{ px: { lg: 1 }, display: 'flex', justifyContent: { md: 'center', lg: 'flex-start' } }}>
          <Box sx={{ display: { md: 'none', lg: 'block' } }}><Logo to={items[0]?.to || '/'} /></Box>
          <Box sx={{ display: { md: 'block', lg: 'none' } }}><Logo to={items[0]?.to || '/'} hideText /></Box>
        </Box>
        <nav aria-label="Main" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} aria-label={it.label} style={link('rail')} title={it.label}>
              <Icon n={it.icon} />
              <Box component="span" sx={{ display: { md: 'none', lg: 'inline' } }}>{it.label}</Box>
            </NavLink>
          ))}
        </nav>
        <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1, alignItems: { md: 'center', lg: 'flex-start' }, px: { lg: 1 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar name={auth?.user} image={auth?.image} size={36} />
            <Box sx={{ display: { md: 'none', lg: 'flex' }, flexDirection: 'column' }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{auth?.user}</span>
              <span style={{ fontSize: 14, color: colors.textSecondary }}>{ROLE_LABEL[auth?.role]}</span>
            </Box>
          </Box>
          <button type="button" onClick={signOut} style={{ minHeight: 44, background: 'transparent', border: 0, color: colors.violetText, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Sign out</button>
        </Box>
      </Box>

      <Box component="main" sx={{ flex: 1, minWidth: 0, p: { xs: '20px 16px 96px', sm: '24px 24px 96px', md: '32px 32px 48px', lg: '40px 48px 56px' }, boxSizing: 'border-box' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}><Outlet /></Box>
      </Box>

      <Box component="nav" aria-label="Main" sx={{ display: { xs: 'flex', md: 'none' }, position: 'fixed', left: 0, right: 0, bottom: 0, background: colors.bgSecondary, borderTop: `1px solid ${colors.border}`, p: '4px 8px calc(4px + env(safe-area-inset-bottom))', zIndex: 20 }}>
        {items.map((it) => (
          <NavLink key={it.to} to={it.to} style={link('tab')}><Icon n={it.icon} />{it.label}</NavLink>
        ))}
      </Box>
    </Box>
  );
};
export default AppShell;
