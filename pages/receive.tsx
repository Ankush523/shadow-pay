import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import Navbar from "@/components/Navbar";
import {
  SignProtocolClient,
  SpMode,
  EvmChains,
} from "@ethsign/sp-sdk";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface File {
  cid: string;
  // other properties here as needed
}

const Receive = () => {

  const [provider, setProvider] = useState<any>();
  const [signer, setSigner] = useState<any>();
   // Initialize the Ethereum client and signer
   useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethProvider);
      const ethSigner = ethProvider.getSigner();
      setSigner(ethSigner);
    }
  }, []);


  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.arbitrumSepolia,
  });

  const createAttestation = async () => {
    const createAttestationRes = await client.createAttestation({
      schemaId: "0x3d",
      data: { receiveFunds: true },
      indexingValue: "1",
    });
    console.log(createAttestationRes);
  };

  const [files, setFiles] = useState<File[]>([]);
  const [fileDetails, setFileDetails] = useState<any>({});
  const apiKey = "4285c19e.16a1a7c19c2c42ed84424c46e8ef583e";

  const contractAddress = "0x68c92f49634f41655c1D27DbAd1FC7145Cf664f3";
  const abi = [
    "function transfer(address to, uint amount) public returns (bool)",
  ];
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const withdrawAddress = "0x1e87f3F4FDBb276250fC064a3cf0069592280601";

  const getUploads = async () => {
    try {
      const response = await lighthouse.getUploads(apiKey);
      return response.data.fileList;
    } catch (error) {
      console.error("Failed to fetch files:", error);
      return [];
    }
  };

  const fetchFileDetails = async (cid: any) => {
    try {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${cid}`
      );
      const data = await response.data;
      setFileDetails((prevDetails: any) => ({
        ...prevDetails,
        [cid]: data.split(","),
      }));
    } catch (error) {
      console.error(`Failed to fetch details for CID ${cid}:`, error);
      setFileDetails((prevDetails: any) => ({
        ...prevDetails,
        [cid]: { error: "Failed to fetch data" },
      }));
    }
  };

  const fetchFiles = async () => {
    const fileList: any = await getUploads();
    setFiles(fileList);
    fileList.forEach((file: any) => {
      fetchFileDetails(file.cid);
    });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const formatAddress = (address: any) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const handleWithdraw = async (recipient: string, amount: string) => {
    try {
      await createAttestation();
      console.log(`Withdrawing ${amount} to ${recipient}`);
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
    <div className="flex flex-col text-white">
      <Navbar />
      <button
        onClick={fetchFiles}
        className="text-white font-bold px-4 rounded my-[60px] text-5xl"
      >
        Withdraw Funds
      </button>
      <div className="w-full px-[10%]">
        <label className="text-xl mb-2">Funds Received</label>
        <div className="overflow-x-auto bg-slate-950 border border-white p- rounded-lg shadow-lg mt-4">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="px-4 font-medium py-4 border-b-2 border-gray-500">SENDER</th>
                <th className="px-4 font-medium py-2 border-b-2 border-gray-500">AMOUNT</th>
                <th className="px-4 font-medium py-2 border-b-2 border-gray-500">
                  RECEIVER
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-500">
                  WITHDRAW FUNDS
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={index} className="">
                  <td className="px-4 py-2 border-b border-gray-500">
                    {fileDetails[file?.cid]
                      ? formatAddress(fileDetails[file?.cid][0])
                      : "Loading..."}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-500">
                    {fileDetails[file?.cid]
                      ? fileDetails[file?.cid][1]
                      : "Loading..."}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-500">
                    {fileDetails[file?.cid]
                      ? formatAddress(fileDetails[file?.cid][2])
                      : "Loading..."}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-500">
                    {fileDetails[file?.cid] && !fileDetails[file?.cid].error ? (
                      <button
                        onClick={() =>
                          handleWithdraw(
                            fileDetails[file?.cid][2],
                            fileDetails[file?.cid][1]
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 rounded"
                      >
                        Attest & Withdraw
                      </button>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Receive;

//4fbcf482.255304e8d361430aae0e4ed0757eb607
