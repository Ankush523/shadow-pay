import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { useSmartAccount } from "@/contexts/SmartAccountContext";

const Navbar = () => {
  const { smartAccountAddress } = useSmartAccount();

  const formatAddress = (address: any) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <div className="flex flex-row justify-around my-4">
      <label className="text-3xl text-blue-600 font-bold">Shadow Pay</label>
      <div className="flex flex-row space-x-4">
        {smartAccountAddress && 
        <div className="bg-white text-black font-bold text-center py-2 px-2 rounded-xl">
          Smart Acc: {formatAddress(smartAccountAddress)}
        </div>
        }
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;
