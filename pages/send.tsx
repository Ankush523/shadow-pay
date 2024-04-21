import React, { useState } from "react";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import crypto from "crypto";
import Navbar from "@/components/Navbar";
import {
  ENTRYPOINT_ADDRESS_V07,
  UserOperation,
  bundlerActions,
  createSmartAccountClient,
  getSenderAddress,
  signUserOperationHashWithECDSA,
} from "permissionless";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import {
  createPimlicoBundlerClient,
  createPimlicoPaymasterClient,
} from "permissionless/clients/pimlico";
import {
  Address,
  Hex,
  createClient,
  createPublicClient,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  getContract,
  http,
  parseEther,
} from "viem";
import { arbitrumSepolia, sepolia } from "viem/chains";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { pimlicoBundlerActions } from "permissionless/actions/pimlico";

interface SendTokenProps {
  contractAddress: string;
  abi: any;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const publicClient = createPublicClient({
  transport: http("https://rpc.ankr.com/arbitrum_sepolia"),
});

export const paymasterClient = createPimlicoPaymasterClient({
  transport: http(
    "https://api.pimlico.io/v2/421614/rpc?apikey=4a765ec2-6362-40f7-bc61-2b52ae87b459"
  ),
  entryPoint: ENTRYPOINT_ADDRESS_V07,
});

const bundlerClient = createClient({
  transport: http(
    "https://api.pimlico.io/v2/421614/rpc?apikey=4a765ec2-6362-40f7-bc61-2b52ae87b459"
  ),
  chain: arbitrumSepolia,
})
  .extend(bundlerActions(ENTRYPOINT_ADDRESS_V07))
  .extend(pimlicoBundlerActions(ENTRYPOINT_ADDRESS_V07));

export const pimlicoBundlerClient = createPimlicoBundlerClient({
  transport: http(
    "https://api.pimlico.io/v2/421614/rpc?apikey=4a765ec2-6362-40f7-bc61-2b52ae87b459"
  ),
  entryPoint: ENTRYPOINT_ADDRESS_V07,
});

const SIMPLE_ACCOUNT_FACTORY_ADDRESS =
  "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985";

const ownerPrivateKey = generatePrivateKey();
const owner = privateKeyToAccount(ownerPrivateKey);

console.log("Generated wallet with private key:", ownerPrivateKey);

const apiKey = "4285c19e.16a1a7c19c2c42ed84424c46e8ef583e";
const name = "shikamaru"; //Optional

const SendToken: React.FC<SendTokenProps> = () => {
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
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

  const contractAddress = "0x68c92f49634f41655c1D27DbAd1FC7145Cf664f3";
  const abi = [
    "function transfer(address to, uint256 value) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
  ];

  // Handle token transfer
  const sendTokens = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setSigner(signer);
    await encryptPublicAddress(recipient);
    console.log("Encrypted address:", encryptedAddress);
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

  const createUserOp = async () => {
    await encryptPublicAddress(recipient);
    console.log("Encrypted address:", encryptedAddress);
    const factory = SIMPLE_ACCOUNT_FACTORY_ADDRESS;
    const factoryData = encodeFunctionData({
      abi: [
        {
          inputs: [
            { name: "owner", type: "address" },
            { name: "salt", type: "uint256" },
          ],
          name: "createAccount",
          outputs: [{ name: "ret", type: "address" }],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      args: [owner.address, 0n],
    });

    console.log("Generated factoryData:", factoryData);

    const senderAddress = await getSenderAddress(publicClient, {
      factory,
      factoryData,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
    });
    console.log("Calculated sender address:", senderAddress);

    const to : any = truncatedEncryptedAddress; // vitalik
    const weiValue = ethers.utils.parseUnits(amount.toString(), '18');
    const value = BigInt(weiValue.toString());;
    const data = "0x68656c6c6f"; // "hello" encoded to utf-8 bytes

    const callData = encodeFunctionData({
      abi: [
        {
          inputs: [
            { name: "dest", type: "address" },
            { name: "value", type: "uint256" },
            { name: "func", type: "bytes" },
          ],
          name: "execute",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      args: [to, value, data],
    });

    console.log("Generated callData:", callData);

    const gasPrice = await bundlerClient.getUserOperationGasPrice();

    const userOperation = {
      sender: senderAddress,
      nonce: 0n,
      factory: factory as Address,
      factoryData,
      callData,
      maxFeePerGas: gasPrice.fast.maxFeePerGas,
      maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
      // dummy signature, needs to be there so the SimpleAccount doesn't immediately revert because of invalid signature length
      signature:
        "0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c" as Hex,
    };

    const sponsorUserOperationResult =
      await paymasterClient.sponsorUserOperation({
        userOperation,
      });

    const sponsoredUserOperation: UserOperation<"v0.7"> = {
      ...userOperation,
      ...sponsorUserOperationResult,
    };

    console.log(
      "Received paymaster sponsor result:",
      sponsorUserOperationResult
    );

    const signature = await signUserOperationHashWithECDSA({
      account: owner,
      userOperation: sponsoredUserOperation,
      chainId: arbitrumSepolia.id,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
    });
    sponsoredUserOperation.signature = signature;

    console.log("Generated signature:", signature);

    const userOperationHash = await bundlerClient.sendUserOperation({
      userOperation: sponsoredUserOperation,
    });

    console.log("Received User Operation hash:", userOperationHash);

    // let's also wait for the userOperation to be included, by continually querying for the receipts
    console.log("Querying for receipts...");
    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOperationHash,
    });
    const txHash = receipt.receipt.transactionHash;
    alert(`Transaction successful! Hash: ${txHash}`);

    console.log(
      `UserOperation included: https://sepolia.arbiscan.io/tx/${txHash}`
    );
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
          className="h-[50px] bg-gray-800 px-4 rounded-md mb-10 text-white"
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
          className="h-[50px] bg-gray-800 px-4 rounded-md mb-10 text-white"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount to Send"
        />
        <div className="flex justify-around">
          <button
            className="bg-blue-600 p-3 w-[45%] rounded-md"
            onClick={sendTokens}
          >
            Send from EOA
          </button>
          <button className="bg-blue-600 w-[45%] p-3 rounded-md" onClick={createUserOp}>
            Send from Smart Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendToken;
