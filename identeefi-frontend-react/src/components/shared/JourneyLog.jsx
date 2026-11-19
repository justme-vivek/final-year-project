import React from 'react';
import Avatar from './Avatar';
import { colors } from '../../theme/tokens';

// props: entries [{ id, actorName, actorImage, role, location, time (string), isSold }], newestFirst (default false)
// Each entry is one logged check-in. Photos fall back to initials.
const JourneyLog = ({ entries = [], newestFirst = false }) => {
  const list = newestFirst ? [...entries].reverse() : entries;
  if (!list.length) return <p style={{ color: colors.textSecondary, margin: 0 }}>No check-ins yet.</p>;
  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {list.map((e, i) => (
        <li key={e.id ?? i} style={{ display: 'flex', gap: 14, position: 'relative', paddingBottom: i === list.length - 1 ? 0 : 24 }}>
          {i < list.length - 1 && <span aria-hidden="true" style={{ position: 'absolute', left: 23, top: 52, bottom: 4, width: 2, background: colors.border }} />}
          <Avatar name={e.actorName} image={e.actorImage} size={48} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>{e.actorName || 'Unknown'}{e.role ? <span style={{ color: colors.textSecondary, fontWeight: 500 }}> · {e.role}</span> : null}</span>
            <span style={{ fontSize: 14, color: colors.textSecondary }}>{e.isSold ? 'Sold to customer' : 'Checked in'}{e.location ? ` at ${e.location}` : ''}</span>
            {e.time && <span style={{ fontSize: 13, color: colors.textSecondary }}>{e.time}</span>}
          </div>
        </li>
      ))}
    </ol>
  );
};
export default JourneyLog;
