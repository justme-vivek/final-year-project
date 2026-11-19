import { API_BASE } from '../../config';
import React, { useRef, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import PhotoUploader from '../shared/PhotoUploader';
import { colors, radius } from '../../theme/tokens';

const ROLE_OPTIONS = [
  { id: 'manufacturer', label: 'Manufacturer' },
  { id: 'supplier', label: 'Supplier' },
  { id: 'retailer', label: 'Retailer' },
];

const inputStyle = {
  width: '100%', boxSizing: 'border-box', background: colors.surfaceRaised, border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: radius.control, minHeight: 48, padding: '0 16px', color: colors.textPrimary, fontSize: 15, fontFamily: 'inherit',
};

const Field = ({ label, hint, children }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600 }}>
    {label}
    {children}
    {hint && <span style={{ fontSize: 13, fontWeight: 400, color: colors.textSecondary }}>{hint}</span>}
  </label>
);

const AddAccount = () => {
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [role, setRole] = useState(ROLE_OPTIONS[0].id);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState(null);
  const [errMsg, setErrMsg] = useState('');
  const [okMsg, setOkMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const errRef = useRef();
  const navigate = useNavigate();
  const locationRouter = useLocation();
  const editUser = locationRouter.state?.editUser;
  const isEditMode = !!editUser;

  useEffect(() => {
    if (isEditMode) {
      setUser(editUser.username || '');
      setRole(editUser.role || ROLE_OPTIONS[0].id);
      setName(editUser.name || '');
      setDescription(editUser.description || '');
      setWebsite(editUser.website || '');
      setLocation(editUser.location || '');
    }
  }, [editUser, isEditMode]);

  useEffect(() => { setErrMsg(''); }, [user, pwd, pwd2]);

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append('image', file);
    await axios.post(`${API_BASE}/upload/profile`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
  };

  const reset = () => {
    setUser(''); setPwd(''); setPwd2(''); setRole(ROLE_OPTIONS[0].id); setName('');
    setDescription(''); setWebsite(''); setLocation(''); setPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pwd !== pwd2) { setErrMsg('Passwords do not match.'); return; }
    setBusy(true);
    setOkMsg('');
    try {
      const profileData = {
        username: user, name, description, website, location,
        image: photo?.name || (isEditMode ? editUser.image : ''),
        role,
      };
      if (isEditMode) {
        if (pwd) profileData.password = pwd;
        await axios.put(`${API_BASE}/profile/${user}`, profileData, { headers: { 'Content-Type': 'application/json' } });
        if (photo) await uploadImage(photo);
        navigate('/manage-account');
        return;
      }
      await axios.post(`${API_BASE}/addaccount`, JSON.stringify({ username: user, password: pwd, role }), { headers: { 'Content-Type': 'application/json' } });
      await axios.post(`${API_BASE}/addprofile`, profileData, { headers: { 'Content-Type': 'application/json' } });
      if (photo) await uploadImage(photo);
      setOkMsg(`Account created for ${name || user}.`);
      reset();
    } catch (err) {
      if (!err?.response) setErrMsg('The server is not responding. Try again in a moment.');
      else if (err.response.status === 400) setErrMsg('That username is taken or a field is missing. Check the form and try again.');
      else if (err.response.status === 401) setErrMsg('You are not allowed to do this. Sign in as admin.');
      else setErrMsg('Could not save the account. Try again later.');
      errRef.current?.focus();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', p: { xs: '24px 16px 96px', md: '32px 24px', lg: '40px 48px' } }}>
      <h1 style={{ margin: '0 0 4px', fontSize: 28, lineHeight: '34px', fontWeight: 800, letterSpacing: '-0.02em' }}>{isEditMode ? 'Edit account' : 'Add account'}</h1>
      <p style={{ margin: '0 0 24px', fontSize: 14, color: colors.textSecondary }}>
        {isEditMode ? 'Change the details or photo. Leave the password empty to keep it.' : 'Create a login for a manufacturer, supplier or retailer.'}
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, border: `1px solid ${colors.border}`, borderRadius: radius.card, background: colors.surface, padding: 24 }}>
        <div ref={errRef} tabIndex={-1} role="alert" aria-live="assertive" style={{ color: colors.alert, fontSize: 14, display: errMsg ? 'block' : 'none' }}>{errMsg}</div>
        {okMsg && <div role="status" style={{ color: colors.verified, fontSize: 14 }}>{okMsg}</div>}

        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, padding: 0 }}>Role</legend>
          <div role="radiogroup" style={{ display: 'flex', background: colors.bgPrimary, border: `1px solid ${colors.border}`, borderRadius: radius.control, padding: 3, gap: 3 }}>
            {ROLE_OPTIONS.map((r) => (
              <button key={r.id} type="button" role="radio" aria-checked={role === r.id} onClick={() => setRole(r.id)}
                style={{ flex: 1, minHeight: 44, borderRadius: 7, border: 0, fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', background: role === r.id ? colors.purplePrimary : 'transparent', color: role === r.id ? '#fff' : colors.textSecondary }}>
                {r.label}
              </button>
            ))}
          </div>
        </fieldset>

        <PhotoUploader kind="profile" label="Account photo" file={photo} onChange={setPhoto} existing={isEditMode ? editUser.image : ''} />

        <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <Field label="Username"><input style={inputStyle} value={user} onChange={(e) => setUser(e.target.value)} required disabled={isEditMode} autoComplete="off" /></Field>
          <Field label="Display name"><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Foods" /></Field>
          <Field label={isEditMode ? 'New password' : 'Password'}><input style={inputStyle} type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required={!isEditMode} autoComplete="new-password" /></Field>
          <Field label="Confirm password"><input style={inputStyle} type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} required={!isEditMode || pwd.length > 0} autoComplete="new-password" /></Field>
          <Field label="Website"><input style={inputStyle} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" /></Field>
          <Field label="Location"><input style={inputStyle} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, state" /></Field>
        </Box>
        <Field label="Description">
          <textarea style={{ ...inputStyle, minHeight: 96, padding: 14, resize: 'vertical' }} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>

        {pwd !== pwd2 && pwd2 && <span style={{ fontSize: 13, color: colors.alert }}>Passwords do not match.</span>}

        <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column-reverse', sm: 'row' } }}>
          <button type="submit" disabled={busy} style={{ minHeight: 48, padding: '0 28px', borderRadius: radius.button, border: 0, background: colors.purplePrimary, color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1 }}>
            {busy ? 'Saving…' : isEditMode ? 'Save changes' : 'Add account'}
          </button>
          <button type="button" onClick={() => navigate(-1)} style={{ minHeight: 48, padding: '0 24px', borderRadius: radius.button, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textPrimary, fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>
            Cancel
          </button>
        </Box>
      </form>
    </Box>
  );
};

export default AddAccount;
