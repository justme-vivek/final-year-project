import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PublicShell from '../home/PublicShell';

const eth = () => window.ethereum;

const AuthenticProduct = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const qrData = location.state?.qrData;

  useEffect(() => {
    (async () => {
      try {
        if (!eth()) return;
        const accounts = await eth().request({ method: 'eth_accounts' });
        if (accounts.length) setCurrentAccount(accounts[0]);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const connectWallet = async () => {
    try {
      if (!eth()) { setMsg('No wallet found. Install MetaMask, then try again.'); return; }
      const accounts = await eth().request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (e) {
      console.error(e);
      setMsg('The wallet did not connect. Try again.');
    }
  };

  useEffect(() => {
    if (currentAccount) navigate('/product', { state: { qrData } });
  }, [currentAccount]);

  return (
    <PublicShell>
      <main className="page">
        <div className="wrap">
          <div className="narrow">
            <div className="verdict-card" role="status" style={{ borderColor: '#35C98A' }}>
              <h1 style={{ color: '#35C98A' }}>This product is authentic</h1>
              <p>Its record exists on the blockchain. Connect your wallet to open the full report and journey.</p>
              {msg && <div className="err" role="alert" style={{ marginBottom: 16 }}>{msg}</div>}
              <button className="btn block" onClick={connectWallet}>Connect wallet</button>
            </div>
          </div>
        </div>
      </main>
    </PublicShell>
  );
};
export default AuthenticProduct;
