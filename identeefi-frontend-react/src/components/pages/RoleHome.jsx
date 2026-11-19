import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAccount } from 'wagmi';
import { Box } from '@mui/material';
import WalletConnect, { config } from './WalletConnect';
import Avatar from '../shared/Avatar';
import { API_BASE } from '../../config';
import { colors, radius } from '../../theme/tokens';
import { ROLE_LABEL } from '../../utils/roles';
import useAuth from '../../hooks/useAuth';

const getEthereumObject = () => window.ethereum;

export const useWalletGate = () => {
  const { isConnected } = useAccount({ config });
  const [connected, setConnected] = useState(() => sessionStorage.getItem('walletConnected') === 'true');
  useEffect(() => { sessionStorage.setItem('walletConnected', connected.toString()); }, [connected]);
  useEffect(() => {
    const clear = () => sessionStorage.removeItem('walletConnected');
    window.addEventListener('beforeunload', clear);
    return () => window.removeEventListener('beforeunload', clear);
  }, []);
  useEffect(() => {
    const eth = getEthereumObject();
    if (!eth) return;
    eth.request({ method: 'eth_accounts' }).then((a) => { if (a && a.length) setConnected(true); }).catch(() => {});
  }, []);
  useEffect(() => { if (isConnected) setConnected(true); }, [isConnected]);
  const connect = async () => {
    try {
      const eth = getEthereumObject();
      if (!eth) return;
      const a = await eth.request({ method: 'eth_requestAccounts' });
      if (a && a.length) setConnected(true);
    } catch (e) { console.error(e); }
  };
  return { connected, connect };
};

const Action = ({ title, text, onClick, disabled, primary }) => (
  <button type="button" onClick={onClick} aria-disabled={disabled} style={{
    textAlign: 'left', fontFamily: 'inherit', cursor: disabled ? 'not-allowed' : 'pointer', minHeight: 96, padding: 20,
    borderRadius: radius.card, border: `1px solid ${primary && !disabled ? colors.borderPurple : colors.border}`,
    background: primary && !disabled ? 'rgba(109,74,255,0.10)' : colors.surface, color: disabled ? colors.textMuted : colors.textPrimary,
    display: 'flex', flexDirection: 'column', gap: 6, opacity: disabled ? 0.7 : 1,
  }}>
    <span style={{ fontSize: 17, fontWeight: 800 }}>{title}</span>
    <span style={{ fontSize: 14, lineHeight: '20px', color: colors.textSecondary }}>{text}</span>
  </button>
);

// actions: [{ title, text, to, state, needsWallet, primary }]
const RoleHome = ({ heading, actions }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { connected, connect } = useWalletGate();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get(`${API_BASE}/productAll`).then((r) => setProducts((r.data || []).slice(-4).reverse())).catch(() => {});
  }, []);
  const go = (a) => { if (a.needsWallet && !connected) return; navigate(a.to, a.state ? { state: a.state } : undefined); };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: '24px 16px 96px', md: '32px 24px', lg: '40px 48px' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar name={auth?.user} image={auth?.image} size={52} />
          <Box>
            <h1 style={{ margin: 0, fontSize: 28, lineHeight: '34px', fontWeight: 800, letterSpacing: '-0.02em' }}>{heading}</h1>
            <span style={{ fontSize: 14, color: colors.textSecondary }}>Signed in as {ROLE_LABEL[auth?.role] || 'user'}{auth?.user ? `, ${auth.user}` : ''}</span>
          </Box>
        </Box>
        {auth?.role !== 'admin' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: connected ? colors.verified : colors.textSecondary }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: connected ? colors.verified : colors.textMuted }} />
              {connected ? 'Wallet connected' : 'Wallet not connected'}
            </span>
            <WalletConnect onClick={connect} />
          </Box>
        )}
      </Box>

      {auth?.role !== 'admin' && !connected && (
        <span style={{ fontSize: 14, color: colors.textSecondary }}>Connect your wallet to unlock the actions marked below.</span>
      )}

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: `repeat(${Math.min(actions.length, 3)}, 1fr)` } }}>
        {actions.map((a) => (
          <Action key={a.title} title={a.title} text={a.needsWallet && !connected ? `${a.text} Needs a connected wallet.` : a.text} primary={a.primary} disabled={a.needsWallet && !connected} onClick={() => go(a)} />
        ))}
      </Box>

      {auth?.role !== 'admin' && (
        <Box component="section" aria-label="Latest products" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Latest products</h2>
          {products.length === 0 ? (
            <span style={{ fontSize: 14, color: colors.textSecondary }}>No products registered yet.</span>
          ) : (
            <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' } }}>
              {products.map((p) => (
                <div key={p.serialNumber} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, border: `1px solid ${colors.border}`, borderRadius: radius.card, background: colors.surface, minWidth: 0 }}>
                  <Avatar kind="product" name={p.name} image={p.image} size={56} />
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                    <span style={{ fontSize: 13, color: colors.textSecondary, fontFamily: "'IBM Plex Mono', monospace" }}>{p.serialNumber}</span>
                  </div>
                </div>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RoleHome;
