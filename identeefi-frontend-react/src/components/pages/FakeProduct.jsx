import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicShell from '../home/PublicShell';

const FakeProduct = () => {
  const navigate = useNavigate();
  return (
    <PublicShell>
      <main className="page">
        <div className="wrap">
          <div className="narrow">
            <div className="verdict-card" role="status" style={{ borderColor: '#E05A6D' }}>
              <h1 style={{ color: '#E05A6D' }}>We couldn't verify this product</h1>
              <p>No matching record exists on the blockchain for this code. The product may be counterfeit, or the code may have been misread.</p>
              <p>Don't use the product if it affects your health or safety. Try scanning again in better light, or contact the manufacturer of the genuine product.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                <Link to="/scanner" className="btn">Scan again</Link>
                <button className="btn ghost" onClick={() => navigate('/')}>Back to home</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PublicShell>
  );
};
export default FakeProduct;
