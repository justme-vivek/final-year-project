import { WALLETCONNECT_PROJECT_ID } from '../../config';
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
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

// Only the networks this app uses. Extra or duplicate chains slow the connection down and cause network-switch prompts.
export const chains = [sepolia, mainnet]
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
    themeMode:'dark',
    enableAnalytics: false,
    enableOnramp: false
  })
}

function WalletConnect() {
  // The modal button handles connecting by itself. Do not also request accounts from the wallet here,
  // because two requests at once make MetaMask answer "Connection declined".
  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <w3m-button size="md" balance="hide" />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default WalletConnect;
