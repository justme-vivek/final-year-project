import { API_BASE, CONTRACT_ADDRESS } from '../../config';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import QRCode from 'qrcode.react';
import Avatar from '../shared/Avatar';
import QrModal from '../shared/QrModal';
import { colors, radius } from '../../theme/tokens';

const mono = "'IBM Plex Mono', ui-monospace, monospace";
const fmtDate = (v) => {
  if (!v) return '-';
  const ts = parseInt(v, 10);
  return Number.isNaN(ts) ? v : new Date(ts * 1000).toLocaleDateString();
};
const TxLink = ({ hash }) => hash ? (
  <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 13 }}>
    {hash.slice(0, 8)}…{hash.slice(-6)}
  </a>
) : <span style={{ color: colors.textMuted }}>-</span>;
const Qr = ({ p, size = 64, onOpen }) => (
  <button type="button" onClick={() => onOpen(p)} aria-label={`Enlarge QR code for ${p.name}`} title="Click to enlarge"
    style={{ background: '#fff', padding: 4, borderRadius: 8, display: 'inline-flex', border: 0, cursor: 'zoom-in' }}>
    <QRCode value={`${CONTRACT_ADDRESS},${p.serialNumber}`} size={size} level="H" />
  </button>
);

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [qrFor, setQrFor] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/productAll`)
      .then((res) => setProducts(res.data || []))
      .catch((err) => { console.error(err); setError('Could not load products. Check your connection and refresh.'); })
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? products.filter((p) => [p.name, p.brand, p.serialNumber, p.manuName].some((v) => (v || '').toLowerCase().includes(s))) : products;
  }, [products, q]);

  const cols = 'minmax(0,2.4fr) minmax(0,1.3fr) minmax(0,1.4fr) minmax(0,1.2fr) minmax(0,1.3fr) 80px';

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: '24px 16px 96px', md: '32px 24px', lg: '40px 48px' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <h1 style={{ margin: 0, fontSize: 28, lineHeight: '34px', fontWeight: 800, letterSpacing: '-0.02em' }}>Products</h1>
          <span style={{ fontSize: 14, color: colors.textSecondary }}>{loading ? 'Loading…' : `${products.length} registered`}</span>
        </Box>
        <input aria-label="Search products" placeholder="Search by name, brand or serial" value={q} onChange={(e) => setQ(e.target.value)}
          style={{ width: '100%', maxWidth: 340, background: colors.surfaceRaised, border: '1px solid rgba(255,255,255,0.16)', borderRadius: radius.control, minHeight: 48, padding: '0 16px', color: colors.textPrimary, fontSize: 15, fontFamily: 'inherit' }} />
      </Box>

      {error ? (
        <div role="alert" style={{ color: colors.alert }}>{error}</div>
      ) : loading ? (
        <span style={{ color: colors.textSecondary }}>Loading products…</span>
      ) : rows.length === 0 ? (
        <div style={{ padding: 32, border: `1px dashed ${colors.border}`, borderRadius: radius.card, color: colors.textSecondary }}>
          {products.length ? 'No products match your search.' : 'No products yet. Manufacturers can register one from Add product.'}
        </div>
      ) : (
        <>
          {/* tablet and up: table */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, border: `1px solid ${colors.border}`, borderRadius: radius.card, background: colors.surface, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16, padding: '14px 24px', borderBottom: `1px solid ${colors.border}`, fontSize: 14, color: colors.textSecondary, fontWeight: 600 }}>
              <span>Product</span><span>Serial</span><span>Manufacturer</span><span>Registered</span><span>Transaction</span><span>QR</span>
            </div>
            {rows.map((p) => (
              <div key={p.serialNumber} style={{ display: 'grid', gridTemplateColumns: cols, gap: 16, alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <Avatar kind="product" name={p.name} image={p.image} size={56} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: colors.textSecondary }}>{p.brand}</div>
                  </div>
                </div>
                <span style={{ fontFamily: mono, fontSize: 13, color: colors.textSecondary, overflowWrap: 'anywhere' }}>{p.serialNumber}</span>
                <span style={{ fontSize: 14, color: colors.textSecondary }}>{p.manuName}<br />{p.manuLocation}</span>
                <span style={{ fontSize: 14, color: colors.textSecondary }}>{fmtDate(p.manuDate)}</span>
                <TxLink hash={p.txHash} />
                <Qr p={p} size={56} onOpen={setQrFor} />
              </div>
            ))}
          </Box>
          {/* phone: cards */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
            {rows.map((p) => (
              <div key={p.serialNumber} style={{ border: `1px solid ${colors.border}`, borderRadius: radius.card, background: colors.surface, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Avatar kind="product" name={p.name} image={p.image} size={64} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>{p.name}</div>
                    <div style={{ fontSize: 14, color: colors.textSecondary }}>{p.brand}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, fontSize: 13, color: colors.textSecondary }}>
                    <span style={{ fontFamily: mono, overflowWrap: 'anywhere' }}>{p.serialNumber}</span>
                    <span>{p.manuName}, {p.manuLocation}</span>
                    <span>Registered {fmtDate(p.manuDate)}</span>
                    <TxLink hash={p.txHash} />
                  </div>
                  <Qr p={p} size={72} onOpen={setQrFor} />
                </div>
              </div>
            ))}
          </Box>
        </>
      )}
      {qrFor && <QrModal serial={qrFor.serialNumber} name={qrFor.name} onClose={() => setQrFor(null)} />}
    </Box>
  );
};

export default ProductsPage;
