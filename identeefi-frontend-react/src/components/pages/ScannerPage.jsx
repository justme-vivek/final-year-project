import { API_BASE, CONTRACT_ADDRESS } from '../../config';
import React, { useEffect, useState } from 'react';
import QrScanner from '../QrScanner';
import useAuth from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PublicShell from "../home/PublicShell";

const ScannerPage = () => {
    const [qrData, setQrData] = useState('');
    const [manualInput, setManualInput] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const passData = (data) => {
        if (data && !isVerifying) {
            setQrData(data);
        }
    };

    useEffect(() => {
        const incoming = location.state?.serial;
        if (incoming && !manualInput) setManualInput(incoming);
    }, [location.state]);

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (!manualInput.trim() || isVerifying) return;
        let formattedData = manualInput.trim();
        if (!formattedData.includes(',')) {
            formattedData = `${CONTRACT_ADDRESS},${formattedData}`;
        }
        setQrData(formattedData);
    };

    useEffect(() => {
        if (!qrData) return;
        
        setIsVerifying(true);

        const verifyProductExists = async (serial) => {
            if (!serial || !serial.toString().trim()) return false;
            const cleanSerial = serial.toString().trim();

            try {
                const res = await axios.get(`${API_BASE}/products/serialNumbers`, { timeout: 30000 });
                const list = res.data || [];
                const foundInDb = list.some(item => 
                    item.serialnumber && item.serialnumber.toString().trim().toLowerCase() === cleanSerial.toLowerCase()
                );
                if (foundInDb) {
                    return true;
                }
            } catch (dbErr) {
                console.warn("Could not query DB for serial numbers:", dbErr);
            }
            return false;
        };

        const verifyAndNavigate = async () => {
            const hasComma = qrData.includes(",");
            const contractAddress = hasComma ? qrData.split(",")[0]?.trim() : CONTRACT_ADDRESS;
            const serial = hasComma ? qrData.split(",")[1]?.trim() : qrData.trim();

            if (!contractAddress || contractAddress.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase() || !serial) {
                setTimeout(() => navFakeProduct(), 1500); // Artificial delay to show verifying state
                return;
            }

            const exists = await verifyProductExists(serial);
            if (!exists) {
                console.warn("Product not found in DB! Redirecting to fake-product.");
                setTimeout(() => navFakeProduct(), 1500);
                return;
            }

            const isUpdateAction = location.state?.action === 'update';
            
            setTimeout(() => {
                if (isUpdateAction && auth?.user && (auth?.role === "supplier" || auth?.role === "retailer")) {
                    navRole();
                } else {
                    navProduct();
                }
            }, 1500);
        };

        verifyAndNavigate();
    }, [qrData]);

    const navRole = () => navigate('/update-product', { state: { qrData }});
    const navProduct = () => navigate('/product', { state: { qrData }});
    const navFakeProduct = () => navigate('/fake-product');
    const handleBack = () => navigate(-1);

    return (
        <PublicShell>
            <main className="page">
                <div className="wrap">
                    <div className="narrow">
                        <button className="back" onClick={handleBack}>Back</button>
                        {isVerifying ? (
                            <div className="card" role="status" style={{ textAlign: 'center', padding: '48px 20px' }}>
                                <div className="spin" aria-hidden="true" />
                                <h1 style={{ fontSize: 22, lineHeight: '28px' }}>Checking the blockchain record</h1>
                                <p className="sub" style={{ margin: 0 }}>This takes a few seconds.</p>
                            </div>
                        ) : (
                            <div className="card">
                                <h1>Scan a product</h1>
                                <p className="sub">Point your camera at the QR code on the package.</p>
                                <div style={{ maxWidth: 320, margin: '0 auto 24px', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(155,133,255,.6)' }}>
                                    <QrScanner passData={passData} />
                                </div>
                                <div className="or" style={{ marginBottom: 20 }}><span />or<span /></div>
                                <form onSubmit={handleManualSubmit} className="field">
                                    <label htmlFor="serial">Product ID</label>
                                    <input id="serial" className="input" placeholder="For example SN-WEB3-001" value={manualInput} onChange={(e) => setManualInput(e.target.value)} />
                                    <button type="submit" className="btn block" style={{ marginTop: 12 }} disabled={!manualInput.trim()}>Check this product</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </PublicShell>
    );
};

export default ScannerPage;
