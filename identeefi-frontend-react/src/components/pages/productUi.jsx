import React from 'react';
import dayjs from 'dayjs';
import { colors, radius } from '../../theme/tokens';

// Small presentational helpers shared by AddProduct, UpdateProduct, UpdateProductDetails and Product.
export const mono = "'IBM Plex Mono', ui-monospace, Menlo, monospace";

export const btnPrimary = {
  minHeight: 48, padding: '0 24px', borderRadius: radius.button, border: 0, background: colors.purplePrimary,
  color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: 'inherit', cursor: 'pointer', textDecoration: 'none',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
};
export const btnGhost = {
  ...btnPrimary, background: 'transparent', border: `1px solid ${colors.border}`, color: colors.textPrimary,
};
export const inputStyle = {
  width: '100%', boxSizing: 'border-box', minHeight: 48, padding: '0 16px', borderRadius: radius.control,
  background: colors.surfaceRaised, border: '1px solid rgba(255,255,255,0.16)', color: colors.textPrimary,
  fontSize: 15, fontFamily: 'inherit',
};

export const PageWrap = ({ children, max = 1200 }) => (
  <div style={{ width: '100%', boxSizing: 'border-box', maxWidth: max, margin: '0 auto', padding: 'clamp(16px, 4vw, 40px)', color: colors.textPrimary, display: 'flex', flexDirection: 'column', gap: 24 }}>
    {children}
  </div>
);

export const PageHead = ({ title, sub, right }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <h1 style={{ margin: 0, fontSize: 'clamp(24px, 4vw, 30px)', lineHeight: 1.2, fontWeight: 800, letterSpacing: '-0.02em' }}>{title}</h1>
      {sub && <span style={{ fontSize: 14, lineHeight: '20px', color: colors.textSecondary }}>{sub}</span>}
    </div>
    {right}
  </div>
);

export const Card = ({ title, children, style }) => (
  <section style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.card, padding: 'clamp(16px, 3vw, 24px)', display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0, ...style }}>
    {title && <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h2>}
    {children}
  </section>
);

export const Field = ({ label, id, hint, error, children }) => (
  <label htmlFor={id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
    {children}
    {hint && !error && <span style={{ fontSize: 13, color: colors.textSecondary }}>{hint}</span>}
    {error && <span role="alert" style={{ fontSize: 13, color: colors.alert }}>{error}</span>}
  </label>
);

export const Notice = ({ kind = 'info', children }) => {
  const c = kind === 'error' ? colors.alert : kind === 'success' ? colors.verified : colors.violetText;
  return <div role={kind === 'error' ? 'alert' : 'status'} style={{ border: `1px solid ${c}`, borderRadius: radius.control, padding: '12px 16px', fontSize: 14, lineHeight: 1.5, color: colors.textPrimary, wordBreak: 'break-word' }}>{children}</div>;
};

export const Row = ({ k, v, monoV }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
    <span style={{ fontSize: 13, color: colors.textSecondary }}>{k}</span>
    <span style={{ fontSize: 15, fontWeight: 600, wordBreak: 'break-word', fontFamily: monoV ? mono : 'inherit' }}>{v || '-'}</span>
  </div>
);

// Chain history entry parsing (deployed struct: id, actor, location, timestamp string, isSold). Same logic the pages used.
export const parseHistory = (rawHistory = []) => {
  const hist = [];
  let lastIsSold = false;
  for (let i = 0; i < rawHistory.length; i++) {
    const h = rawHistory[i];
    const actor = h.actor || h[1] || '';
    const location = (h.location || h[2] || '').replace(/;/g, ',');
    const tsNum = Number(h.timestamp || h[3] || '0');
    const rawSold = h.isSold !== undefined ? h.isSold : h[4];
    let sold;
    if (typeof rawSold === 'boolean') sold = rawSold;
    else if (typeof rawSold === 'string') sold = rawSold.toLowerCase() === 'true';
    else if (typeof rawSold === 'bigint') sold = rawSold !== 0n;
    else sold = !!rawSold;
    lastIsSold = sold;
    hist.push({ actor, location, timestamp: tsNum, isSold: sold });
  }
  return { hist, lastIsSold };
};

export const fmtTime = (ts) => (ts ? dayjs(ts * 1000).format('D MMM YYYY, h:mm A') : '');

// Turn raw history + profile map into JourneyLog entries.
export const toEntries = (history, profiles) =>
  history.map((h, i) => {
    const p = profiles[(h.actor || '').toLowerCase()] || {};
    return {
      id: i, actorName: h.actor, actorImage: p.image, role: p.role ? p.role.charAt(0).toUpperCase() + p.role.slice(1) : '',
      location: h.location, time: fmtTime(h.timestamp), isSold: h.isSold,
    };
  });
