import { API_BASE } from '../config';

const isUrl = (s) => /^(https?:|blob:|data:)/.test(s || '');
export const productPhotoUrl = (name) => (!name ? '' : isUrl(name) ? name : `${API_BASE}/file/product/${encodeURIComponent(name)}`);
export const profilePhotoUrl = (name) => (!name ? '' : isUrl(name) ? name : `${API_BASE}/file/profile/${encodeURIComponent(name)}`);
export const initials = (name = '') =>
  (name.trim().split(/[\s_-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('') || '?').toUpperCase();
