export interface CrossChainNetwork {
  id: string;
  name: string;
  chainSelector: string; // Chainlink CCIP chain selector
}

export const crossChainNetworks: CrossChainNetwork[] = [
  { id: "sepolia", name: "Sepolia Testnet", chainSelector: "16015286601757825753" },
  { id: "mumbai", name: "Polygon Mumbai", chainSelector: "12532609583862916517" },
  // Add more supported testnets as needed
]; 