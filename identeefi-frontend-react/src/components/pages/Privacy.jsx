import React from "react";
import { Link } from "react-router-dom";
import PublicShell from "../home/PublicShell";

export const Privacy = () => (
  <PublicShell>
    <main className="page">
      <div className="wrap">
        <div className="narrow">
          <Link to="/" className="back">Back to home</Link>
          <h1>Privacy policy</h1>
          <p className="sub">Last updated October 2026</p>
          <p>AuthentiScan stores account data required for role-based access and product records required for verification. Wallet addresses are processed to sign and confirm blockchain transactions.</p>
          <p>Blockchain records are public by design. Do not register sensitive personal data as product metadata. Camera access for QR scanning stays on-device and is never uploaded.</p>
          <p>Contact the administrator to request account data review or removal where applicable.</p>
        </div>
      </div>
    </main>
  </PublicShell>
);
export default Privacy;
