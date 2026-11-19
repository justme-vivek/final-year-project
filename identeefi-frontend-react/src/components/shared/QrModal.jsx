import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode.react';
import { CONTRACT_ADDRESS } from '../../config';
import { colors, radius } from '../../theme/tokens';

export const qrValueFor = (serial) => `${CONTRACT_ADDRESS},${serial}`;

const btn = (primary) => ({
  minHeight: 48, padding: '0 20px', borderRadius: 10, fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer',
  border: primary ? '0' : `1px solid ${colors.border}`, background: primary ? colors.purplePrimary : 'transparent', color: '#fff', flex: 1,
});

// Click-to-enlarge QR. props: serial (required), name, onClose
const QrModal = ({ serial, name, onClose }) => {
  const wrap = useRef(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const download = () => {
    const canvas = wrap.current && wrap.current.querySelector('canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${serial}-qr.png`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(qrValueFor(serial)); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch (e) { /* ignore */ }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={`QR code for ${name || serial}`} onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1500, background: 'rgba(5,5,7,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 400, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.card, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, color: colors.textPrimary, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{name || 'Product QR code'}</h2>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: colors.textSecondary, wordBreak: 'break-all' }}>{serial}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ minWidth: 44, minHeight: 44, background: 'transparent', border: 0, color: colors.textSecondary, fontSize: 24, cursor: 'pointer' }}>×</button>
        </div>
        <div ref={wrap} style={{ alignSelf: 'center', background: '#fff', padding: 12, borderRadius: 12, maxWidth: '100%' }}>
          <QRCode value={qrValueFor(serial)} size={280} level="H" includeMargin style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" style={btn(true)} onClick={download}>Download</button>
          <button type="button" style={btn(false)} onClick={copy}>{copied ? 'Copied' : 'Copy data'}</button>
        </div>
      </div>
    </div>
  );
};
export default QrModal;
