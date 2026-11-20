// Single source of runtime configuration. Values come from Vite env (VITE_*), see .env.example.
// NOTE: anything VITE_* is bundled into the browser build, so these are NOT private.
const env = import.meta.env || {};

export const API_BASE = (env.VITE_API_URL || 'https://final-year-project-133i.onrender.com').replace(/\/$/, '');
export const CONTRACT_ADDRESS = env.VITE_CONTRACT_ADDRESS || '';
export const SEPOLIA_RPC = env.VITE_SEPOLIA_RPC || 'https://ethereum-sepolia-rpc.publicnode.com';
export const EXPLORER_URL = 'https://sepolia.etherscan.io';
export const PINATA_JWT = env.VITE_PINATA_JWT || '';
export const PINATA_API_KEY = env.VITE_PINATA_API_KEY || '';
export const PINATA_SECRET = env.VITE_PINATA_SECRET || '';
export const GOOGLE_MAPS_KEY = env.VITE_GOOGLE_MAPS_KEY || '';
export const WALLETCONNECT_PROJECT_ID = env.VITE_WALLETCONNECT_PROJECT_ID || '';
export const WALLETCONNECT_PROJECT_ID_BUTTONS = env.VITE_WALLETCONNECT_PROJECT_ID_BUTTONS || WALLETCONNECT_PROJECT_ID;
export const IPFS_GATEWAY = (env.VITE_IPFS_GATEWAY || '').replace(/\/$/, '');
