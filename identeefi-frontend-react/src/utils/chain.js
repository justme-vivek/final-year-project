import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, SEPOLIA_RPC } from '../config';
import abi from './Identeefi.json';

// Read-only contract over the public Sepolia RPC. No wallet needed.
export const readContract = () =>
  new ethers.Contract(CONTRACT_ADDRESS, abi.abi, new ethers.providers.JsonRpcProvider(SEPOLIA_RPC));

// Contract that signs with the user's wallet (MetaMask). Call after the wallet is on Sepolia.
export const writeContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  return new ethers.Contract(CONTRACT_ADDRESS, abi.abi, provider.getSigner());
};
