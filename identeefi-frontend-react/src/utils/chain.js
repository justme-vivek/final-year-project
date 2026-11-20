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

// Sends a transaction with a gas limit worked out for this exact call (plus a 30% margin) instead of a fixed number.
// A fixed limit can run out on longer inputs, and the transaction then fails on-chain and still costs gas.
export const sendWithGas = async (contract, method, args) => {
  let gasLimit;
  try {
    const estimate = await contract.estimateGas[method](...args);
    gasLimit = estimate.mul(130).div(100);
  } catch (err) {
    // The call would revert, so stop before the wallet asks the user to pay for a failing transaction.
    if (err?.code === 'UNPREDICTABLE_GAS_LIMIT' || err?.code === 'CALL_EXCEPTION') {
      throw new Error('The blockchain rejected this transaction before sending. Check the details and that you are on Sepolia.');
    }
    gasLimit = ethers.BigNumber.from(1500000); // estimate unavailable (network hiccup): use a generous limit
  }
  return contract[method](...args, { gasLimit });
};
