import { API_BASE, CONTRACT_ADDRESS, SEPOLIA_RPC } from '../../config';
import { useLocation, useNavigate } from 'react-router-dom';
import abi from '../../utils/Identeefi.json';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { readContract } from '../../utils/chain';
import Avatar from '../shared/Avatar';
import JourneyLog from '../shared/JourneyLog';
import { PageWrap, PageHead, Card, Row, Notice, btnPrimary, btnGhost, parseHistory, toEntries } from './productUi';
import { colors } from '../../theme/tokens';

const UpdateProduct = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [suppDate, setSuppDate] = useState('');
    const [suppLatitude, setSuppLatitude] = useState("");
    const [suppLongtitude, setSuppLongtitude] = useState("");
    const [suppName, setSuppName] = useState("");
    const [suppLocation, setSuppLocation] = useState("");
    const [loading, setLoading] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [productData, setProductData] = useState("");

    const [name, setName] = useState("P");
    const [brand, setBrand] = useState("");
    const [description, setDescription] = useState("");
    const [imageName, setImageName] = useState("");
    const [history, setHistory] = useState([]);
    const [isSold, setIsSold] = useState(false);
    const [profiles, setProfiles] = useState({});

    const [image, setImage] = useState({
        file: [],
        filepreview: null
    });



    const CONTRACT_ABI = abi.abi;

    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const qrData = location.state?.qrData;

    useEffect(() => {
        if (qrData) {
            handleScan(qrData)
        }
        axios.get(`${API_BASE}/profileAll`).then((res) => {
            const m = {};
            (res.data || []).forEach((p) => { if (p.name) m[p.name.toLowerCase()] = { role: p.role, image: p.image }; });
            setProfiles(m);
        }).catch(() => {});

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
            return;
        }

        // 1) Try fetching from backend server first
        let serverDataLoaded = false;
        try {
            const res = await axios.get(`${API_BASE}/product/${serial}`);
            if (res.data && res.data.name) {
                setName(res.data.name || "");
                setBrand(res.data.brand || "");
                setDescription((res.data.description || "").replace(/;/g, ","));
                getImage(res.data.imageUrl || res.data.image || "");
                serverDataLoaded = true;
            }
        } catch (serverErr) {
            console.warn("Could not fetch product from server, trying blockchain:", serverErr?.message);
        }

        // 2) Try fetching from blockchain (for history data)
        try {
            const product = await readContract().getProduct(serial.toString());
            // If server didn't have data, use blockchain data for name/brand/desc/image
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
                }
            }

            // Parse blockchain history (id, actor, location, timestamp, isSold)
            const { hist, lastIsSold } = parseHistory(product[5] || []);
            setIsSold(lastIsSold);
            setHistory(hist);
        } catch (bcError) {
            console.warn("Blockchain getProduct failed:", bcError?.message);
            // Server data is still displayed, history will be empty.
        }
    };

    

    const handleBack = () => {
        navigate(-1)
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate('/update-product-details', { state: { qrData }});
    }

    const found = !!serialNumber && name !== 'P';
    return (
        <PageWrap max={1000}>
            <PageHead title="Product details" sub={serialNumber ? `Serial ${serialNumber}` : 'Scan a product to see its journey.'} />
            {!qrData && <Notice kind="error">No product selected. Scan a product QR code first.</Notice>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 24, alignItems: 'start' }}>
                <Card title="Product">
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <Avatar name={name} image={image.filepreview} kind="product" size={96} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                            <span style={{ fontSize: 20, fontWeight: 800, wordBreak: 'break-word' }}>{found ? name : 'Loading...'}</span>
                            <span style={{ fontSize: 14, color: colors.textSecondary }}>{brand}</span>
                        </div>
                    </div>
                    <Row k="Description" v={description} />
                    <Row k="Status" v={isSold ? 'Sold to customer' : 'In the supply chain'} />
                </Card>
                <Card title="Journey so far">
                    <JourneyLog entries={toEntries(history, profiles)} newestFirst />
                </Card>
            </div>
            {loading !== "" && <Notice>{loading}</Notice>}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button type="button" style={{ ...btnPrimary, flex: '1 1 220px' }} onClick={handleSubmit} disabled={!qrData}>Add a check-in</button>
                <button type="button" style={btnGhost} onClick={handleBack}>Back</button>
            </div>
        </PageWrap>
    )
}

export default UpdateProduct;
