import { WALLETCONNECT_PROJECT_ID } from '../../config';
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig  } from '@web3modal/wagmi/react/config';
import { defineChain } from 'viem'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, bscTestnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Router from '../../components/Router'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = WALLETCONNECT_PROJECT_ID
// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const vanarChain = {
  id: 11155111,
  name: 'Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { 
      http: ['https://sepolia.infura.io/v3/']},
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
  },
}

const chains = [vanarChain, mainnet, arbitrum, bscTestnet]
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})
// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - false as default
})

function Web3ModalProvider() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}><Router /></QueryClientProvider>
    </WagmiProvider>
  )
}
export default Web3ModalProvider;