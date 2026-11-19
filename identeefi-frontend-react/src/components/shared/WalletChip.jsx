import React from 'react';
import { useAccount } from 'wagmi';
import { colors } from '../../theme/tokens';

// props: none. Shows the connected wallet short address, or "No wallet". Safe if wagmi provider is missing.
const Inner = () => {
  const { address, isConnected } = useAccount();
  return (
    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: colors.textSecondary, border: `1px solid ${colors.border}`, borderRadius: 100, padding: '4px 12px' }}>
      {isConnected && address ? `${address.slice(0, 6)}…${address.slice(-4)}` : 'No wallet'}
    </span>
  );
};
class Safe extends React.Component {
  state = { bad: false };
  static getDerivedStateFromError() { return { bad: true }; }
  render() { return this.state.bad ? null : this.props.children; }
}
const WalletChip = () => <Safe><Inner /></Safe>;
export default WalletChip;
