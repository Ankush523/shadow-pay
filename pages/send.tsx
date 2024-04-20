import React, { useState } from "react";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import crypto from "crypto";
import Navbar from "./Navbar";

interface SendTokenProps {
  contractAddress: string;
  abi: any;
}

declare global {
  interface Window {
    ethereum: any;
  }
}

const apiKey = "4285c19e.16a1a7c19c2c42ed84424c46e8ef583e";
const name = "shikamaru"; //Optional

const SendToken: React.FC<SendTokenProps> = () => {
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(
    null
  );
  const [encryptedAddress, setEncryptedAddress] = useState("");
  const [truncatedEncryptedAddress, setTruncatedEncryptedAddress] =
    useState("");

  const encryptPublicAddress = async (publicAddress: any) => {
    // Generate a random number
    const randomNumber = crypto.randomBytes(32).toString("hex");

    // Create a cipher using AES-256-CBC algorithm
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      randomNumber.slice(0, 32),
      Buffer.from(randomNumber.slice(32), "hex")
    );

    // Encrypt the public address
    let encrypted = cipher.update(publicAddress, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Ensure the encrypted address has a maximum length of 40 characters (20 bytes)
    setTruncatedEncryptedAddress(`0x${encrypted.slice(0, 40)}`);
    console.log(truncatedEncryptedAddress);
    // Set the encrypted address and the random number
    setEncryptedAddress(
      `${truncatedEncryptedAddress}:${encrypted}:${randomNumber}`
    );
    console.log(encryptedAddress);
    // // Set the encrypted address and the random number
    // setEncryptedAddress(`${encrypted}:${randomNumber}`);
  };

  const contractAddress = "0x49D9494f1CEaa172D32dB6485ebAE24038840b4D";
  const abi = [
    "function transfer(address to, uint256 value) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
  ];

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setSigner(signer);
      setConnected(true);
    } catch (error) {
      console.error("Error connecting to MetaMask", error);
      alert("Failed to connect MetaMask. Make sure MetaMask is installed.");
    }
  };

  // Handle token transfer
  const sendTokens = async () => {
    if (!signer) return;
    await encryptPublicAddress(recipient);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.transfer(
      truncatedEncryptedAddress,
      ethers.utils.parseUnits(amount, "18")
    );
    const receipt = await tx.wait();
    const transferEvent = receipt.events?.filter(
      (event: any) => event.event === "Transfer"
    );
    console.log(transferEvent);
    if (transferEvent && transferEvent.length > 0) {
      const eventText = `Transfer event: ${JSON.stringify(
        transferEvent[0].args
      )}`;
      const fromAddress = transferEvent[0].args.from;
      const toAddress = transferEvent[0].args.to;
      const valueFromEvent = ethers.utils.formatEther(
        transferEvent[0].args.value
      );
      console.log(valueFromEvent);
      const text = `${fromAddress},${valueFromEvent},${toAddress}`;
      storeEventOnLighthouse(text);
    }
    alert(`Transaction successful! Hash: ${tx.hash}`);
  };

  const storeEventOnLighthouse = async (eventData: string) => {
    try {
      await lighthouse.uploadText(eventData, apiKey, name);
      console.log("Data stored on Lighthouse:", eventData);
    } catch (error) {
      console.error("Failed to store data on Lighthouse:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <Navbar />
      <h1 className="flex justify-center font-bold text-5xl my-14">
        Send Tokens
      </h1>
      <div className="flex flex-col mx-[35%] p-8 rounded-lg justify-center border border-white ">
        <label className="flex mb-2">{`Recipient's Address`}</label>
        <input
          type="text"
          className="h-[50px] bg-gray-800 px-4 rounded-md mb-10 text-black"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient Address"
        />
        <label className="flex mb-2">Select token</label>
        <select className="h-[50px] bg-gray-800 px-4 rounded-md mb-10">
          <option value="ETH">ETH</option>
          <option value="DAI">DAI</option>
          <option value="USDC">USDC</option>
        </select>
        <label className="flex mb-2">Amount</label>
        <input
          type="number"
          className="h-[50px] bg-gray-800 px-4 rounded-md mb-10"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount to Send"
        />
        <button className="bg-blue-600 p-3 rounded-md" onClick={sendTokens}>Send Tokens</button>
      </div>
    </div>
  );
};

export default SendToken;
