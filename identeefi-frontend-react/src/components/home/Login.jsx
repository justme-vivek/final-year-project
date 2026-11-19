import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Logo from '../shared/Logo';
import './public.css';

const LOGIN_URL = '/auth';

const STATIONS = [
  { name: 'Manufacturer', note: 'Registers batches and creates QR codes', role: 'manufacturer' },
  { name: 'Supplier', note: 'Records arrivals and departures', role: 'supplier' },
  { name: 'Retailer', note: 'Confirms shelf arrival and marks items sold', role: 'retailer' },
  { name: 'You', note: 'Check any product, no account needed', role: 'customer' },
];

export default function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const errRef = useRef();
  const [mode, setMode] = useState('staff');
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pid, setPid] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signedRole, setSignedRole] = useState('');

  useEffect(() => { setErrMsg(''); }, [user, pwd, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${LOGIN_URL}/${user}/${pwd}`, { headers: { 'Content-Type': 'application/json' } });
      if (!res?.data || res.data.length === 0) {
        setErrMsg('We could not sign you in. Check your details and try again.');
      } else {
        const role = res.data[0].role;
        let image = '';
        try {
          const p = await axios.get(`/profile/${user}`);
          image = p?.data?.[0]?.image || '';
        } catch (e2) { /* avatar falls back to initials */ }
        setSignedRole(role);
        setAuth({ user, pwd, role, image });
        setUser('');
        setPwd('');
        navigate(`/${role}`, { replace: true });
      }
    } catch (err) {
      if (!err?.response) setErrMsg('The server is not responding. Try again in a moment.');
      else if (err.response?.status === 400) setErrMsg('The username or password is wrong.');
      else if (err.response?.status === 401) setErrMsg('This account is not allowed to sign in.');
      else setErrMsg('We could not sign you in. Try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  const check = (e) => {
    e.preventDefault();
    navigate('/scanner', { state: { serial: pid.trim() } });
  };

  const staff = mode === 'staff';

  return (
    <div className="pub login">
      <aside className="login-story">
        <Logo />
        <h1>{staff ? 'Sign in to record what you handle.' : "Anyone can check a product. You're the last stop."}</h1>
        <div>
          {STATIONS.map((s, i) => {
            const on = signedRole === s.role;
            return (
              <div className="stop" key={s.name}>
                <div className="rail">
                  <div className="dot" style={{ background: on ? '#35C98A' : 'transparent', border: on ? 0 : '1px solid rgba(255,255,255,.25)' }}>
                    {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>}
                  </div>
                  {i < STATIONS.length - 1 && <div className="seg" style={{ background: 'rgba(255,255,255,.18)' }} />}
                </div>
                <div className="stop-body"><b>{s.name}</b><span>{s.note}</span></div>
              </div>
            );
          })}
        </div>
        <span style={{ marginTop: 'auto', fontSize: 14, color: '#A5A1B2' }}>Records are saved on the Sepolia test network.</span>
      </aside>

      <main className="login-main">
        <div className="login-top">
          <span className="login-logo-m"><Logo /></span>
          <Link to="/" className="back" style={{ marginLeft: 'auto' }}>Back to home</Link>
        </div>
        <div className="login-box">
          <div className="seg2" role="group" aria-label="Sign in mode">
            <button type="button" aria-pressed={staff} onClick={() => setMode('staff')}>Staff sign in</button>
            <button type="button" aria-pressed={!staff} onClick={() => setMode('public')}>Check a product</button>
          </div>

          {staff ? (
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h2>Welcome back</h2>
                <p>Manufacturers, suppliers, retailers and admins sign in here. Your role comes from your account.</p>
              </div>
              {errMsg && <div className="err" role="alert" ref={errRef}>{errMsg}</div>}
              <div className="field">
                <label htmlFor="u1">Username</label>
                <input id="u1" className="input" autoComplete="username" autoFocus value={user} onChange={(e) => setUser(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="p1">Password</label>
                <div className="pw">
                  <input id="p1" className="input" type={showPw ? 'text' : 'password'} autoComplete="current-password" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
                  <button type="button" onClick={() => setShowPw((v) => !v)}>{showPw ? 'Hide' : 'Show'}</button>
                </div>
              </div>
              <button className="btn block" type="submit" disabled={isLoading || !user || !pwd}>{isLoading ? 'Signing in…' : 'Sign in'}</button>
              <p style={{ margin: 0 }}>Forgot your password? Ask your admin to reset it.</p>
            </form>
          ) : (
            <form onSubmit={check} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h2>Check without an account</h2>
                <p>Scan the QR code on the package, or type its product ID. You'll see a clear yes or no and the full journey.</p>
              </div>
              <Link to="/scanner" className="btn block">Open camera</Link>
              <div className="or"><span />or<span /></div>
              <div className="field">
                <label htmlFor="pid">Product ID</label>
                <input id="pid" className="input" value={pid} onChange={(e) => setPid(e.target.value)} />
              </div>
              <button className="btn block" type="submit" disabled={!pid.trim()}>Check this product</button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
