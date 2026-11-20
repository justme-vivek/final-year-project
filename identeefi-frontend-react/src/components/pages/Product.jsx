import { API_BASE, CONTRACT_ADDRESS, EXPLORER_URL, SEPOLIA_RPC } from '../../config';
import { useLocation, useNavigate } from 'react-router-dom';
import abi from '../../utils/Identeefi.json';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { readContract } from '../../utils/chain';
import Logo from '../shared/Logo';
import Avatar from '../shared/Avatar';
import Verdict from '../shared/Verdict';
import CustodyRail from '../shared/CustodyRail';
import JourneyLog from '../shared/JourneyLog';
import { colors } from '../../theme/tokens';
import { Card, Row, btnPrimary, btnGhost, parseHistory, toEntries, mono } from './productUi';

const Product = () => {
    const [serialNumber, setSerialNumber] = useState("");

    const [name, setName] = useState("P");
    const [brand, setBrand] = useState("");
    const [description, setDescription] = useState("");
    const [history, setHistory] = useState([]);
    const [isSold, setIsSold] = useState(false);
    const [image, setImage] = useState({
        file: [],
        filepreview: null
    });
    const [profiles, setProfiles] = useState({});
    const [imageName, setImageName] = useState("");
    const [proof, setProof] = useState({ txHash: "", metadataUrl: "" });
    const [checks, setChecks] = useState({ server: false, chain: false, done: false });

    const CONTRACT_ABI = abi.abi;

    const navigate = useNavigate();
    const location = useLocation();
    const qrData = location.state?.qrData;

    useEffect(() => {
        if (qrData) {
            handleScan(qrData);
        }
        
        // Fetch profiles to map actor names to roles
        const fetchProfiles = async () => {
            try {
                const res = await axios.get(`${API_BASE}/profileAll`);
                if (res.data) {
                    const profileMap = {};
                    res.data.forEach(p => {
                        if (p.name) profileMap[p.name.toLowerCase()] = { role: p.role, image: p.image };
                    });
                    setProfiles(profileMap);
                }
            } catch (err) {
                console.error("Failed to load profiles for actor mapping", err);
            }
        };
        fetchProfiles();
    }, [qrData]);


    const getImage = async (imageName) => {
        if (!imageName) return;
        setImage(prevState => ({
            ...prevState,
            filepreview: /^https?:/.test(imageName) ? imageName : `${API_BASE}/file/product/${imageName}`
            })
        )
    }

    const handleScan = async (qrData) => {
        const hasComma = qrData.includes(",");
        const contractAddress = hasComma ? qrData.split(",")[0]?.trim() : CONTRACT_ADDRESS;
        const serial = hasComma ? qrData.split(",")[1]?.trim() : qrData.trim();
        setSerialNumber(serial || "");

        if (!contractAddress || contractAddress.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase() || !serial) {
            setChecks({ server: false, chain: false, done: true });
            return;
        }
        let chainOk = false;

        // 1) Fetch product metadata from backend server
        let serverDataLoaded = false;
        try {
            const res = await axios.get(`${API_BASE}/product/${serial}`);
            if (res.data && res.data.name) {
                setName(res.data.name || "");
                setBrand(res.data.brand || "");
                setDescription((res.data.description || "").replace(/;/g, ","));
                getImage(res.data.imageUrl || res.data.image || "");
                setImageName(res.data.image || "");
                setProof({ txHash: res.data.txHash || "", metadataUrl: res.data.metadataUrl || "" });
                serverDataLoaded = true;
            }
        } catch (serverErr) {
            console.warn("Could not fetch product from server:", serverErr?.message);
        }

        // 2) Fetch blockchain history via public RPC (read-only, no wallet needed)
        try {
            const product = await readContract().getProduct(serial.toString());
            // If server didn't have data, use blockchain data for name/brand/desc/image
            chainOk = !!product[1];
            if (!serverDataLoaded) {
                const prodName = product[1] || "";
                const prodBrand = product[2] || "";
                const prodDesc = product[3] || "";
                const prodImg = product[4] || "";
                if (prodName) {
                    setName(prodName);
                    setBrand(prodBrand);
                    setDescription(prodDesc.replace(/;/g, ","));
                    getImage(prodImg);
                    setImageName(prodImg);
                }
            }

            // Parse blockchain history (id, actor, location, timestamp, isSold)
            const parsed = parseHistory(product[5] || []);
            setIsSold(parsed.lastIsSold);
            setHistory(parsed.hist);
        } catch (bcError) {
            console.warn("Blockchain getProduct failed:", bcError?.message);
            // Server data is still shown. History will be empty if blockchain fails.
        }
        setChecks({ server: serverDataLoaded, chain: chainOk, done: true });
    };

    const handleBack = () => {
        navigate(-1)
    }

    const found = checks.server; // only products registered in the database count as authentic
    const status = !checks.done ? 'pending' : found ? 'authentic' : 'fake';
    const entries = toEntries(history, profiles);
    const known = history.filter((h) => profiles[(h.actor || '').toLowerCase()]).length;
    const ORDER = ['manufacturer', 'supplier', 'retailer'];
    let reached = 0;
    history.forEach((h) => {
        const r = (profiles[(h.actor || '').toLowerCase()] || {}).role;
        const i = ORDER.indexOf(r);
        if (i >= 0) reached = Math.max(reached, i + 1);
    });
    if (isSold) reached = 4;
    const checkList = [
        { ok: checks.chain, text: 'Registered on the Sepolia blockchain' },
        { ok: checks.server, text: 'Product record matches the manufacturer database' },
        { ok: history.length > 0, text: `${history.length} check-in${history.length === 1 ? '' : 's'} recorded along the supply chain` },
        { ok: history.length > 0 && known === history.length, text: 'Every check-in comes from a registered account' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: colors.bgPrimary, color: colors.textPrimary }}>
            <style>{`@media print { .no-print { display: none !important; } body { background: #fff !important; } }`}</style>
            <header className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px clamp(16px, 4vw, 40px)', borderBottom: `1px solid ${colors.border}` }}>
                <Logo to="/" />
                <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" style={{ ...btnGhost, minHeight: 44 }} onClick={handleBack}>Back</button>
                    <button type="button" style={{ ...btnPrimary, minHeight: 44 }} onClick={() => window.print()}>Save as PDF</button>
                </div>
            </header>
            <main style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(16px, 4vw, 40px)', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <Verdict status={status} title={status === 'fake' ? 'We could not find this product' : undefined}>
                    {status === 'authentic' && 'It was registered by its manufacturer and its journey is recorded on the blockchain.'}
                    {status === 'fake' && 'There is no record of this code. Do not trust this product, and report it to the seller.'}
                    {status === 'pending' && 'This usually takes a few seconds.'}
                </Verdict>

                {found && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 24, alignItems: 'start' }}>
                            <Card title="Product">
                                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                    <Avatar name={name} image={image.filepreview} kind="product" size={112} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                                        <span style={{ fontSize: 22, fontWeight: 800, wordBreak: 'break-word' }}>{name}</span>
                                        <span style={{ fontSize: 15, color: colors.textSecondary }}>{brand}</span>
                                    </div>
                                </div>
                                <Row k="Serial number" v={serialNumber} monoV />
                                <Row k="Description" v={description} />
                                <Row k="Status" v={isSold ? 'Sold to a customer' : 'In the supply chain'} />
                            </Card>
                            <Card title="Checks">
                                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {checkList.map((c) => (
                                        <li key={c.text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 15, lineHeight: 1.4 }}>
                                            <span aria-hidden="true" style={{ flex: 'none', width: 20, height: 20, borderRadius: '50%', marginTop: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#050507', background: c.ok ? colors.verified : colors.alert }}>{c.ok ? '\u2713' : '!'}</span>
                                            <span><span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{c.ok ? 'Passed: ' : 'Not met: '}</span>{c.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>

                        <Card title="Where it has been">
                            <div style={{ overflowX: 'auto' }}><CustodyRail reached={reached} /></div>
                            <JourneyLog entries={entries} newestFirst />
                        </Card>

                        <Card title="Blockchain proof">
                            <Row k="Contract" v={CONTRACT_ADDRESS} monoV />
                            {proof.txHash && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                                    <span style={{ fontSize: 13, color: colors.textSecondary }}>Registration transaction</span>
                                    <a href={`${EXPLORER_URL}/tx/${proof.txHash}`} target="_blank" rel="noopener noreferrer" style={{ color: colors.violetText, fontFamily: mono, fontSize: 14, wordBreak: 'break-all' }}>{proof.txHash}</a>
                                </div>
                            )}
                            <a href={`${EXPLORER_URL}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="no-print" style={{ color: colors.violetText, fontSize: 14 }}>View contract on Etherscan</a>
                            {proof.metadataUrl && <a href={proof.metadataUrl} target="_blank" rel="noopener noreferrer" className="no-print" style={{ color: colors.violetText, fontSize: 14 }}>View product metadata on IPFS</a>}
                        </Card>
                    </>
                )}
            </main>
        </div>
    )
}

export default Product;
