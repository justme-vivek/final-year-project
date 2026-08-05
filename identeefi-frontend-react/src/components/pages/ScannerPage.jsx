import { Box, Paper, Avatar, Typography, Button, TextField } from '@mui/material';
import heroBg from "../../img/herobg.png";
import QrScanner from '../QrScanner';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ScannerPage = () => {
    const CONTRACT_ADDRESS = '0x62081f016446585cCC507528cc785980296b4Ccd';
    const [qrData, setQrData] = useState('');
    const [manualInput, setManualInput] = useState('');

    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const passData = (data) => {
        if (data) {
            setQrData(data);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (!manualInput.trim()) return;
        let formattedData = manualInput.trim();
        if (!formattedData.includes(',')) {
            formattedData = `${CONTRACT_ADDRESS},${formattedData}`;
        }
        setQrData(formattedData);
    };

    useEffect(() => {
        if (!qrData) return;
        const verifyProductExists = async (serial) => {
            if (!serial || !serial.toString().trim()) return false;
            const cleanSerial = serial.toString().trim();

            // Check MongoDB for this serial number
            try {
                const res = await axios.get('http://localhost:5000/products/serialNumbers');
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

            // If not in DB, we can't reliably check blockchain because getProduct reverts
            // for valid products due to the expire_timestamp bug in the contract.
            // Return false — only DB-registered products are treated as genuine.
            return false;
        };

        const verifyAndNavigate = async () => {
            const hasComma = qrData.includes(",");
            const contractAddress = hasComma ? qrData.split(",")[0]?.trim() : CONTRACT_ADDRESS;
            const serial = hasComma ? qrData.split(",")[1]?.trim() : qrData.trim();

            if (!contractAddress || contractAddress.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase() || !serial) {
                navFakeProduct();
                return;
            }

            const exists = await verifyProductExists(serial);
            if (!exists) {
                console.warn("Product not found in DB! Redirecting to fake-product.");
                navFakeProduct();
                return;
            }

            // If this is an update action from a logged-in supplier/retailer, go to update flow
            const isUpdateAction = location.state?.action === 'update';
            if (isUpdateAction && auth?.user && (auth?.role === "supplier" || auth?.role === "retailer")) {
                navRole();
            } else {
                // For everyone else (public users, logged-in users just scanning), go straight to product details
                navProduct();
            }
        };

        verifyAndNavigate();
    }, [qrData]);

    const navRole = () => {
        navigate('/update-product', { state: { qrData }});
    }

    const navProduct = () => {
        // Navigate directly to product page — no wallet gate needed for viewing
        navigate('/product', { state: { qrData }});
    }

    const navFakeProduct = () => {
        navigate('/fake-product');
    }

    const handleBack = () => {
        navigate(-1)
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
            zIndex: -2,
            overflowY: "scroll"
        }}>
            <Paper elevation={3} sx={{ width: "420px", margin: "auto", marginTop: "8%", marginBottom: "10%", padding: "3%", backgroundColor: "#e3eefc" }}>
                <Box sx={{ textAlign: "center", marginBottom: "5%" }}>
                    <Typography
                        variant="h2"
                        sx={{
                            textAlign: "center", marginBottom: "3%",
                            fontFamily: 'Gambetta', fontWeight: "bold", fontSize: "2.3rem"
                        }}
                    >
                        Scan QR Code
                    </Typography>

                    <QrScanner passData={passData}/>

                    <Typography variant="body2" sx={{ my: 2, color: "#555", fontWeight: 600 }}>
                        — OR ENTER PRODUCT SERIAL NUMBER / QR CODE —
                    </Typography>
                    <form onSubmit={handleManualSubmit}>
                        <TextField
                            fullWidth
                            size="small"
                            variant="outlined"
                            placeholder="e.g. SN-WEB3-001"
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                            sx={{ mb: 1, backgroundColor: "#fff" }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: "#0F1B4C",
                                color: "#fff",
                                py: 1,
                                fontWeight: 600,
                                "&:hover": { backgroundColor: "#1c2b6b" }
                            }}
                        >
                            Verify Product
                        </Button>
                    </form>

                    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                        <Button
                            onClick={handleBack}
                            sx={{ marginTop: "4%" }}
                        >
                            Back
                        </Button>
                    </Box>    
                </Box>
            </Paper>
        </Box>
    )
}

export default ScannerPage;