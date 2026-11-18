import React from 'react'
import { Grid } from '@mui/material'
import { ButtonContainer, Container, LogoContainer } from './styles'

import { ConnectionType } from '../../connection'
import WalletButtons from '../../components/WalletButtons'
import { useLocation } from 'react-router-dom'

const Navbar = () => {
  const { pathname } = useLocation()

  return (
    <Container container xs={10} md={11} alignSelf={'center'} mb={2}>

      <ButtonContainer
        container
        xs={12}
        md={6}
      >
        <WalletButtons
          wallets={[ConnectionType.INJECTED, ConnectionType.WALLET_CONNECT]}
        />
      </ButtonContainer>
    </Container>
  )
}

export default Navbar
