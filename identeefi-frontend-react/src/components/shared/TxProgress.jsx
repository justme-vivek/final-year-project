import React from 'react';
import { colors } from '../../theme/tokens';

// props: steps string[], current (index of active step; steps.length = done), error (string)
const TxProgress = ({ steps = ['Upload photo', 'Confirm in wallet', 'Record on blockchain', 'Save'], current = 0, error }) => (
  <ol aria-live="polite" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
    {steps.map((s, i) => {
      const done = i < current; const active = i === current && !error;
      const failed = i === current && error;
      return (
        <li key={s} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: done || active ? colors.textPrimary : colors.textSecondary, fontWeight: active ? 700 : 500 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: done ? colors.verified : failed ? colors.alert : 'transparent', border: `2px solid ${done ? colors.verified : failed ? colors.alert : active ? colors.violetText : colors.textMuted}` }} />
          {s}{failed ? `: ${error}` : ''}
        </li>
      );
    })}
  </ol>
);
export default TxProgress;
