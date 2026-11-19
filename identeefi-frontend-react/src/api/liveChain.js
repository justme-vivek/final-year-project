import { CONTRACT_ADDRESS, SEPOLIA_RPC as RPC_URL, EXPLORER_URL } from "../config";
export { CONTRACT_ADDRESS, RPC_URL, EXPLORER_URL };
// Live homepage data sources: existing Render backend + public Sepolia RPC.
// Mirrors the read-only patterns already used in pages/Product.jsx and pages/ScannerPage.jsx.
import axios from "./axios";
import Web3 from "web3";
import abi from "../utils/Identeefi.json";


const publicWeb3 = () => new Web3(RPC_URL);

// Registered serial numbers from the backend (same endpoint ScannerPage checks).
export const getSerialNumbers = async () => {
  const res = await axios.get("/products/serialNumbers");
  const list = Array.isArray(res.data) ? res.data : [];
  return list.map((item) => item?.serialnumber).filter(Boolean);
};

// Product metadata (name, brand, description, image) from the backend.
export const getProductFromServer = async (serial) => {
  const res = await axios.get(`/product/${encodeURIComponent(serial)}`);
  return res.data || null;
};

// On-chain product record via public RPC — no wallet required.
export const getProductFromChain = async (serial) => {
  const web3 = publicWeb3();
  const contract = new web3.eth.Contract(abi.abi, CONTRACT_ADDRESS);
  const product = await contract.methods.getProduct(String(serial)).call();
  const rawHistory = product[5] || [];
  return {
    name: product[1] || "",
    brand: product[2] || "",
    description: (product[3] || "").replace(/;/g, ","),
    image: product[4] || "",
    history: rawHistory.map((h) => ({
      actor: h[1] ?? h.actor,
      location: h[2] ?? h.location,
      timestamp: h[3] ?? h.timestamp,
      isSold: h[4] ?? h.isSold,
    })),
  };
};

// Latest Sepolia block — real live chain data for the hero card and record panel.
export const getLatestBlock = async () => {
  const web3 = publicWeb3();
  const number = await web3.eth.getBlockNumber();
  const block = await web3.eth.getBlock(number);
  return {
    number: Number(number),
    hash: (block && block.hash) || "",
    timestamp: block && block.timestamp ? Number(block.timestamp) : null,
  };
};

export const shortHash = (hash, lead = 8, tail = 4) => {
  if (!hash) return "—";
  return hash.length > lead + tail ? `${hash.slice(0, lead)}...${hash.slice(-tail)}` : hash;
};
