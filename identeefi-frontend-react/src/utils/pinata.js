import axios from 'axios';
import { PINATA_JWT, PINATA_API_KEY, PINATA_SECRET, IPFS_GATEWAY } from '../config';

const GATEWAY = IPFS_GATEWAY || 'https://gateway.pinata.cloud';

// Auth headers for Pinata: the JWT is preferred, the API key and secret pair is the fallback.
export const pinataHeaders = () => {
  if (PINATA_JWT) return { Authorization: `Bearer ${PINATA_JWT}` };
  if (PINATA_API_KEY && PINATA_SECRET) return { pinata_api_key: PINATA_API_KEY, pinata_secret_api_key: PINATA_SECRET };
  throw new Error('Pinata is not set up. Add VITE_PINATA_JWT to the frontend .env and restart the dev server.');
};
export const pinataGateway = () => GATEWAY;

// Pins a file to IPFS through Pinata and returns its permanent gateway URL. Throws an Error with a readable message.
export const pinFile = async (file) => {
  if (!file) return '';
  const headers = pinataHeaders();
  const form = new FormData();
  form.append('file', file);
  try {
    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
      maxBodyLength: Infinity,
      headers,
    });
    return `${GATEWAY}/ipfs/${res.data.IpfsHash}`;
  } catch (err) {
    const s = err?.response?.status;
    if (s === 401 || s === 403) throw new Error('Pinata rejected the keys. Create new keys with pinFileToIPFS permission.');
    throw new Error('Could not upload the photo to IPFS. Check your connection and try again.');
  }
};
