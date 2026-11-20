import axios from 'axios';
import { API_BASE } from '../config';
import { disconnectWallet } from '../utils/wallet';

// Sends the sign-in token with every request to our backend, and signs the user out when the token is rejected.
const readAuth = () => {
  try { return JSON.parse(sessionStorage.getItem('auth') || '{}'); } catch (e) { return {}; }
};

const isOurs = (url = '') => url.startsWith(API_BASE) || url.startsWith('/');

const attach = (instance) => {
  instance.interceptors.request.use((config) => {
    const { token } = readAuth();
    if (token && (isOurs(config.url || "") || config.baseURL === API_BASE)) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      const url = err?.config?.url || '';
      if (err?.response?.status === 401 && !url.includes('/login') && readAuth().token) {
        try { sessionStorage.removeItem('auth'); } catch (e) { /* ignore */ }
        disconnectWallet().finally(() => window.location.assign('/login'));
      }
      return Promise.reject(err);
    }
  );
};

export default attach;
