import axios from 'axios';
import { API_BASE } from '../config';

// Photos and metadata are pinned to IPFS by the backend, which holds the Pinata JWT. No Pinata secret lives in the browser.
const readError = (err, fallback) => err?.response?.data?.error || fallback;

// Uploads a photo and returns its permanent IPFS URL. Throws an Error with a readable message.
export const pinFile = async (file) => {
  if (!file) return '';
  const form = new FormData();
  form.append('image', file);
  try {
    const res = await axios.post(`${API_BASE}/pin/image`, form, { timeout: 60000 });
    return res.data.url;
  } catch (err) {
    throw new Error(readError(err, 'Could not upload the photo. Check your connection and try again.'));
  }
};

// Pins product metadata (a small JSON object) and returns its IPFS URL.
export const pinJson = async (obj) => {
  try {
    const res = await axios.post(`${API_BASE}/pin/json`, obj, { timeout: 60000 });
    return res.data.url;
  } catch (err) {
    throw new Error(readError(err, 'Could not upload the product details.'));
  }
};
