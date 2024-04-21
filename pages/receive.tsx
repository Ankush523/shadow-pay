// import React, { useEffect, useState } from 'react';
// import { ethers } from 'ethers';

// // Props to specify the contract address and Ethereum network provider URL
// interface TokenEventProps {
//   contractAddress: string;
//   providerUrl: string;
// }

// // Type for storing transfer event data
// type TransferEvent = {
//   from: string;
//   to: string;
//   amount: string;
// };

// const Receive: React.FC<TokenEventProps> = () => {
//     const [transfers, setTransfers] = useState<TransferEvent[]>([]);
//     const contractAddress = '0x49D9494f1CEaa172D32dB6485ebAE24038840b4D';
//     const providerUrl = 'https://sepolia.infura.io/v3/358f5ae5bc804b81ad74ce87a3682743';
//     useEffect(() => {
//         const provider = new ethers.providers.JsonRpcProvider(providerUrl);
//         const contract = new ethers.Contract(contractAddress, [
//             // ABI for the Transfer event
//             "event Transfer(address indexed from, address indexed to, uint256 value)"
//         ], provider);

//         // Listening to the Transfer events emitted by the contract
//         const onTransfer = (from: string, to: string, amount: ethers.BigNumber) => {
//             console.log(`Transfer from ${from} to ${to} amount ${amount.toString()}`);
//             setTransfers(prevTransfers => [
//                 ...prevTransfers,
//                 { from, to, amount: ethers.utils.formatEther(amount) }
//             ]);
//         };

//         contract.on('Transfer', onTransfer);

//         return () => {
//             // Clean up the event listener when the component unmounts
//             contract.off('Transfer', onTransfer);
//         };
//     }, [contractAddress, providerUrl]);

//     return (
//         <div>
//             <h1>Token Transfers</h1>
//             <ul>
//                 {transfers.map((transfer, index) => (
//                     <li key={index}>
//                         {`${transfer.from} transferred ${transfer.amount} tokens to ${transfer.to}`}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default Receive;

// //4285c19e.16a1a7c19c2c42ed84424c46e8ef583e

// import React, { useEffect, useState } from 'react';
// import { ethers } from 'ethers';
// import lighthouse from '@lighthouse-web3/sdk';
// import axios from 'axios';

// // Props to specify the contract address and Ethereum network provider URL
// interface TokenEventProps {
//   contractAddress: string;
//   providerUrl: string;
// }

// // Type for storing transfer event data
// type TransferEvent = {
//   from: string;
//   amount: string;
//   to: string;
// };

// const Receive: React.FC<TokenEventProps> = () => {
//   const [transfers, setTransfers] = useState<TransferEvent[]>([]);
//   const [transfersFromLighthouse, setTransfersFromLighthouse] = useState<any>();
//   const [transfersToLighthouse, setTransfersToLighthouse] = useState<any>();
//   const [transfersValueLighthouse, setTransfersValueLighthouse] = useState<any>();
//   const contractAddress = '0x49D9494f1CEaa172D32dB6485ebAE24038840b4D';
//   const providerUrl = 'https://sepolia.infura.io/v3/358f5ae5bc804b81ad74ce87a3682743';
//   const apiKey = '4285c19e.16a1a7c19c2c42ed84424c46e8ef583e';
//   const name = 'shikamaru';

//   const getUploads = async() =>{
//     const response = await lighthouse.getUploads(apiKey)
//     console.log(response.data.fileList[0].cid)
//     return response.data.fileList[2].cid;
//   }

//   useEffect(() => {
//     const cid = getUploads();
//     console.log(cid);
//     const fetchTransfersFromLighthouse = async () => {
//       try {
//         const res = await axios.get(`https://gateway.lighthouse.storage/ipfs/${cid}`,{
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//         },
//       })
//         console.log(res.data);
//           const [from, amount, to] = res.data.split(',');
//           setTransfersFromLighthouse(
//             from
//           );
//           setTransfersToLighthouse(
           
//             to
//           );
//           setTransfersValueLighthouse(
//             amount
//           );
//       } catch (error) {
//         console.error('Failed to fetch data from Lighthouse:', error);
//       }
//     };

//     fetchTransfersFromLighthouse();
//   }, [apiKey, name]);

//   return (
//     <div>
//       <h1>Token Transfers</h1>
//       <h2>From Lighthouse</h2>
//       <label className='px-4'>{transfersFromLighthouse}</label>
//       <label className='px-4'>{transfersToLighthouse}</label>
//       <label>{transfersValueLighthouse}</label>
//     </div>
//   );
// };

// export default Receive;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import lighthouse from '@lighthouse-web3/sdk';
import Navbar from '@/components/Navbar';

declare global { 
  interface Window {
    ethereum?: any;
  }
}

const Receive = () => {
  const [files, setFiles] = useState([]);
  const [fileDetails, setFileDetails] = useState<any>({});
  const apiKey = '4285c19e.16a1a7c19c2c42ed84424c46e8ef583e';

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAddress = '0x49D9494f1CEaa172D32dB6485ebAE24038840b4D';
  const abi = [
    "function transfer(address to, uint amount) public returns (bool)"
  ];
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const withdrawAddress = "0x1e87f3F4FDBb276250fC064a3cf0069592280601";

  const getUploads = async () => {
    try {
      const response = await lighthouse.getUploads(apiKey);
      return response.data.fileList;
    } catch (error) {
      console.error('Failed to fetch files:', error);
      return [];
    }
  };

  const fetchFileDetails = async (cid: any) => {
    try {
      const response = await axios.get(`https://gateway.lighthouse.storage/ipfs/${cid}`);
      const data = await response.data;
      setFileDetails((prevDetails: any) => ({
        ...prevDetails,
        [cid]: data.split(',')
      }));
    } catch (error) {
      console.error(`Failed to fetch details for CID ${cid}:`, error);
      setFileDetails((prevDetails: any) => ({
        ...prevDetails,
        [cid]: { error: 'Failed to fetch data' }
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
      console.log(`Withdrawing ${amount} to ${recipient}`);
      const tx = await contract.transfer(withdrawAddress, ethers.utils.parseUnits(amount, '18'));
      await tx.wait();
      alert('Withdraw successful!');
    } catch (error) {
      console.error('Withdraw failed:', error);
      alert('Withdraw failed!');
    }
  };

  return (
    <div className="flex flex-col text-white">
      <Navbar />
      <button onClick={fetchFiles} className="text-white font-bold px-4 rounded my-[60px] text-5xl">
        Withdraw Funds
      </button>
      <div className="w-full px-[10%]">
        <label className="text-xl mb-2">Funds Received</label>
        <div className="overflow-x-auto bg-slate-950 border border-white p-3 rounded-lg shadow-lg mt-4">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b-2 border-gray-500">Sender</th>
                <th className="px-4 py-2 border-b-2 border-gray-500">Amount</th>
                <th className="px-4 py-2 border-b-2 border-gray-500">Receiver</th>
                <th className="px-4 py-2 border-b-2 border-gray-500">Withdraw Funds</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={index} className="hover:bg-gray-600">
                  <td className="px-4 py-2 border-b border-gray-500">{fileDetails[file?.cid] ? formatAddress(fileDetails[file?.cid][0]) : 'Loading...'}</td>
                  <td className="px-4 py-2 border-b border-gray-500">{fileDetails[file?.cid] ? fileDetails[file?.cid][1] : 'Loading...'}</td>
                  <td className="px-4 py-2 border-b border-gray-500">{fileDetails[file?.cid] ? formatAddress(fileDetails[file?.cid][2]) : 'Loading...'}</td>
                  <td className="px-4 py-2 border-b border-gray-500">
                    {fileDetails[file?.cid] && !fileDetails[file?.cid].error ? (
                      <button 
                        onClick={() => handleWithdraw(fileDetails[file?.cid][2], fileDetails[file?.cid][1])}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Withdraw
                      </button>
                    ) : 'N/A'}
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