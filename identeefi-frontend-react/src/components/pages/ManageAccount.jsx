import { API_BASE } from '../../config';
import { Box } from '@mui/material';
import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../shared/Avatar';
import { colors, radius } from '../../theme/tokens';
import { ROLE_LABEL } from '../../utils/roles';

const FILTERS = [['all', 'All'], ['manufacturer', 'Manufacturers'], ['supplier', 'Suppliers'], ['retailer', 'Retailers']];
const mono = "'IBM Plex Mono', ui-monospace, monospace";
const link = { background: 'none', border: 0, fontFamily: 'inherit', fontSize: 14, fontWeight: 700, minHeight: 44, padding: '0 8px', cursor: 'pointer' };

const ManageAccount = () => {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await axios.get(`${API_BASE}/profileAll`);
      setRows(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Could not load accounts. Refresh to try again.');
    }
  };
  useEffect(() => { load(); }, []);

  const del = async (username) => {
    if (!window.confirm(`Delete ${username}? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API_BASE}/profile/${username}`);
      load();
    } catch (err) {
      console.error(err);
      setError(`Could not delete ${username}. Try again.`);
    }
  };
  const edit = (r) => navigate('/add-account', { state: { editUser: r } });

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((r) => (filter === 'all' || r.role === filter) && (!s || [r.name, r.username].some((v) => (v || '').toLowerCase().includes(s))));
  }, [rows, q, filter]);
  const noPhoto = rows.filter((r) => !r.image).length;
  const cols = 'minmax(0,2.6fr) minmax(0,1.3fr) minmax(0,1.2fr) minmax(0,2fr) 120px';

  const Actions = ({ r }) => (
    <span style={{ display: 'flex', gap: 4 }}>
      <button type="button" onClick={() => edit(r)} style={{ ...link, color: colors.violetText }}>Edit</button>
      <button type="button" onClick={() => del(r.username)} style={{ ...link, color: colors.alert }}>Delete</button>
    </span>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: '24px 16px 96px', md: '32px 24px', lg: '40px 48px' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, lineHeight: '34px', fontWeight: 800, letterSpacing: '-0.02em' }}>Manage accounts</h1>
          <span style={{ fontSize: 14, color: colors.textSecondary }}>{rows.length} accounts{noPhoto ? `. ${noPhoto} without a photo.` : '.'}</span>
        </div>
        <button type="button" onClick={() => navigate('/add-account')} style={{ minHeight: 48, padding: '0 24px', borderRadius: radius.button, border: 0, background: colors.purplePrimary, color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>Add account</button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <input aria-label="Search accounts" placeholder="Search by name or username" value={q} onChange={(e) => setQ(e.target.value)}
          style={{ width: '100%', maxWidth: 340, boxSizing: 'border-box', background: colors.surfaceRaised, border: '1px solid rgba(255,255,255,0.16)', borderRadius: radius.control, minHeight: 48, padding: '0 16px', color: colors.textPrimary, fontSize: 15, fontFamily: 'inherit' }} />
        <div role="group" aria-label="Filter by role" style={{ display: 'flex', background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.control, padding: 3, gap: 3, overflowX: 'auto' }}>
          {FILTERS.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}
              style={{ minHeight: 40, padding: '0 16px', borderRadius: 7, border: 0, fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap', background: filter === id ? colors.purplePrimary : 'transparent', color: filter === id ? '#fff' : colors.textSecondary }}>
              {label}
            </button>
          ))}
        </div>
      </Box>

      {error && <div role="alert" style={{ color: colors.alert }}>{error}</div>}
      {shown.length === 0 && !error && <div style={{ padding: 32, border: `1px dashed ${colors.border}`, borderRadius: radius.card, color: colors.textSecondary }}>No accounts match.</div>}

      {shown.length > 0 && (
        <>
          <Box sx={{ display: { xs: 'none', md: 'block' }, border: `1px solid ${colors.border}`, borderRadius: radius.card, background: colors.surface, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16, padding: '14px 24px', borderBottom: `1px solid ${colors.border}`, fontSize: 14, color: colors.textSecondary, fontWeight: 600 }}>
              <span>Account</span><span>Username</span><span>Role</span><span>Location</span><span>Actions</span>
            </div>
            {shown.map((r) => (
              <div key={r.username} style={{ display: 'grid', gridTemplateColumns: cols, gap: 16, alignItems: 'center', padding: '0 24px', minHeight: 76, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                  <Avatar name={r.name || r.username} image={r.image} size={48} />
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{r.name || r.username}</span>
                    {!r.image && <button type="button" onClick={() => edit(r)} style={{ ...link, minHeight: 24, padding: 0, fontSize: 13, textAlign: 'left', color: colors.violetText }}>Add a photo</button>}
                  </div>
                </div>
                <span style={{ fontFamily: mono, fontSize: 14, color: colors.textSecondary }}>{r.username}</span>
                <span style={{ justifySelf: 'start', fontSize: 13, fontWeight: 700, border: '1px solid rgba(255,255,255,0.20)', borderRadius: 100, padding: '4px 12px' }}>{ROLE_LABEL[r.role] || r.role}</span>
                <span style={{ fontSize: 14, color: colors.textSecondary }}>{r.location}</span>
                <Actions r={r} />
              </div>
            ))}
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
            {shown.map((r) => (
              <div key={r.username} style={{ border: `1px solid ${colors.border}`, borderRadius: radius.card, background: colors.surface, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <Avatar name={r.name || r.username} image={r.image} size={56} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>{r.name || r.username}</div>
                    <div style={{ fontFamily: mono, fontSize: 13, color: colors.textSecondary }}>{r.username}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, border: '1px solid rgba(255,255,255,0.20)', borderRadius: 100, padding: '4px 12px' }}>{ROLE_LABEL[r.role] || r.role}</span>
                  <span style={{ fontSize: 14, color: colors.textSecondary }}>{r.location}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Actions r={r} />
                  {!r.image && <span style={{ fontSize: 13, color: colors.textSecondary }}>No photo yet</span>}
                </div>
              </div>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ManageAccount;
