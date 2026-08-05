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
import useAuth from '../../hooks/useAuth';
import Web3 from "web3";


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

    const [image, setImage] = useState({
        file: [],
        filepreview: null
    });

    const CONTRACT_ADDRESS = '0x62081f016446585cCC507528cc785980296b4Ccd';


    const CONTRACT_ABI = abi.abi;

    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const qrData = location.state?.qrData;

    useEffect(() => {
        findMetaMaskAccount().then((account) => {
            if (account !== null) {
                setCurrentAccount(account);
            }
        });

        if (qrData) {
            handleScan(qrData)
        }

    }, [qrData]);

    const getImage = async (imageName) => {
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

        // 1) Try fetching from backend server first
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
            console.warn("Could not fetch product from server, trying blockchain:", serverErr?.message);
        }

        // 2) Try fetching from blockchain (for history data)
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

            // Parse blockchain history — deployed struct: id, actor, location, timestamp (string), isSold
            const rawHistory = product[5] || [];
            const hist = [];
            let lastIsSold = false;
            for (let i = 0; i < rawHistory.length; i++) {
                const h = rawHistory[i];
                const actor = h.actor || h[1] || "";
                const location = (h.location || h[2] || "").replace(/;/g, ",");
                const timestamp = h.timestamp || h[3] || "0";
                const tsNum = Number(timestamp);
                
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


    const getHistory = () => {
        return history.map((item, index) => {
            const date = dayjs(item.timestamp * 1000).format('MM/DD/YYYY');
            const time = dayjs(item.timestamp * 1000).format('HH:mm a');

            // if (item.isSold) {
            //     setIsSold(true);
            // }

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
                        <Typography>Actor: {item.actor}</Typography>
                    </TimelineContent>
                </TimelineItem>
            );
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();;

        navigate('/update-product-details', { state: { qrData }});
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
                                {/* Product Name */}

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

                    {loading === "" ? null
                        : <Typography
                            variant="body2"
                            sx={{
                                textAlign: "center", marginTop: "3%"
                            }}
                        >
                            {loading}
                        </Typography>
                    }

                    <Button
                        variant="contained"
                        type="submit"
                        sx={{ width: "50%", marginTop: "3%", backgroundColor: '#98b5d5', '&:hover': { backgroundColor: '#618dbd' } }}
                        onClick={handleSubmit}
                    >
                        Update Product
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



                </Box>
            </Paper>
        </Box>
    )
}

export default UpdateProduct;