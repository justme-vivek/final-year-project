import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Container, CircularProgress } from '@mui/material';
import { ArrowLeft, Scan, Link as LinkIcon } from 'lucide-react';
import QrScanner from '../QrScanner';
import useAuth from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion";

const ScannerPage = () => {
    const CONTRACT_ADDRESS = '0x62081f016446585cCC507528cc785980296b4Ccd';
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
                const res = await axios.get('https://final-year-project-133i.onrender.com/products/serialNumbers');
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

    const textFieldStyles = {
        "& .MuiOutlinedInput-root": {
            color: "#F2F0F8",
            backgroundColor: "#15151D",
            borderRadius: "10px",
            "& fieldset": { borderColor: "rgba(255,255,255,0.10)" },
            "&:hover fieldset": { borderColor: "rgba(109,74,255,0.45)" },
            "&.Mui-focused fieldset": {
                borderColor: "#6D4AFF",
                boxShadow: "0 0 12px rgba(109,74,255,0.2)",
            },
        },
        "& .MuiInputLabel-root": { color: "#706C7A" },
        "& .MuiInputLabel-root.Mui-focused": { color: "#6D4AFF" },
        "& input::placeholder": { color: "#706C7A", opacity: 0.8 },
    };

    return (
        <Box sx={{
            minHeight: "100vh",
            bgcolor: "#050507",
            fontFamily: "'Manrope', sans-serif",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 8,
            px: 2
        }}>
            <Container maxWidth="sm">
                <Button 
                    onClick={handleBack} 
                    sx={{ color: "#A5A1B2", mb: 4, textTransform: "none", "&:hover": { color: "#F2F0F8" } }}
                >
                    <ArrowLeft size={18} style={{ marginRight: 8 }} /> Back
                </Button>

                <Box
                    sx={{
                        bgcolor: "#101016",
                        border: "1px solid rgba(255,255,255,0.10)",
                        borderRadius: "24px",
                        p: { xs: 4, sm: 6 },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    {isVerifying ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 0" }}>
                            <CircularProgress size={60} sx={{ color: "#6D4AFF", mb: 4 }} />
                            <Typography variant="h5" sx={{ color: "#F2F0F8", fontWeight: 600, mb: 1 }}>
                                Verifying Blockchain Record
                            </Typography>
                            <Typography sx={{ color: "#A5A1B2" }}>
                                Securely checking the ledger...
                            </Typography>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Box sx={{ p: 2, bgcolor: "rgba(109,74,255,0.1)", borderRadius: "50%", mb: 3 }}>
                                <Scan size={32} color="#6D4AFF" />
                            </Box>
                            
                            <Typography variant="h4" sx={{ color: "#F2F0F8", fontWeight: 700, mb: 1 }}>
                                Scan QR Code
                            </Typography>
                            <Typography sx={{ color: "#A5A1B2", textAlign: "center", mb: 5 }}>
                                Position the product's QR code in the frame to verify its authenticity.
                            </Typography>

                            <Box sx={{ 
                                width: "100%", 
                                maxWidth: "300px", 
                                borderRadius: "16px", 
                                overflow: "hidden", 
                                border: "2px solid rgba(109,74,255,0.45)",
                                mb: 5
                            }}>
                                <QrScanner passData={passData} />
                            </Box>

                            <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                                <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(255,255,255,0.10)" }} />
                                <Typography sx={{ color: "#706C7A", fontSize: "12px", fontWeight: 600, letterSpacing: "1px" }}>OR ENTER MANUALLY</Typography>
                                <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(255,255,255,0.10)" }} />
                            </Box>

                            <Box component="form" onSubmit={handleManualSubmit} sx={{ width: "100%" }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Enter Serial Number (e.g. SN-WEB3-001)"
                                    value={manualInput}
                                    onChange={(e) => setManualInput(e.target.value)}
                                    sx={{ ...textFieldStyles, mb: 2 }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    sx={{
                                        bgcolor: "#6D4AFF",
                                        color: "#F2F0F8",
                                        py: 1.5,
                                        borderRadius: "10px",
                                        fontWeight: 600,
                                        fontSize: "16px",
                                        textTransform: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 1.5,
                                        "&:hover": { bgcolor: "#4F23F8" },
                                    }}
                                >
                                    <LinkIcon size={18} />
                                    Verify Manual Input
                                </Button>
                            </Box>
                        </motion.div>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default ScannerPage;