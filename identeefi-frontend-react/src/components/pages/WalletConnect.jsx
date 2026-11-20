import { WALLETCONNECT_PROJECT_ID } from '../../config';
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, polygon, sepolia,bscTestnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = WALLETCONNECT_PROJECT_ID
// 2. Create wagmiConfig
const metadata = {
  name: 'AuthentiScan',
  description: 'Check where a product has been, recorded on the blockchain',
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
  icons: []
}

const vanarChain = {
  id: 11155111,
  name: 'Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { 
      http: ['https://ethereum-sepolia-rpc.publicnode.com']},
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
  },
}

export const chains = [mainnet, arbitrum,polygon,sepolia,vanarChain,bscTestnet]
export const config = defaultWagmiConfig({
  chains,
  ...(projectId ? { projectId } : {}),
  metadata,
  enableEmail: false
 // Optional - Override createConfig parameters
})

// 3. Create modal
if (projectId) {
  createWeb3Modal({
    wagmiConfig: config,
    projectId,
    allowUnsupportedChain: true,
    defaultChain: sepolia,
    themeMode:'dark',
    enableAnalytics: false,
    enableOnramp: false
  })
}

function WalletConnect() {
  // The modal button handles connecting by itself. Do not also request accounts from the wallet here,
  // because two requests at once make MetaMask answer "Connection declined".
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <w3m-button size="md" balance="hide" />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default WalletConnect;
