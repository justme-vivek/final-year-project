import React, { FC, useCallback, useEffect, useState } from 'react'
import {defaultWagmiConfig }from "@web3modal/wagmi"
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia,polygon,arbitrum } from 'wagmi/chains'
import { createWeb3Modal ,useWeb3Modal} from '@web3modal/wagmi/react'
import { WagmiProvider } from 'wagmi'
import { injected, safe, walletConnect } from 'wagmi/connectors';
import  {WagmiConfig} from 'wagmi'
import { Connector } from '@web3-react/types'
import {
  ConnectionType,
  getConnection,
} from '../../connection'
import { useAppDispatch } from '../../hooks'
import { setSelectedWallet } from '../../redux/slices/walletSlice'
import { useWeb3React } from '@web3-react/core'
import GoldButton from '../../components/Buttons/GoldButton.jsx'
import OutlinedButton from '../../components/Buttons/OutlinedButton.jsx'
import { shortenAddress } from '../../utils'
import Toast from '../modals/Toast'
import { styled, Button } from '@mui/material'
import ConnectWalletModal from '../modals/ConnectWalletModal'

import { useAccount } from 'wagmi'

const projectId ='02199594d20a19c660e1e9df699e0800';
const metadata = {
  name: 'Web3Modal RN',
  description: 'Web3Modal RN Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com'
  }
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
const chains = [mainnet, polygon, arbitrum, vanarChain] 

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})

export const config = createConfig({
  chains: [mainnet, sepolia, vanarChain],
  connectors: [
    injected(),
    walletConnect({projectId}),
    safe()
  ],
  transports: {
    [mainnet.id]: http('https://mainnet.infura.io/v3/'),
    [sepolia.id]: http(),
    [polygon.id]: http('https://polygon-rpc.com'),
    [vanarChain.id]: http('https://sepolia.infura.io/v3/')
  },
})
 const ButtonsContainer = styled('div', {
  shouldForwardProp: prop => prop !== 'fullWidth',
})(({ theme, fullWidth }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent:  'center',
  width: fullWidth ? '100%' : 'auto',
}))


 const ConnectWalletButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'fullWidth',
})(({ theme, fullWidth }) => ({
  borderRadius: '100px',
  width: fullWidth ? '100%' : 200,
  height: 50,
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'initial',
  background: '#03D9AF',
  color: '#101010',
}))



const WalletButtons = (props) => {
  const { open, close } = useWeb3Modal()
  const { address, isConnecting, isDisconnected, isConnected } = useAccount()

  const [modalOpen, setModalOpen] = useState(false)

  const { account, connector } = useWeb3React()

  const [showConnectWalletModal, setShowConnectWalletModal] = useState(false)

  const dispatch = useAppDispatch()

  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const connectionType = sessionStorage.getItem('connection-type')
    if (connectionType) {
      const connector = getConnection(
        connectionType ,
      ).connector

      tryActivation(connector)
    }
  }, [])

  const tryActivation = useCallback(
    async (connector) => {
      const connectionType = getConnection(connector).type
      sessionStorage.setItem('connection-type', connectionType)

      try {
        await connector.activate()
        dispatch(setSelectedWallet(connectionType))
      } catch (error) {
        console.error(`web3-react connection error: ${error}`)
      }
    },
    [dispatch],
  )

  useEffect(() => {
  }, [isConnected])

  function onDisconnectClick() {
    sessionStorage.removeItem('connection-type')
    sessionStorage.removeItem('account')
    sessionStorage.removeItem('signature')

    connector.deactivate && connector.deactivate()
    connector.resetState && connector.resetState()
  }

  const handleDisconnectWallet = () => {
    close()
  }

  return (
    <>


 
      <ButtonsContainer fullWidth={props.fullWidth ? true: false}>
        {address ? (      <ConnectWalletButton 
            onClick={() => {
              open()
            }}
           >Connect Wallet</ConnectWalletButton>) : shortenAddress(address.toLowerCase(), 4, 8)}
      </ButtonsContainer>
      <Toast
        open={modalOpen}
        setOpen={setModalOpen}
        message="Address copied to clipboard"
      />

      <ConnectWalletModal
        open={showConnectWalletModal}
        setOpen={setShowConnectWalletModal}
        wallets={ConnectionType?.wallets}
      />


    </>
  )
}

export default WalletButtons;
