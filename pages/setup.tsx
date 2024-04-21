// import Navbar from "@/components/Navbar";
// import React, { useState, FormEvent } from "react";

// interface LoginFormProps {
//   onLogin: (username: string, password: string) => void;
// }

// const Setup: React.FC<LoginFormProps> = ({ onLogin }) => {
//   const [username, setUsername] = useState<string>("");
//   const [password, setPassword] = useState<string>("");

//   const handleSubmit = (event: FormEvent) => {
//     event.preventDefault();
//     onLogin(username, password);
//   };

//   return (
//     <div className="flex flex-col justify-center">
//       <Navbar />
//       <h1 className="flex justify-center font-bold text-5xl my-14">
//         Sign In
//       </h1>
//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col p-6 w-[30%] mx-auto rounded-lg shadow border border-white"
//       >
//         <label htmlFor="username" className="mb-2 font-bold text-lg">
//           Username
//         </label>
//         <input
//           type="text"
//           id="username"
//           name="username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="mb-4 p-2 border rounded text-black"
//           required
//         />

//         <label htmlFor="password" className="mb-2 font-bold text-lg">
//           Password
//         </label>
//         <input
//           type="password"
//           id="password"
//           name="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="mb-4 p-2 border rounded text-black"
//           required
//         />

//         <button
//           type="submit"
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Log In
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Setup;

import {
  ENTRYPOINT_ADDRESS_V07,
  createSmartAccountClient,
} from "permissionless";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import {
  createPimlicoBundlerClient,
  createPimlicoPaymasterClient,
} from "permissionless/clients/pimlico";
import {
  createPublicClient,
  encodeAbiParameters,
  encodePacked,
  getContract,
  http,
  parseEther,
} from "viem";
import { sepolia } from "viem/chains";

import React, { useState } from "react";

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

export const pimlicoBundlerClient = createPimlicoBundlerClient({
  transport: http(
    "https://api.pimlico.io/v2/sepolia/rpc?apikey=4a765ec2-6362-40f7-bc61-2b52ae87b459"
  ),
  entryPoint: ENTRYPOINT_ADDRESS_V07,
});

import { privateKeyToAccount } from "viem/accounts";
import { CredentialKey } from "@passwordless-id/webauthn/dist/esm/types";
import Navbar from "@/components/Navbar";
import { ethers } from "ethers";

const signer = privateKeyToAccount(
  "0xe805da4a6e8970bd7b523b7b245f88a12918c06bbf1ca4d4d6a93cdfdfe50c57"
);

const Setup = () => {
  const [safeAddress, setSafeAddress] = useState<string>("");

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

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signerForDeposit = provider.getSigner();
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
            <button className="mt-10 bg-blue-600 p-4 rounded-xl" onClick={()=>transferFundsToSafeAcc("0.01")}>
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
      </div>
    </div>
  );
};

export default Setup;
