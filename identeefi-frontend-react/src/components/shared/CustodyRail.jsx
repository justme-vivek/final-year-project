import React from 'react';
import { colors } from '../../theme/tokens';

const DEFAULT = ['Manufacturer', 'Supplier', 'Retailer', 'You'];
// props: steps (string[]), reached (number of steps reached, default all), vertical
const CustodyRail = ({ steps = DEFAULT, reached = steps.length, vertical = false }) => (
  <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: vertical ? 'column' : 'row', gap: vertical ? 16 : 0, alignItems: vertical ? 'flex-start' : 'center' }}>
    {steps.map((s, i) => {
      const on = i < reached;
      return (
        <li key={s + i} style={{ display: 'flex', flexDirection: vertical ? 'row' : 'row', alignItems: 'center', flex: vertical || i === steps.length - 1 ? 'none' : 1, gap: 10 }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: on ? colors.verified : 'transparent', border: `2px solid ${on ? colors.verified : colors.textMuted}`, flex: 'none' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: on ? colors.textPrimary : colors.textSecondary, whiteSpace: 'nowrap' }}>{s}</span>
          {!vertical && i < steps.length - 1 && <span aria-hidden="true" style={{ flex: 1, height: 2, minWidth: 16, background: i + 1 < reached ? colors.verified : colors.border, marginLeft: 6, marginRight: 6 }} />}
        </li>
      );
    })}
  </ol>
);
export default CustodyRail;
