import React, { useState } from 'react';
import { profilePhotoUrl, productPhotoUrl, initials } from '../../utils/photos';
import { colors } from '../../theme/tokens';

// props: name (for initials + alt), image (filename or url), kind 'profile'|'product', size, rounded (default true for profile)
const Avatar = ({ name = '', image, kind = 'profile', size = 48, rounded }) => {
  const [failed, setFailed] = useState(false);
  const src = kind === 'product' ? productPhotoUrl(image) : profilePhotoUrl(image);
  const round = rounded ?? kind === 'profile';
  return (
    <span style={{ width: size, height: size, borderRadius: round ? '50%' : 10, overflow: 'hidden', background: '#231C47', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', color: '#C2B4FF', fontWeight: 800, fontSize: Math.max(12, size * 0.34) }}>
      {src && !failed ? (
        <img src={src} alt={name ? `${name} photo` : 'Photo'} onError={() => setFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span aria-hidden="true" style={{ color: colors.violetText }}>{initials(name)}</span>
      )}
    </span>
  );
};
export default Avatar;
