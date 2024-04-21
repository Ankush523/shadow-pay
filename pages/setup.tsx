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
import { sepolia } from "viem/chains";
import React, { useEffect, useState } from "react";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { CredentialKey } from "@passwordless-id/webauthn/dist/esm/types";
import Navbar from "@/components/Navbar";
import { ethers } from "ethers";
import { pimlicoBundlerActions } from "permissionless/actions/pimlico";
import { client } from "@passwordless-id/webauthn";
import { useSmartAccount } from "@/contexts/SmartAccountContext";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const publicClient = createPublicClient({
  transport: http("https://rpc.ankr.com/eth_sepolia"),
});

export const paymasterClient = createPimlicoPaymasterClient({
  transport: http(
    "https://api.pimlico.io/v2/sepolia/rpc?apikey=4a765ec2-6362-40f7-bc61-2b52ae87b459"
  ),
  entryPoint: ENTRYPOINT_ADDRESS_V07,
});

const bundlerClient = createClient({
  transport: http(
    "https://api.pimlico.io/v2/sepolia/rpc?apikey=4a765ec2-6362-40f7-bc61-2b52ae87b459"
  ),
  chain: sepolia,
})
  .extend(bundlerActions(ENTRYPOINT_ADDRESS_V07))
  .extend(pimlicoBundlerActions(ENTRYPOINT_ADDRESS_V07));

export const pimlicoBundlerClient = createPimlicoBundlerClient({
  transport: http(
    "https://api.pimlico.io/v2/sepolia/rpc?apikey=4a765ec2-6362-40f7-bc61-2b52ae87b459"
  ),
  entryPoint: ENTRYPOINT_ADDRESS_V07,
});

const SIMPLE_ACCOUNT_FACTORY_ADDRESS =
  "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985";

const ownerPrivateKey = generatePrivateKey();
const owner = privateKeyToAccount(ownerPrivateKey);

console.log("Generated wallet with private key:", ownerPrivateKey);
const signer = privateKeyToAccount(
  "0xe805da4a6e8970bd7b523b7b245f88a12918c06bbf1ca4d4d6a93cdfdfe50c57"
);

const Setup = () => {

  const { setSmartAccountAddress } = useSmartAccount();
  const [safeAddress, setSafeAddress] = useState<string>("");
  const [provider, setProvider] = useState<any>();
  const [signerForDeposit, setSignerForDeposit] = useState<any>();

   // Initialize the Ethereum client and signer
   useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethProvider);
      const ethSigner = ethProvider.getSigner();
      setSignerForDeposit(ethSigner);
    }
  }, []);

  const createUserOp = async () => {
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

    const to = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // vitalik
    const value = 0n;
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
      chainId: sepolia.id,
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

    console.log(
      `UserOperation included: https://sepolia.etherscan.io/tx/${txHash}`
    );

    alert(`UserOperation included with txn hash ${txHash}`);
  };

  const createSafeAccount = async () => {
    const safeAccount = await signerToSafeSmartAccount(publicClient, {
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      signer: signer,
      // saltNonce: 0n, // optional
      safeVersion: "1.4.1",
      // address: "0x...", // optional, only if you are using an already created account
    });

    console.log(safeAccount.address);

    setSafeAddress(safeAccount.address);
    setSmartAccountAddress(safeAccount.address);

    const smartAccountClient = createSmartAccountClient({
      account: safeAccount,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      chain: sepolia,
      bundlerTransport: http(
        "https://api.pimlico.io/v2/sepolia/rpc?apikey=4a765ec2-6362-40f7-bc61-2b52ae87b459"
      ),
      middleware: {
        gasPrice: async () =>
          (await pimlicoBundlerClient.getUserOperationGasPrice()).fast, // use pimlico bundler to get gas prices
        sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
      },
    });

    console.log(smartAccountClient);

    // const txHash = await smartAccountClient.sendTransaction({
    //   to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    //   value: parseEther("0.0001"),
    // })

    // console.log(txHash)
  };

  const contractAddress = "0x49D9494f1CEaa172D32dB6485ebAE24038840b4D";
  const abi = [
    "function transfer(address to, uint amount) public returns (bool)",
  ];
  const contract = new ethers.Contract(contractAddress, abi, signerForDeposit);
  const withdrawAddress = safeAddress;

  const transferFundsToSafeAcc = async (amount: string) => {
    try {
      console.log(`Transferring ${amount} to ${safeAddress}`);
      const tx = await contract.transfer(
        withdrawAddress,
        ethers.utils.parseUnits(amount, "18")
      );
      await tx.wait();
      alert("Withdraw successful!");
    } catch (error) {
      console.error("Withdraw failed:", error);
      alert("Withdraw failed!");
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <Navbar />
      <div className="flex flex-col justify-center items-center my-14">
        <label className="font-bold text-5xl mb-10">Safe Account</label>
        {safeAddress ? (
          <div className="flex flex-col border border-white p-10 w-[35%] text-center bg-slate-950 text-white rounded-xl">
            <label className="text-lg mb-2">Your Safe Acc Addr :</label>
            <label className="text-green-600 text-xl">{safeAddress}</label>
            <button
              className="mt-10 bg-blue-600 p-4 rounded-xl"
              onClick={() => transferFundsToSafeAcc("0.01")}
            >
              Deposit Funds
            </button>
          </div>
        ) : (
          <button
            className="border border-white p-10 w-[30%] text-blue-600 bg-slate-950 text-xl rounded-xl"
            onClick={createSafeAccount}
          >
            Get your Safe Account
          </button>
        )}
        <button
          className="border border-white p-10 w-[30%] text-blue-600 bg-slate-950 text-xl rounded-xl mt-10"
          onClick={createUserOp}
        >
          Send sample User Operation
        </button>
      </div>
    </div>
  );
};

export default Setup;
