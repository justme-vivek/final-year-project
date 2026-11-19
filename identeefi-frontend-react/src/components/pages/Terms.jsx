import React from "react";
import { Link } from "react-router-dom";
import PublicShell from "../home/PublicShell";

export const Terms = () => (
  <PublicShell>
    <main className="page">
      <div className="wrap">
        <div className="narrow">
          <Link to="/" className="back">Back to home</Link>
          <h1>Terms of service</h1>
          <p className="sub">Last updated October 2026</p>
          <p>AuthentiScan provides blockchain-powered product verification. Product records are anchored on Sepolia Ethereum. Registration requires an authorized manufacturer, supplier, or retailer account.</p>
          <p>Verification results reflect on-chain data at time of query. Demo data on the landing page is labeled and does not represent live records. Users are responsible for wallet security and transaction confirmation.</p>
          <p>Contact the administrator for account issues or record disputes.</p>
        </div>
      </div>
    </main>
  </PublicShell>
);
export default Terms;
