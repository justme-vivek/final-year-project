import { API_BASE, CONTRACT_ADDRESS, GOOGLE_MAPS_KEY, SEPOLIA_RPC } from '../../config';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { readContract, writeContract, sendWithGas } from '../../utils/chain';
import axios from 'axios';
import { getPosition, reverseGeocode } from '../../utils/geo';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import abi from '../../utils/Identeefi.json';
import JourneyLog from '../shared/JourneyLog';
import TxProgress from '../shared/TxProgress';
import CustodyRail from '../shared/CustodyRail';
import { colors, radius } from '../../theme/tokens';
import { PageWrap, PageHead, Card, Field, Notice, Row, btnPrimary, btnGhost, inputStyle, parseHistory, toEntries } from './productUi';

const UpdateProductDetails = () => {

    const [currentAccount, setCurrentAccount] = useState("");
    const [currDate, setCurrDate] = useState('');
    const [currLatitude, setCurrLatitude] = useState("");
    const [currLongtitude, setCurrLongtitude] = useState("");
    const [currName, setCurrName] = useState("");
    const [currLocation, setCurrLocation] = useState("");
    const [dbLocation, setDbLocation] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [isSold, setIsSold] = useState(false);
    const [loading, setLoading] = useState("");
    const [history, setHistory] = useState([]);
    const [profiles, setProfiles] = useState({});
    const [step, setStep] = useState(-1);
    const [txError, setTxError] = useState("");




    const CONTRACT_ABI = abi.abi;

    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const qrData = location.state?.qrData;


    useEffect(() => {
        if (qrData) {
            const cleanSerial = qrData.includes(",") ? qrData.split(",")[1]?.trim() : qrData.trim();
            setSerialNumber(cleanSerial || "");
        }

        if (qrData) loadHistory(qrData);
    }, [qrData]);

    useEffect(() => {
        getUsername();
        getCurrentTimeLocation();
    }, []);


    const [locStatus, setLocStatus] = useState('');
    const locateMe = async () => {
        setLocStatus('Finding your location…');
        try {
            const { lat, lng } = await getPosition();
            setCurrLatitude(lat); setCurrLongtitude(lng);
            const { address, source } = await reverseGeocode(lat, lng);
            setCurrLocation(address.replace(/,/g, ';'));
            setLocStatus(source === 'coordinates' ? 'Could not find the address, so the coordinates were filled in. You can edit the text.' : '');
        } catch (e) {
            setLocStatus(e.message);
        }
    };

    const loadHistory = async (data) => {
        try {
            const serial = data.includes(",") ? data.split(",")[1]?.trim() : data.trim();
            const product = await readContract().getProduct(serial);
            setHistory(parseHistory(product[5] || []).hist);
        } catch (err) {
            console.warn('Could not load history', err?.message);
        }
        try {
            const res = await axios.get(`${API_BASE}/profileAll`);
            const m = {};
            (res.data || []).forEach((p) => { if (p.name) m[p.name.toLowerCase()] = { role: p.role, image: p.image }; });
            setProfiles(m);
        } catch (err) { /* photos fall back to initials */ }
    }

    const getCurrentTimeLocation = () => {
        setCurrDate(dayjs().unix())
        locateMe();
    }

       

    const getUsername = async (e) => {
        if (!auth?.user) return;
        try {
            const res = await axios.get(`${API_BASE}/profile/${auth.user}`);
            if (res.data && res.data.length > 0) {
                setCurrName(res.data[0].name || "");
                setDbLocation(res.data[0].location || "");
            }
        } catch (err) {
            console.error("Error loading user profile details:", err);
        }
    }

    const updateProduct = async (e) => {
        e.preventDefault();

        try {
            if (!window.ethereum) {
                setTxError("Connect MetaMask to record this check-in.");
                setStep(-1);
                return;
            }
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }],
                });
            } catch (switchError) {
                console.warn("Please switch MetaMask to Sepolia network:", switchError);
            }

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];

            const productContract = writeContract();

            const finalName = currName || auth?.user || "Retail Store";
            const finalLocation = currLocation || dbLocation || "Retail Store, Kuala Lumpur, Malaysia";
            const finalDate = (currDate || dayjs().unix()).toString();
            const cleanSerial = serialNumber?.trim();

            if (!cleanSerial) {
                setTxError("This check-in has no serial number. Scan the product again.");
                return;
            }

            setStep(1);
            const registerTxn = await sendWithGas(productContract, 'addProductHistory', [
                cleanSerial,
                finalName,
                finalLocation,
                finalDate,
                isSold,
            ]);
            setStep(2);
            await registerTxn.wait();

            setStep(3);
            setLoading("Check-in recorded.");
            const targetRoute = auth?.role ? `/${auth.role}` : '/';
            setTimeout(() => navigate(targetRoute, { replace: true }), 1500);
        } catch (error) {
            console.error("Transaction error:", error);
            const errMsg = error?.message || "Transaction failed or rejected.";
            setLoading("");
            setTxError(errMsg);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTxError("");
        setStep(0);
        setLoading("Confirm the transaction in your wallet. A small network fee applies.")
        await updateProduct(e);


    }

    const handleBack = () => {
        navigate(-1)
    }

    const reached = auth?.role === 'supplier' ? 2 : 3;
    const busy = step >= 0 && step < 3 && !txError;
    const seg = (on) => ({ flex: 1, minHeight: 44, border: 0, borderRadius: 7, fontWeight: 700, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer', background: on ? colors.purplePrimary : 'transparent', color: on ? '#fff' : colors.textSecondary });

    return (
        <PageWrap max={1000}>
            <PageHead title="Add a check-in" sub="Each check-in is recorded permanently on the blockchain." />
            <Card>
                <CustodyRail reached={reached} />
            </Card>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 24, alignItems: 'start' }}>
                <Card title="Step 1: your check-in">
                    <Row k="Serial number" v={serialNumber} monoV />
                    <Field label="Your store or company name" id="curr-name">
                        <input id="curr-name" style={inputStyle} value={currName} onChange={(e) => setCurrName(e.target.value)} placeholder="Store or company name" />
                    </Field>
                    <Field label="Location" id="curr-loc" hint="Filled in from your device location when available.">
                        <textarea id="curr-loc" rows={2} style={{ ...inputStyle, padding: 12, resize: 'vertical' }} value={currLocation.replace(/;/g, ",")} onChange={(e) => setCurrLocation(e.target.value)} placeholder="Address" />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                            <button type="button" onClick={locateMe} style={{ minHeight: 44, padding: '0 16px', borderRadius: 10, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textPrimary, fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Use my location</button>
                            {locStatus && <span role="status" style={{ fontSize: 13, color: colors.textSecondary }}>{locStatus}</span>}
                        </div>
                    </Field>
                    {auth.role !== 'supplier' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <span style={{ fontSize: 14, fontWeight: 600 }}>Was this product sold to a customer?</span>
                            <div role="group" aria-label="Sold status" style={{ display: 'flex', background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radius.control, padding: 3, gap: 3 }}>
                                <button type="button" aria-pressed={!isSold} style={seg(!isSold)} onClick={() => setIsSold(false)}>No, still in stock</button>
                                <button type="button" aria-pressed={isSold} style={seg(isSold)} onClick={() => setIsSold(true)}>Yes, sold</button>
                            </div>
                        </div>
                    )}
                    <Row k="Date and time" v={currDate ? dayjs(currDate * 1000).format("D MMMM YYYY, h:mm A") : ''} />
                </Card>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
                    <Card title="Step 2: confirm and record">
                        <TxProgress steps={['Review details', 'Confirm in wallet', 'Record on blockchain', 'Done']} current={step < 0 ? 0 : step} error={txError || undefined} />
                        {loading && !txError && <Notice kind={step === 3 ? 'success' : 'info'}>{loading}</Notice>}
                        {txError && <Notice kind="error">{txError}</Notice>}
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <button type="button" disabled={busy || step === 3} onClick={handleSubmit} style={{ ...btnPrimary, flex: '1 1 200px', opacity: busy || step === 3 ? 0.6 : 1 }}>
                                {busy ? 'Recording...' : 'Record check-in'}
                            </button>
                            <button type="button" style={btnGhost} onClick={handleBack}>Back</button>
                        </div>
                    </Card>
                    <Card title="Earlier check-ins">
                        <JourneyLog entries={toEntries(history, profiles)} newestFirst />
                    </Card>
                </div>
            </div>
        </PageWrap>
    )
}

export default UpdateProductDetails;
