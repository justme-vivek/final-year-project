import { API_BASE } from '../config';

// A stored link without "https://" (for example "name.mypinata.cloud/ipfs/Qm...") gets one added.
const fixScheme = (s) => (/^[\w-]+(\.[\w-]+)+\/ipfs\//i.test(s || '') ? `https://${s}` : s);
const isUrl = (s) => /^(https?:|blob:|data:)/.test(fixScheme(s) || '');
export const productPhotoUrl = (name) => (!name ? '' : isUrl(name) ? fixScheme(name) : `${API_BASE}/file/product/${encodeURIComponent(name)}`);
export const profilePhotoUrl = (name) => (!name ? '' : isUrl(name) ? fixScheme(name) : `${API_BASE}/file/profile/${encodeURIComponent(name)}`);
export const initials = (name = '') =>
  (name.trim().split(/[\s_-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('') || '?').toUpperCase();
