import { WALLETCONNECT_PROJECT_ID } from '../../config';
import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism } from 'wagmi/chains'
import { injected, safe, walletConnect } from 'wagmi/connectors'

const projectId = WALLETCONNECT_PROJECT_ID

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})