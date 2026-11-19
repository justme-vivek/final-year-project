import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicShell from './PublicShell';

const Tick = ({ dark }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={dark ? '#050507' : '#fff'} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);

const STOPS = [
  { who: 'Manufacturer', what: 'Registered the batch', hash: '0x7f3a…c91e', d: 'd1' },
  { who: 'Supplier', what: 'Received it at the warehouse', hash: '0x2b90…44d7', d: 'd2' },
  { who: 'Retailer', what: 'Put it on the shelf', hash: '0xa1c6…09fb', d: 'd3' },
  { who: 'You', what: 'Matches the chain', d: 'd4', you: true },
];

const ROLES = [
  ['Manufacturer', 'Registers each batch and creates its QR code.'],
  ['Supplier', 'Records when a batch arrives and when it leaves.'],
  ['Retailer', 'Confirms the product reached the shelf and marks it sold.'],
];

const Home = () => {
  const navigate = useNavigate();
  const [serial, setSerial] = useState('');
  const check = (e) => {
    e.preventDefault();
    navigate('/scanner', { state: { serial: serial.trim() } });
  };
  return (
    <PublicShell>
      <main>
        <div className="wrap">
          <section className="hero">
            <div>
              <h1>Know where a product has been before you trust it.</h1>
              <p className="lead">Scan the QR code on the package. AuthentiScan shows every hand it passed through, saved on the blockchain so nobody can quietly change it.</p>
              <div className="cta">
                <Link to="/scanner" className="btn">Scan a product</Link>
                <Link to="/login" className="btn ghost">Staff login</Link>
              </div>
              <p className="note">Works in your phone's browser. You don't need an account to verify.</p>
            </div>
            <div className="chain anim" aria-label="Sample custody chain">
              <div className="chain-head"><b>Batch A-1042</b><span>Sample record</span></div>
              {STOPS.map((s, i) => (
                <div className="stop" key={s.who}>
                  <div className="rail">
                    <div className={`dot st ${s.d}${s.you ? ' you' : ''}`}><Tick dark={s.you} /></div>
                    {i < STOPS.length - 1 && <div className={`seg ${s.d}`} />}
                  </div>
                  <div className={`stop-body st ${s.d}`}>
                    <b>{s.who}</b>
                    <span>{s.what}</span>
                    {s.hash && <code>{s.hash}</code>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="sec" id="verify">
            <div className="verify">
              <div className="card">
                <h2 style={{ fontSize: 22, lineHeight: '28px', marginBottom: 16 }}>Check a product now</h2>
                <div className="frame">Point your camera at the QR code</div>
                <Link to="/scanner" className="btn block">Open camera</Link>
                <form className="row" onSubmit={check}>
                  <input className="input" aria-label="Product ID" placeholder="Or type the product ID" value={serial} onChange={(e) => setSerial(e.target.value)} />
                  <button className="btn" type="submit" disabled={!serial.trim()}>Check</button>
                </form>
              </div>
              <div className="steps">
                <div className="step"><i>1</i><div><b>Scan the code</b><span>Every registered product carries a QR code made by its manufacturer.</span></div></div>
                <div className="step"><i>2</i><div><b>We read its record</b><span>The record comes straight from the blockchain, not from a database anyone can edit.</span></div></div>
                <div className="step"><i>3</i><div><b>See the verdict and the journey</b><span>You get a clear yes or no, plus who handled the product and when.</span></div></div>
              </div>
            </div>
          </section>

          <section className="sec" id="roles">
            <h2>Who records what</h2>
            <div className="roles">
              {ROLES.map(([n, d]) => (
                <div className="role" key={n}><b>{n}</b><span>{d}</span><Link to="/login">Sign in</Link></div>
              ))}
              <div className="role"><b>Customer</b><span>Scans a product to check it. No account needed.</span><Link to="/scanner">Scan a product</Link></div>
            </div>
          </section>

          <section className="final">
            <h2>Holding a package right now? Check it in a few seconds.</h2>
            <Link to="/scanner" className="btn">Scan a product</Link>
          </section>
        </div>
      </main>
    </PublicShell>
  );
};
export default Home;
