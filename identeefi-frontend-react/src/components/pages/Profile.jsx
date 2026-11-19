import { API_BASE } from '../../config';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import Avatar from '../shared/Avatar';
import WalletConnect from './WalletConnect';
import { colors, radius } from '../../theme/tokens';
import { ROLE_LABEL } from '../../utils/roles';

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '14px 0', borderBottom: `1px solid ${colors.border}` }}>
    <span style={{ fontSize: 14, color: colors.textSecondary }}>{label}</span>
    <span style={{ fontSize: 16, overflowWrap: 'anywhere' }}>{children || '-'}</span>
  </div>
);

const Profile = () => {
  const { auth } = useAuth();
  const [p, setP] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth?.user) return;
    axios.get(`${API_BASE}/profile/${auth.user}`)
      .then((res) => setP(res.data && res.data[0] ? res.data[0] : {}))
      .catch((err) => { console.error(err); setError('Could not load your profile. Refresh to try again.'); });
  }, [auth?.user]);

  const d = p || {};
  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', p: { xs: '24px 16px 96px', md: '32px 24px', lg: '40px 48px' } }}>
      <Box sx={{ border: `1px solid ${colors.border}`, borderRadius: radius.card, background: colors.surface, p: { xs: 2.5, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
          <Avatar name={d.name || auth?.user} image={d.image} size={96} />
          <div>
            <h1 style={{ margin: 0, fontSize: 28, lineHeight: '34px', fontWeight: 800 }}>{d.name || auth?.user}</h1>
            <span style={{ fontSize: 14, color: colors.textSecondary }}>{ROLE_LABEL[d.role || auth?.role]}</span>
          </div>
        </Box>
        {error && <div role="alert" style={{ color: colors.alert, marginTop: 16 }}>{error}</div>}
        <div style={{ marginTop: 16 }}>
          <Row label="Description">{d.description}</Row>
          <Row label="Website">{d.website}</Row>
          <Row label="Location">{d.location}</Row>
          <Row label="Username">{auth?.user}</Row>
        </div>
        <Box sx={{ mt: 3 }}><WalletConnect /></Box>
      </Box>
    </Box>
  );
};

export default Profile;
