// src/constants/networks.ts
interface Network {
  id: number;
  name: string;
}

export const RSK_NETWORKS: Network[] = [
  {
    id: 30,
    name: "RSK Mainnet",
  },
  {
    id: 31,
    name: "RSK Testnet",
  },
];