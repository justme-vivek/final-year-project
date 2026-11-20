// Fully disconnects the wallet from this app: wagmi session, saved wallet data and (where supported) the MetaMask site permission.
const SAVED_KEYS = /^(wagmi|wc@2|@w3m|w3m|walletconnect|-walletlink)/i;

export const disconnectWallet = async () => {
  try {
    const [{ disconnect }, mod] = await Promise.all([import('wagmi/actions'), import('../components/pages/WalletConnect')]);
    await disconnect(mod.config).catch(() => {});
  } catch (e) { /* wallet modal may not be loaded yet */ }
  try {
    const eth = typeof window !== 'undefined' ? window.ethereum : null;
    if (eth?.request) await eth.request({ method: 'wallet_revokePermissions', params: [{ eth_accounts: {} }] }).catch(() => {});
  } catch (e) { /* not supported by this wallet */ }
  try {
    Object.keys(localStorage).filter((k) => SAVED_KEYS.test(k)).forEach((k) => localStorage.removeItem(k));
    sessionStorage.removeItem('walletConnected');
  } catch (e) { /* storage blocked */ }
};
