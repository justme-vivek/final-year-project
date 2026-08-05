// Dummy types to satisfy Router/index.jsx and other legacy files
// (Staking and reward contracts are not used in the core Anti-Counterfeit Product flow)

export const ChainContracts: Record<number, any> = {
  5: {}, // Goerli
  78600: {}, // Vanar
  31337: {}, // Hardhat
  11155111: {}, // Sepolia
  97: {} // BSC
};

export const AvailableContracts: any = {};

export interface ChainParams {
  chainId: number;
}

export const addressToFactoryMapping = (params: ChainParams): any => {
  return {};
};
