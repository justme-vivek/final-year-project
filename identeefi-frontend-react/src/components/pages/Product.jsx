import { Box, Paper, Avatar, Typography, Button } from '@mui/material';
import heroBg from "../../img/herobg.png";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import abi from '../../utils/Identeefi.json';
import axios from 'axios';

import { useEffect, useState } from 'react';
import Web3 from "web3";


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

    const CONTRACT_ADDRESS = '0x62081f016446585cCC507528cc785980296b4Ccd';
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
                const res = await axios.get('https://final-year-project-133i.onrender.com/profileAll');
                if (res.data) {
                    const profileMap = {};
                    res.data.forEach(p => {
                        if (p.name) profileMap[p.name.toLowerCase()] = p.role;
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
            filepreview: `https://final-year-project-133i.onrender.com/file/product/${imageName}`
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

        // 1) Fetch product metadata from backend server
        let serverDataLoaded = false;
        try {
            const res = await axios.get(`https://final-year-project-133i.onrender.com/product/${serial}`);
            if (res.data && res.data.name) {
                setName(res.data.name || "");
                setBrand(res.data.brand || "");
                setDescription((res.data.description || "").replace(/;/g, ","));
                getImage(res.data.image || "");
                serverDataLoaded = true;
            }
        } catch (serverErr) {
            console.warn("Could not fetch product from server:", serverErr?.message);
        }

        // 2) Fetch blockchain history via public RPC (read-only, no wallet needed)
        try {
            const publicWeb3 = new Web3('https://ethereum-sepolia-rpc.publicnode.com');
            const productContract = new publicWeb3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            const product = await productContract.methods.getProduct(serial.toString()).call();
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

            // Parse blockchain history â€” deployed struct has: id, actor, location, timestamp (string), isSold
            parseAndSetHistory(product[5] || []);
        } catch (bcError) {
            console.warn("Blockchain getProduct failed:", bcError?.message);
            // Server data is still shown. History will be empty if blockchain fails.
        }
    };

    const parseAndSetHistory = (rawHistory) => {
        const hist = [];
        let lastIsSold = false;
        for (let i = 0; i < rawHistory.length; i++) {
            const h = rawHistory[i];
            const actor = h.actor || h[1] || "";
            const location = (h.location || h[2] || "").replace(/;/g, ",");
            // timestamp is a string at index 3 in the deployed contract
            const timestamp = h.timestamp || h[3] || "0";
            const tsNum = Number(timestamp);
            // isSold is at index 4 in the deployed 5-field struct
            // Web3 may return it as boolean, string "true"/"false", or BigInt
            let isSoldVal = false;
            const rawSold = h.isSold !== undefined ? h.isSold : h[4];
            if (typeof rawSold === 'boolean') {
                isSoldVal = rawSold;
            } else if (typeof rawSold === 'string') {
                isSoldVal = rawSold.toLowerCase() === 'true';
            } else if (typeof rawSold === 'bigint') {
                isSoldVal = rawSold !== 0n;
            } else {
                isSoldVal = !!rawSold;
            }
            lastIsSold = isSoldVal;
            hist.push({ actor, location, timestamp: tsNum, isSold: isSoldVal });
        }
        // Set the overall isSold from the LAST history entry
        setIsSold(lastIsSold);
        setHistory(hist);
    };

    const handleBack = () => {
        navigate(-1)
    }


    const getHistory = () => {
        return history.map((item, index) => {
            const date = dayjs(item.timestamp * 1000).format('MM/DD/YYYY');
            const time = dayjs(item.timestamp * 1000).format('HH:mm a');

            return (
                <TimelineItem key={index}>
                    <TimelineOppositeContent color="textSecondary">
                        {time} {date}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography>Location: {item.location}</Typography>
                        <Typography>
                            {(() => {
                                const role = profiles[item.actor?.toLowerCase()];
                                if (role) {
                                    const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
                                    return `${capitalizedRole}: ${item.actor}`;
                                }
                                return `Actor: ${item.actor}`;
                            })()}
                        </Typography>
                    </TimelineContent>
                </TimelineItem>
            );
        });
    }


    return (
        <Box sx={{
            backgroundImage: `url(${heroBg})`,
            minHeight: "80vh",
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
            <Paper elevation={3} sx={{ width: "400px", margin: "auto", marginTop: "10%", marginBottom: "10%", padding: "3%", backgroundColor: "#e3eefc" }}>

                <Typography
                    variant="body2"
                    sx={{
                        textAlign: "center", marginTop: "3%"
                    }}
                >

                    Your Product is Authentic!</Typography>
                <Box
                    sx={{
                        textAlign: "center", marginBottom: "5%",
                    }}
                >

                    <Typography
                        variant="h2"
                        sx={{
                            textAlign: "center", marginBottom: "3%",
                            fontFamily: 'Gambetta', fontWeight: "bold", fontSize: "2.5rem"
                        }}
                    >
                        Product Details</Typography>

                    <Box
                        sx={{
                            display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 1, width: '100%',
                            marginTop: '5%', marginBottom: '5%'
                        }}
                    >
                        <Box
                            sx={{
                                marginRight: '1.5%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', flex: '0 0 35%', width: '35%'
                            }}
                        >
                            <Avatar
                                alt={name}
                                src={image.filepreview}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    margin: "auto",
                                    marginBottom: "3%",
                                    backgroundColor: "#3f51b5"
                                }}
                            >
                                {name}


                            </Avatar>

                        </Box>
                        <Box
                            sx={{
                                marginLeft: '1.5%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'left', flex: '0 0 65%', width: '65%'
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    textAlign: "left", marginBottom: "5%",
                                }}
                            >
                                {name}

                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    textAlign: "left", marginBottom: "3%",
                                }}
                            >
                                Serial Number: {serialNumber}
                            </Typography>


                            <Typography
                                variant="body2"
                                sx={{
                                    textAlign: "left", marginBottom: "3%",
                                }}
                            >
                                Description: {description}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    textAlign: "left", marginBottom: "3%",
                                }}
                            >
                                Brand: {brand}
                            </Typography>

                        </Box>

                    </Box>

                    <Timeline
                        sx={{
                            [`& .${timelineOppositeContentClasses.root}`]: {
                                flex: 0.2,
                            },
                        }}
                    >
                        {getHistory()}
                        <TimelineItem>
                            <TimelineOppositeContent color="textSecondary">
                                {dayjs().format('HH:mm a')} {dayjs().format('MM/DD/YYYY')}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Typography>IsSold: {isSold.toString()}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                    </Timeline>



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



                </Box>
            </Paper>
        </Box>
    )
}

export default Product;