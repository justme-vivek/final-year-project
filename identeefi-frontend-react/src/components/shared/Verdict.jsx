import React from 'react';
import { colors } from '../../theme/tokens';

// props: status 'authentic'|'fake'|'pending', title, children (supporting text)
const MAP = {
  authentic: { c: colors.verified, t: 'This product is authentic' },
  fake: { c: colors.alert, t: 'We could not verify this product' },
  pending: { c: colors.violetText, t: 'Checking the blockchain' },
};
const Verdict = ({ status = 'pending', title, children }) => {
  const m = MAP[status] || MAP.pending;
  return (
    <div role="status" style={{ border: `1px solid ${m.c}`, borderRadius: 16, padding: '20px 24px', background: colors.surface }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: m.c }}>{title || m.t}</div>
      {children && <div style={{ marginTop: 6, color: colors.textSecondary, fontSize: 15, lineHeight: 1.5 }}>{children}</div>}
    </div>
  );
};
export default Verdict;
