import { ConnectionType } from '../connection'
import { getConnection } from '../connection'
import { useMemo } from 'react'
import { useAppSelector } from '.'
const SELECTABLE_WALLETS = [
  ConnectionType.INJECTED,
  ConnectionType.WALLET_CONNECT,
]

export default function useOrderedConnections() {
  const selectedWallet = useAppSelector(state => state?.wallet?.selectedWallet)
  return useMemo(() => {
    const orderedConnectionTypes = []
    if (selectedWallet) {
      orderedConnectionTypes.push(selectedWallet)
    }
    orderedConnectionTypes.push(
      ...SELECTABLE_WALLETS.filter(wallet => wallet !== selectedWallet),
    )
    return orderedConnectionTypes.map(getConnection)
  }, [selectedWallet])
}
