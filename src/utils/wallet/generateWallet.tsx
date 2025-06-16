import { ethers } from "ethers";

export const generateWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  return wallet;
};

export const generateWalletFromSeed = (seed: string) => {
  const wallet = ethers.Wallet.fromPhrase(seed);
  return wallet;
};

export const generateWalletFromPrivateKey = (privateKey: string) => {
  const wallet = new ethers.Wallet(privateKey);
  return wallet;
};


