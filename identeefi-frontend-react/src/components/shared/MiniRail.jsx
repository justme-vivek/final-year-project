import React from 'react';
import { colors } from '../../theme/tokens';

// props: total (default 4), reached (default 0), label (aria-label)
const MiniRail = ({ total = 4, reached = 0, label }) => (
  <span role="img" aria-label={label || `${reached} of ${total} custody steps`} style={{ display: 'inline-flex', alignItems: 'center' }}>
    {Array.from({ length: total }).map((_, i) => (
      <React.Fragment key={i}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: i < reached ? colors.verified : colors.border }} />
        {i < total - 1 && <span style={{ width: 12, height: 2, background: i + 1 < reached ? colors.verified : colors.border }} />}
      </React.Fragment>
    ))}
  </span>
);
export default MiniRail;
