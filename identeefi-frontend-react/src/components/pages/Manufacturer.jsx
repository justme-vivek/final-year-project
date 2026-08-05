import '../../css/Role.css';
import { Button } from '../Button';
import { createWeb3Modal, useWeb3Modal } from '@web3modal/wagmi/react';
import React, { useState, useEffect } from 'react';
import { Box, Button as MuiButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import WalletConnect from './WalletConnect';
import { arbitrum, mainnet, polygon, sepolia, bscTestnet } from 'wagmi/chains';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { Link, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import useAuth from '../../hooks/useAuth';
// import { useDisconnect } from 'wagmi';
const projectId = '7236c984a38479e85f91b945bd9076a8';
if (!projectId) {
  throw new Error("Please provide project id");
}

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const vanarChain = {
  id: 11155111,
  name: 'Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { 
      http: ['https://sepolia.infura.io/v3/'] 
    },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
  },
};

const chains = [mainnet, arbitrum, polygon, sepolia, vanarChain, bscTestnet];
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableEmail: true
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  allowUnsupportedChain: true,
  themeMode: 'dark',
  enableAnalytics: true,
  enableOnramp: true
});

const getEthereumObject = () => window.ethereum;

const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();
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


const Manufacturer = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  // const {disconnect} = useDisconnect();
  const { open } = useWeb3Modal();
  const { isConnected, address ,isConnecting} = useAccount({ config });
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  
  const [connected,setConnected] =  useState(false);
  useEffect(() => {
    const storedStatus = sessionStorage.getItem('walletConnected');
    setConnected(storedStatus === 'true');
  }, []);

  useEffect(() => {
    sessionStorage.setItem('walletConnected', connected.toString());
  }, [connected]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('walletConnected');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('walletConnected');
    sessionStorage.removeItem('auth');
    setAuth({});
    setConnected(false);
    setCurrentAccount('');
    navigate('/login');
  };

  
  useEffect(() => {
    // console.log("open",open);
  }, [isConnected,isConnecting]);
    useEffect(() => {
    console.log('open function:', open); // Log the open function
  }, [open]);

  // const handleDisconnect = () => {
  //   disconnect();
  //   setCurrentAccount(''); // Clear the current account state
  // };
  useEffect(() => {
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        setCurrentAccount(account);
        setConnected(true);
      }
    });
  }, []);

  useEffect(() => {
    if (isConnected) {
      setConnected(true);
    }
  }, [isConnected]);

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
     await open();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      setConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileClick = () => {
    if (connected) {
      navigate('/profile');
    }else{
      alert("Pls connect to your wallet first")
    }
  };

  const handleAddProductClick = () => {
    if (connected) {
      navigate('/add-product');
    }else{
      alert("Pls connect to your wallet first")
    }
  };

  const handleProductsClick = () => {
    navigate('/products');
  };


  useEffect(() => {
  }, [currentAccount]);

  return (
    <div className="role-container">
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
        }}
      >
      </Box>
      <div className="role-container-box">
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
          }}
        >
          <MuiButton onClick={handleLogout} href="/login" endIcon={<LogoutIcon />}>Logout</MuiButton>
        </Box>
        <h2>Welcome:</h2>
        <h1>Manufacturer</h1>
        {/* <Link to={isConnected ? "/profile": "#"}> */}
        <div>

          <Button className="btns" buttonStyle='btn--long' buttonSize='btn--large'disabled={!connected} onClick={handleProfileClick}
          >Check Profile</Button>
          </div>
        {/* </Link> */}
        <div>
          <Button className="btns" buttonStyle='btn--long' buttonSize='btn--large' disabled={!connected} onClick={handleAddProductClick}>Add Product</Button>
        </div>
        <div>
          <Button className="btns" buttonStyle='btn--long' buttonSize='btn--large' onClick={handleProductsClick}>View Products</Button>
        </div>
        <WalletConnect onClick={connectWallet} />

      </div>
    </div>
  );
};

export default Manufacturer;