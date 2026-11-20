import { API_BASE, CONTRACT_ADDRESS, EXPLORER_URL, GOOGLE_MAPS_KEY } from '../../config';
import { useEffect, useState } from 'react';
import { writeContract, readContract, sendWithGas } from '../../utils/chain';
import axios from 'axios';
import abi from '../../utils/Identeefi.json';
import QRCode from 'qrcode.react';
import { pinFile, pinJson } from '../../utils/pinata';
import QrModal from '../shared/QrModal';
import dayjs from 'dayjs';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Geocode from "react-geocode";
import WalletConnect from './WalletConnect';
import PhotoUploader from '../shared/PhotoUploader';
import TxProgress from '../shared/TxProgress';
import { colors } from '../../theme/tokens';
import { PageWrap, PageHead, Card, Field, Notice, Row, btnPrimary, btnGhost, inputStyle, mono } from './productUi';

const getEthereumObject = () => window.ethereum;

/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
const findMetaMaskAccount = async () => {
    try {
        const ethereum = getEthereumObject();

        /*
        * First make sure we have access to the Ethereum object.
        */
        if (!ethereum) {
            console.error("Make sure you have Metamask!");
            return null;
        }

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
            const account = accounts[0];
            return account;
        } else {
            console.error("No authorized account found");
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};


const AddProduct = () => {

    const [currentAccount, setCurrentAccount] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [description, setDescription] = useState("");
    //expiry
    const [timeInDays, setTimeInDays] = useState("");
    const [image, setImage] = useState({
        file: [],
        filepreview: null
    });
    const [qrData, setQrData] = useState('');
    const [qrOpen, setQrOpen] = useState(false);
    const [manuDate, setManuDate] = useState('');
    const [manuLatitude, setManuLatitude] = useState("");
    const [manuLongtitude, setManuLongtitude] = useState("");
    const [manuName, setManuName] = useState("");
    const [loading, setLoading] = useState("");
    const [manuLocation, setManuLocation] = useState("");
    const [dbLocation, setDbLocation] = useState("");
    const [isUnique, setIsUnique] = useState(true);
    const [fileImg, setFileImg] = useState(null);

    const [metadataUrl, setMetadataUrl] = useState('');
    const [step, setStep] = useState(-1);
    const [txError, setTxError] = useState('');
    const [txHash, setTxHash] = useState('');
    const [done, setDone] = useState(false);


    const contractABI = abi.abi;

    const { auth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        findMetaMaskAccount().then((account) => {
            if (account !== null) {
                setCurrentAccount(account);
            }
        });
        getUsername();
        getCurrentTimeLocation();
    }, []);

    useEffect(() => {
        Geocode.setApiKey(GOOGLE_MAPS_KEY)

        Geocode.fromLatLng(manuLatitude, manuLongtitude).then(
            (response) => {
                const address = response.results[0].formatted_address;
                let city, state, country;
                for (let i = 0; i < response.results[0].address_components.length; i++) {
                    for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
                        switch (response.results[0].address_components[i].types[j]) {
                            case "locality":
                                city = response.results[0].address_components[i].long_name;
                                break;
                            case "administrative_area_level_1":
                                state = response.results[0].address_components[i].long_name;
                                break;
                            case "country":
                                country = response.results[0].address_components[i].long_name;
                                break;
                        }
                    }
                }
                setManuLocation(address.replace(/,/g, ';'));
            },
            (error) => {
                console.error(error);
            }
        );

    }, [manuLatitude, manuLongtitude]);

    const generateQRCode = async (serialNumber) => {
        const data = CONTRACT_ADDRESS + ',' + serialNumber
        setQrData(data);
    }

    const downloadQR = () => {
        const canvas = document.getElementById("QRCode");
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${serialNumber}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Redirect to dashboard
        const targetRoute = auth?.role ? `/${auth.role}` : '/';
        navigate(targetRoute, { replace: true });
    };


    const handleBack = () => {
        navigate(-1)
    }

    const handleImage = (file) => {
        setImage({
            file: file || [],
            filepreview: file ? URL.createObjectURL(file) : null
        })
    }

    const getUsername = async (e) => {
        if (!auth?.user) return;
        try {
            const res = await axios.get(`${API_BASE}/profile/${auth.user}`);
            if (res.data && res.data.length > 0) {
                setManuName(res.data[0].name || "");
                setDbLocation(res.data[0].location || "");
            }
        } catch (err) {
            console.error("Error loading manufacturer profile details:", err);
        }
    }


    const uploadMetadataToIPFS = async (metadata) => {
        try {
            return await pinJson(metadata);
        } catch (error) {
            console.error('Error uploading metadata to IPFS', error);
            return '';
        }
    }


    const registerProduct = async (e, snapshotSerialNumber) => {
        e.preventDefault();

        try {
            // MetaMask is required — no alternative path
            if (!window.ethereum) {
                setTxError("MetaMask is required to register products. Install MetaMask and try again.");
                setLoading("");
                return;
            }

            // Request MetaMask account access
            setLoading("Requesting MetaMask account access...");
            setStep(0);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const fromAccount = accounts[0];

            // Upload image to IPFS (optional — skipped if no API key)
            setLoading("Uploading image to IPFS...");
            const imageUrl = image.file?.name ? await pinFile(image.file) : '';
            // Upload metadata to IPFS
            setLoading("Uploading metadata to IPFS...");
            const metadata = {
                name,
                brand,
                serialNumber: snapshotSerialNumber,
                description,
                image: imageUrl || '',
                manuName,
                manuLocation,
                manuDate: manuDate.toString()
            };
            const metaUrl = await uploadMetadataToIPFS(metadata);
            if (metaUrl) setMetadataUrl(metaUrl);
            // Send blockchain transaction via Web3 + MetaMask
            setLoading("Please confirm the transaction in MetaMask...");
            setStep(1);
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }],
                });
            } catch (switchError) {
                console.warn("Please switch MetaMask to Sepolia network:", switchError);
            }

            const productContract = writeContract();
            const tx = await sendWithGas(productContract, 'registerProduct', [
                name,
                brand,
                snapshotSerialNumber,
                description.replace(/,/g, ';'),
                (imageUrl || '').split('/ipfs/')[1] || imageUrl || '', // store only the short IPFS id on-chain: less storage, less gas
                manuName,
                manuLocation || dbLocation || "Manufacturer Location, Unknown",
                manuDate.toString(),
            ]);
            setStep(2);
            let receipt = { transactionHash: tx.hash };
            try {
                receipt = await tx.wait();
            } catch (waitErr) {
                // If the receipt check fails after the transaction was broadcast, keep going with its hash.
                if (waitErr?.code === 'CALL_EXCEPTION' || waitErr?.receipt?.status === 0) throw waitErr;
                console.warn("Receipt polling failed, but transaction was broadcast:", tx.hash);
            }

            setLoading(receipt.transactionHash);
            setTxHash(receipt.transactionHash);
            setStep(3);

            // Save FULL product data to MongoDB now that we have txHash
            await addProductDB({
                serialNumber: snapshotSerialNumber,
                name,
                brand,
                description,
                image: imageUrl || '',
                imageUrl: imageUrl || '',
                metadataUrl: metaUrl || '',
                manuName,
                manuLocation: manuLocation || dbLocation || "Manufacturer Location, Unknown",
                manuDate: manuDate.toString(),
                txHash: receipt.transactionHash,
                registeredBy: auth?.user || ''
            });

            // Generate QR code after successful blockchain registration
            generateQRCode(snapshotSerialNumber);

            // Read back the registered product from blockchain
            await readContract().getProduct(snapshotSerialNumber);
            setStep(4);
            setDone(true);
        } catch (error) {
            console.error("Error registering product on blockchain:", error);
            const errMsg = error?.message || "Transaction failed. Please try again.";
            setLoading("");
            setTxError(errMsg);
        }
    }

    const getCurrentTimeLocation = () => {
        setManuDate(dayjs().unix())
        navigator.geolocation.getCurrentPosition(function (position) {
            setManuLatitude(position.coords.latitude);
            setManuLongtitude(position.coords.longitude);
        });
    }

    // Save full product data to MongoDB
    const addProductDB = async (productData) => {
        try {
            const res = await axios.post(`${API_BASE}/addproduct`,
                JSON.stringify(productData),
                { headers: { 'Content-Type': 'application/json' } }
            );
        } catch (err) {
            console.error('Error saving product to MongoDB:', err);
        }
    }

    // Returns true if serial number is unique, false otherwise
    const checkUnique = async () => {
        try {
            const res = await axios.get(`${API_BASE}/products/serialNumbers`);
            if (res.data && Array.isArray(res.data)) {
                const existingSerialNumbers = res.data.map((product) => product.serialnumber);
                const duplicates = existingSerialNumbers.filter((item) => item === serialNumber);
                const unique = duplicates.length === 0;
                setIsUnique(unique);
                return unique; // return result directly to avoid stale closure
            }
            return true;
        } catch (err) {
            console.error("Error checking serial number uniqueness:", err);
            return true; // allow submission if check fails
        }
    }



    const handleSubmit = async (e) => {
        e.preventDefault();

        // Snapshot serial number to avoid stale closure issues
        const snapshotSerial = serialNumber;

        // Use returned value — avoids React stale state closure bug
        const unique = await checkUnique();
        if (unique) {
            setTxError('');
            setDone(false);
            setStep(0);
            setLoading("Connecting to blockchain...");
            // registerProduct handles DB save internally after tx confirmation (with txHash)
            await registerProduct(e, snapshotSerial);
        } else {
            setLoading("");
        }
    }

    const busy = step >= 0 && step < 4 && !txError;
    return (
        <PageWrap max={1000}>
            <PageHead
                title="Add product"
                sub="Register a product on the blockchain and get its QR code."
                right={<WalletConnect />}
            />
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 24, alignItems: 'start' }}>
                <Card title="Product details">
                    <Field label="Serial number" id="serial-number" error={!isUnique ? 'This serial number already exists. Use a different one.' : ''}>
                        <input id="serial-number" required style={inputStyle} value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
                    </Field>
                    <Field label="Name" id="product-name">
                        <input id="product-name" required style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
                    </Field>
                    <Field label="Brand" id="product-brand">
                        <input id="product-brand" required style={inputStyle} value={brand} onChange={(e) => setBrand(e.target.value)} />
                    </Field>
                    <Field label="Description" id="product-description">
                        <textarea id="product-description" rows={3} style={{ ...inputStyle, padding: 12, resize: 'vertical' }} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </Field>
                </Card>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
                    <Card title="Product photo">
                        <PhotoUploader label="Photo" kind="product" file={image.file && image.file.name ? image.file : null} onChange={handleImage} />
                    </Card>

                    {(step >= 0 || txError) && (
                        <Card title="Registration">
                            <TxProgress
                                steps={['Connect wallet', 'Confirm in wallet', 'Record on blockchain', 'Save product']}
                                current={step < 0 ? 0 : step}
                                error={txError || undefined}
                            />
                            {loading && !txHash && !txError && <Notice>{loading}</Notice>}
                            {txError && <Notice kind="error">{txError}</Notice>}
                            {txHash && (
                                <a href={`${EXPLORER_URL}/tx/${txHash}`} target="_blank" rel="noopener noreferrer" style={{ color: colors.violetText, fontFamily: mono, fontSize: 13, wordBreak: 'break-all' }}>
                                    View transaction {txHash.slice(0, 10)}...{txHash.slice(-6)}
                                </a>
                            )}
                            {metadataUrl && <a href={metadataUrl} target="_blank" rel="noopener noreferrer" style={{ color: colors.violetText, fontSize: 14 }}>View metadata on IPFS</a>}
                        </Card>
                    )}

                    {qrData !== '' && (
                        <Card title="Your QR code">
                            <Notice kind="success">Product registered. Download the QR code and attach it to the product.</Notice>
                            <button type="button" onClick={() => setQrOpen(true)} aria-label="Enlarge QR code" title="Click to enlarge" style={{ alignSelf: 'center', background: '#fff', padding: 8, borderRadius: 12, maxWidth: '100%', border: 0, cursor: 'zoom-in' }}>
                                <QRCode value={qrData} size={220} level="H" includeMargin={true} id="QRCode" style={{ maxWidth: '100%', height: 'auto' }} />
                            </button>
                            <span style={{ alignSelf: 'center', fontSize: 13, color: colors.textSecondary }}>Click the QR code to enlarge it.</span>
                            {qrOpen && <QrModal serial={serialNumber} name={name} onClose={() => setQrOpen(false)} />}
                            <Row k="Serial number" v={serialNumber} monoV />
                            <button type="button" style={btnPrimary} onClick={downloadQR}>Download QR code</button>
                        </Card>
                    )}

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <button type="submit" disabled={busy || done} style={{ ...btnPrimary, flex: '1 1 200px', opacity: busy || done ? 0.6 : 1 }} onClick={getCurrentTimeLocation}>
                            {busy ? 'Registering...' : 'Add product'}
                        </button>
                        <button type="button" style={{ ...btnGhost, flex: '0 0 auto' }} onClick={handleBack}>Back</button>
                    </div>
                </div>
            </form>
        </PageWrap>
    );
}

export default AddProduct;
