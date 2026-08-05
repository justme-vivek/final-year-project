import { Box, Paper, Typography } from '@mui/material';
import heroBg from "../../img/herobg.png";
import { TextField, Button, Link } from '@mui/material';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import abi from '../../utils/Identeefi.json';
import QRCode from 'qrcode.react';
import dayjs from 'dayjs';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Geocode from "react-geocode";
import { color } from '@mui/system';
import WalletConnect from './WalletConnect';

// import pinataSDK  from "@pinata/sdk";

const getEthereumObject = () => window.ethereum;
const explorerBaseUrl = 'https://sepolia.etherscan.io/tx/';
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
            alert("Make sure you have Metamask!");
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


    const CONTRACT_ADDRESS = '0x62081f016446585cCC507528cc785980296b4Ccd';
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
        Geocode.setApiKey('AIzaSyB5MSbxR9Vuj1pPeGvexGvQ3wUel4znfYY')

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

    const handleImage = async (e) => {
        setImage({
            ...image,
            file: e.target.files[0],
            filepreview: URL.createObjectURL(e.target.files[0])
        })
    }

    const getUsername = async (e) => {
        if (!auth?.user) return;
        try {
            const res = await axios.get(`https://final-year-project-133i.onrender.com/profile/${auth.user}`);
            if (res.data && res.data.length > 0) {
                setManuName(res.data[0].name || "");
                setDbLocation(res.data[0].location || "");
            }
        } catch (err) {
            console.error("Error loading manufacturer profile details:", err);
        }
    }


    const uploadImage = async (image) => {
        const data = new FormData();
        data.append("image", image.file);

        axios.post("https://final-year-project-133i.onrender.com/upload/product", data, {
            headers: { "Content-Type": "multipart/form-data" }
        }).then(res => {
            if (res.data.success === 1) {
            }
        })
    }


    const uploadImageToIPFS = async (imageFile) => {
        // If no valid image file, skip upload
        if (!imageFile || !imageFile.name) return null;

        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            const resFile = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                maxRedirects: 0,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    pinata_api_key: '',
                    pinata_secret_api_key: ''
                }
            });
            return `https://aquamarine-accessible-takin-121.mypinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        } catch (error) {
            console.warn("Image IPFS upload skipped (no API key or network error):", error.message);
            return null; // graceful fallback â€” don't throw
        }
    }

    const uploadMetadataToIPFS = async (metadata) => {
        const jsonBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });

        const formData = new FormData();
        formData.append('file', jsonBlob, 'metadata.json');

        const API_KEY = 'fa2b19b73212285f0b63';
        const API_SECRET = '3eb7e681c6a2bf3ce1f032102cae6842a0a77dccde1afdc198dc375b3993e393';

        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

        try {
            const response = await axios.post(url, formData, {
                maxContentLength: "Infinity",
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
                    'pinata_api_key': API_KEY,
                    'pinata_secret_api_key': API_SECRET
                }
            });

            //   setIPFSHASH(response.data.IpfsHash);
            return `https://aquamarine-accessible-takin-121.mypinata.cloud/ipfs/${response.data.IpfsHash}`;

        } catch (error) {
            console.error('Error uploading to IPFS', error);
        }
    }


    const registerProduct = async (e, snapshotSerialNumber) => {
        e.preventDefault();

        try {
            // MetaMask is required â€” no alternative path
            if (!window.ethereum) {
                alert("MetaMask is required to register products on the blockchain. Please install MetaMask.");
                setLoading("");
                return;
            }

            // Request MetaMask account access
            setLoading("Requesting MetaMask account access...");
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const fromAccount = accounts[0];
            // Initialize Web3 with MetaMask provider
            const web3 = new Web3(window.ethereum);
            const productContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

            // Upload image to IPFS (optional â€” skipped if no API key)
            setLoading("Uploading image to IPFS...");
            const imageUrl = await uploadImageToIPFS(image.file);
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
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }],
                });
            } catch (switchError) {
                console.warn("Please switch MetaMask to Sepolia network:", switchError);
            }

            const receipt = await new Promise((resolve, reject) => {
                let txHash = '';
                productContract.methods
                    .registerProduct(
                        name,
                        brand,
                        snapshotSerialNumber,
                        description.replace(/,/g, ';'),
                        image.file?.name || '',
                        manuName,
                        manuLocation || dbLocation || "Manufacturer Location, Unknown",
                        manuDate.toString()
                    )
                    .send({ from: fromAccount, gas: 800000 })
                    .on('transactionHash', (hash) => {
                        txHash = hash;
                    })
                    .on('receipt', (receipt) => {
                        resolve(receipt);
                    })
                    .on('error', (error, receipt) => {
                        if (error?.message?.includes('Failed to check for transaction receipt') && txHash) {
                            console.warn("Receipt polling failed, but transaction was broadcast:", txHash);
                            resolve({ transactionHash: txHash });
                        } else {
                            reject(error);
                        }
                    });
            });

            setLoading(receipt.transactionHash);

            // Save FULL product data to MongoDB now that we have txHash
            await addProductDB({
                serialNumber: snapshotSerialNumber,
                name,
                brand,
                description,
                image: image.file?.name || '',
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
            const product = await productContract.methods
                .getProduct(snapshotSerialNumber)
                .call();
            alert("Product created and registered successfully! Please download your QR Code below.");
        } catch (error) {
            console.error("Error registering product on blockchain:", error);
            const errMsg = error?.message || "Transaction failed. Please try again.";
            setLoading("Error: " + errMsg);
            alert("Transaction Error: " + errMsg);
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
            const res = await axios.post('https://final-year-project-133i.onrender.com/addproduct',
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
            const res = await axios.get("https://final-year-project-133i.onrender.com/products/serialNumbers");
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

        // Use returned value â€” avoids React stale state closure bug
        const unique = await checkUnique();
        if (unique) {
            if (image.file?.name) uploadImage(image);
            setLoading("Connecting to blockchain...");
            // registerProduct handles DB save internally after tx confirmation (with txHash)
            await registerProduct(e, snapshotSerial);
        } else {
            setLoading("");
        }
    }

    return (
        <Box sx={{
            backgroundImage: `url(${heroBg})`,
            minHeight: "80vh",
            backgroundRepeat: "no-repeat",
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            zIndex: -2,
            overflowY: "scroll"
        }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                }}
            >
                <WalletConnect />
            </Box>
            <Paper elevation={3} sx={{ width: "400px", margin: "auto", marginTop: "10%", marginBottom: "10%", padding: "3%", backgroundColor: "#e3eefc" }}>
                <Typography
                    variant="h2"
                    sx={{
                        textAlign: "center", marginBottom: "3%",
                        fontFamily: 'Gambetta', fontWeight: "bold", fontSize: "2.5rem"
                    }}
                >
                    Add Product</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        error={!isUnique}
                        helperText={!isUnique ? "Serial Number already exists" : ""}
                        id="serial-number"
                        margin="normal"
                        label="Serial Number"
                        variant="outlined"
                        inherit="False"
                        onChange={(e) => setSerialNumber(e.target.value)}
                        value={serialNumber}
                    />

                    <TextField
                        fullWidth
                        id="product-name"
                        margin="normal"
                        label="Name"
                        variant="outlined"
                        inherit="False"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />

                    <TextField
                        fullWidth
                        id="product-brand"
                        margin="normal"
                        label="Brand"
                        variant="outlined"
                        inherit="False"
                        onChange={(e) => setBrand(e.target.value)}
                        value={brand}
                    />

                    <TextField
                        fullWidth
                        id="product-description"
                        margin="normal"
                        label="Description"
                        variant="outlined"
                        inherit="False"
                        multiline
                        minRows={2}
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    />


                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ marginTop: "3%", marginBottom: "3%" }}
                    >
                        Upload Image
                        <input
                            type="file"
                            hidden
                            onChange={handleImage}
                        />
                    </Button>

                    {image.filepreview !== null ?
                        <img src={image.filepreview} alt="preview" style={{ width: "100%", height: "100%" }} />
                        : null}

                    {qrData !== "" ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '3%' }}>
                        <QRCode
                            value={qrData}
                            size={256}
                            level={"H"}
                            includeMargin={true}
                            id="QRCode" />

                    </div> : null}

                    {qrData !== "" ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '3%' }}>
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            sx={{ marginTop: "3%", marginBottom: "3%" }}
                            onClick={downloadQR}
                        >
                            Download
                        </Button>

                    </div> : null}

                    {metadataUrl && (
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: "center", marginTop: "3%"
                            }}
                        >
                            <Link
                                href={metadataUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Metadata on IPFS
                            </Link>
                        </Typography>
                    )}


                    {
                        isUnique ? (
                            loading !== "" && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        textAlign: "center", marginTop: "3%"
                                    }}
                                >
                                    {
                                        loading.length === 66 ? (
                                            <Link href={`${explorerBaseUrl}${loading}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                See the Transaction on Block Explorer
                                            </Link>
                                        ) : loading
                                    }
                                </Typography>
                            )
                        ) : (
                            <p style={{ textAlign: 'center', color: 'red' }}>Product already exists</p>

                        )
                    }


                    <Button
                        variant="contained"
                        type="submit"
                        sx={{ width: "100%", marginTop: "3%", backgroundColor: '#98b5d5', '&:hover': { backgroundColor: '#618dbd' } }}
                        onClick={getCurrentTimeLocation}
                    >
                        Add Product
                    </Button>

                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >


                        <Button
                            onClick={handleBack}
                            sx={{
                                marginTop: "5%",
                            }}
                        >
                            Back
                        </Button>

                    </Box>

                </form>

            </Paper>


        </Box>
    );
}

export default AddProduct;