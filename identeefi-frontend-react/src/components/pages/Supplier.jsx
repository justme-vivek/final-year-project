import '../../css/Role.css'
import { Button } from '../Button';
import { Link ,useNavigate} from 'react-router-dom';
import { Box, Button as Btn } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState, useEffect } from 'react';
import WalletConnect from './WalletConnect';
import { config } from './WalletConnect';
import { useAccount } from 'wagmi';
import useAuth from '../../hooks/useAuth';

const getEthereumObject = () => window.ethereum;

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

const Supplier = () => {

    const [currentAccount, setCurrentAccount] = useState("");
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

  const handleProfileClick = () => {
    if (connected) {
      navigate('/profile');
    }else{
      alert("Pls connect to your wallet first")
    }
  };

  const handleUpdateProduct = () => {
    if (connected) {
      navigate('/scanner', { state: { action: 'update' } });
    }else{
      alert("Pls connect to your wallet first")
    }
  };

  const handleProductsClick = () => {
    navigate('/products');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('walletConnected');
    sessionStorage.removeItem('auth');
    setAuth({});
    setConnected(false);
    setCurrentAccount('');
    navigate('/login');
  };


  

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

    return (
        <div className="role-container">
            <div className="role-container-box">
                <Box
                    sx={{                        
                        position: 'absolute',
                        top: 20,
                        right: 20,
                    }}
                >
                    <Btn onClick={handleLogout} href="/login" endIcon={<LogoutIcon />}>Logout</Btn>                    
                </Box>


                <h2>Welcome:</h2>
                <h1>Supplier</h1>
                <div>

                    <Button className="btns" buttonStyle='btn--long' buttonSize='btn--large' disabled={!connected} onClick={handleProfileClick}>Check Profile</Button>
               </div>
                 <div>

                    <Button className="btns" buttonStyle='btn--long' buttonSize='btn--large' disabled={!connected} onClick={handleUpdateProduct}>Update Product</Button>
                  </div>
                 <div>
                    <Button className="btns" buttonStyle='btn--long' buttonSize='btn--large' onClick={handleProductsClick}>View Products</Button>
                  </div>
               <WalletConnect onClick={connectWallet}/>
                {/* {!currentAccount && (
                    <Button className="btns" buttonStyle='btn--long' buttonSize='btn--large' onClick={connectWallet}>Connect Wallet</Button>
                )} */}
            </div>
        </div>
    );
}

export default Supplier;