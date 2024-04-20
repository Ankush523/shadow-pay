// utils/cryptoUtils.ts

import Web3 from 'web3';

export const toBlockchainAddress = (hexString: string): string => {
  return `0x${hexString}`;
};

export const generateRandomHex = (): string => {
  const randomNum = Math.floor(Math.random() * 4096);
  return Web3.utils.toHex(randomNum).slice(2).padStart(64, '0'); // Convert to hex, remove '0x', pad to length
};
