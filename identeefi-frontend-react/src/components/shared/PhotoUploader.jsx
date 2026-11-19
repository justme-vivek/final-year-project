import React, { useEffect, useRef, useState } from 'react';
import { colors } from '../../theme/tokens';
import { profilePhotoUrl, productPhotoUrl } from '../../utils/photos';

// props: label, file (File|null), onChange(file|null), existing (filename already stored), kind 'product'|'profile', error, required
const PhotoUploader = ({ label = 'Photo', file, onChange, existing, kind = 'product', error, required }) => {
  const input = useRef(null);
  const [preview, setPreview] = useState('');
  useEffect(() => {
    if (!file) { setPreview(''); return undefined; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const shown = preview || (existing ? (kind === 'product' ? productPhotoUrl(existing) : profilePhotoUrl(existing)) : '');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{label}{required ? '' : ' (optional)'}</span>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ width: 96, height: 96, borderRadius: kind === 'profile' ? '50%' : 12, border: `1px dashed ${colors.borderPurple}`, background: colors.surfaceRaised, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.textSecondary, fontSize: 13, textAlign: 'center' }}>
          {shown ? <img src={shown} alt="Selected photo preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'No photo'}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => input.current && input.current.click()} style={{ minHeight: 44, padding: '0 18px', borderRadius: 10, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textPrimary, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>
            {shown ? 'Change photo' : 'Choose photo'}
          </button>
          {file && <button type="button" onClick={() => { onChange(null); if (input.current) input.current.value = ''; }} style={{ minHeight: 44, padding: '0 12px', border: 0, background: 'transparent', color: colors.alert, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>Remove</button>}
        </div>
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => onChange(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
      </div>
      {error && <span role="alert" style={{ fontSize: 13, color: colors.alert }}>{error}</span>}
    </div>
  );
};
export default PhotoUploader;
