import { Box, Paper, Typography, Autocomplete } from '@mui/material';
import heroBg from "../../img/herobg.png";
import { TextField, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Web3 from "web3";
import axios from 'axios';
import Geocode from "react-geocode";
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import abi from '../../utils/Identeefi.json';
// import abi from '../../utils/CounterField.json';

const options = ["true", "false"]

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


    const CONTRACT_ADDRESS = '0x62081f016446585cCC507528cc785980296b4Ccd';


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

        findMetaMaskAccount().then((account) => {
            if (account !== null) {
                setCurrentAccount(account);
            }
        });
    }, [qrData]);

    useEffect(() => {
        getUsername();
        getCurrentTimeLocation();
    }, []);


    useEffect(() => {
        Geocode.setApiKey('AIzaSyB5MSbxR9Vuj1pPeGvexGvQ3wUel4znfYY')

        Geocode.fromLatLng(currLatitude, currLongtitude).then(
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

                setCurrLocation(address.replace(/,/g, ';'));
            },
            (error) => {
                console.error(error);
            }
        );

    }, [currLatitude, currLongtitude]);

    const getCurrentTimeLocation = () => {
        setCurrDate(dayjs().unix())
        navigator.geolocation.getCurrentPosition(function (position) {
            setCurrLatitude(position.coords.latitude);
            setCurrLongtitude(position.coords.longitude);
        });
    }

       

    const getUsername = async (e) => {
        if (!auth?.user) return;
        try {
            const res = await axios.get(`http://localhost:5000/profile/${auth.user}`);
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
                alert("Make sure you have MetaMask connected!");
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

            const web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];

            const productContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

            const finalName = currName || auth?.user || "Retail Store";
            const finalLocation = currLocation || dbLocation || "Retail Store, Kuala Lumpur, Malaysia";
            const finalDate = (currDate || dayjs().unix()).toString();
            const cleanSerial = serialNumber?.trim();

            if (!cleanSerial) {
                alert("Invalid or missing product Serial Number!");
                setLoading("Failed: Missing serial number.");
                return;
            }

            const registerTxn = await productContract.methods.addProductHistory(
                cleanSerial,
                finalName,
                finalLocation,
                finalDate,
                isSold
            ).send({ from: account, gas: 500000 });

            setLoading("Done! Product details updated successfully!");

            alert("Product updated successfully!");
            const targetRoute = auth?.role ? `/${auth.role}` : '/';
            navigate(targetRoute, { replace: true });
        } catch (error) {
            console.error("Transaction error:", error);
            const errMsg = error?.message || "Transaction failed or rejected.";
            setLoading(`Transaction Error: ${errMsg}`);
            alert(`Transaction Error: ${errMsg}`);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading("Please pay the transaction fee to update the product details...")
        await updateProduct(e);


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

            <Paper elevation={3} sx={{ width: "400px", margin: "auto", marginTop: "10%", marginBottom: "10%", padding: "3%", backgroundColor: "#e3eefc" }}>

                <Typography
                    variant="h2"
                    sx={{
                        textAlign: "center", marginBottom: "3%",
                        fontFamily: 'Gambetta', fontWeight: "bold", fontSize: "2.5rem"
                    }}
                >
                    Update Product Details</Typography>

                    <TextField
                        fullWidth
                        id="outlined-disabled"
                        margin="normal"
                        label="Serial Number"
                        disabled

                        value={serialNumber}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Name"
                        value={currName}
                        onChange={(e) => setCurrName(e.target.value)}
                        placeholder="Enter Store / Company Name"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Location"
                        multiline
                        minRows={2}
                        value={currLocation.replace(/;/g, ",")}
                        onChange={(e) => setCurrLocation(e.target.value)}
                        placeholder="Enter Address / Location"
                    />

{auth.role === 'supplier' ? null :
<Autocomplete
                    disablePortal
                    disableClearable
                    id="combo-box-demo"
                    options={options}
                    fullWidth
                    value={isSold ? 'true' : 'false'}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(event, newValue) => {
                        if (newValue !== null && newValue !== undefined) {
                            setIsSold(newValue === 'true');
                        }
                    }}
                    renderInput={(params) =>
                        <TextField {...params}
                            fullWidth
                            id="outlined-basic"
                            margin="normal"
                            label="Is Sold?"
                            variant="outlined"
                        />
                        
                    }
                />
}

                    <TextField
                        fullWidth
                        id="outlined-disabled"
                        margin="normal"
                        label="Date"
                        disabled

                        value={dayjs(currDate * 1000).format("MMMM D, YYYY h:mm A")}
                    />

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
                    
                
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >

                        <Button
                            variant="contained"
                            type="submit"
                            onClick={handleSubmit}
                            sx={{ textAlign: "center", width: "50%", marginTop: "3%", backgroundColor: '#98b5d5', '&:hover': { backgroundColor: '#618dbd' } }}
                            >
                            Update Product
                        </Button>
                    </Box>



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
            </Paper>
        </Box>
    )
}

export default UpdateProductDetails;