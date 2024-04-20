// import React, { useState } from 'react';
// import { ethers } from 'ethers';
// import lighthouse from '@lighthouse-web3/sdk'

// interface SendTokenProps {
//     contractAddress: string;
//     abi: any;
// }

// declare global {
//     interface Window {
//         ethereum: any;
//     }
// }

// const text = "Sometimes, I Wish I Was A Cloud, Just Floating Along"
// const apiKey = "YOUR_API_KEY"
// const name = "shikamaru" //Optional

// const SendToken: React.FC<SendTokenProps> = () => {
//     const [recipient, setRecipient] = useState<string>('');
//     const [amount, setAmount] = useState<string>('');
//     const [connected, setConnected] = useState<boolean>(false);
//     const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);

//     const contractAddress = '0x49D9494f1CEaa172D32dB6485ebAE24038840b4D';
//     const abi = [
//         "function transfer(address to, uint256 value) returns (bool)"
//     ];

//     // Connect to MetaMask
//     const connectWallet = async () => {
//         try {
//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             await provider.send("eth_requestAccounts", []);
//             const signer = provider.getSigner();
//             setSigner(signer);
//             setConnected(true);
//         } catch (error) {
//             console.error('Error connecting to MetaMask', error);
//             alert('Failed to connect MetaMask. Make sure MetaMask is installed.');
//         }
//     };

//     // Handle token transfer
//     const sendTokens = async () => {
//         if (!signer) return;
//         const contract = new ethers.Contract(contractAddress, abi, signer);
//         const tx = await contract.transfer(recipient, ethers.utils.parseUnits(amount, '18'));
//         await tx.wait().then((receipt : any) => {
//           console.log(receipt.events?.filter((event:any) => event.event === "Transfer"));
//           // Assuming receipt contains event details
//           // storeEventOnLighthouse(receipt.events?.filter((event:any) => event.event === "Transfer"));
//       });
//         alert(`Transaction successful! Hash: ${tx.hash}`);
//     };

//     const storeEventOnLighthouse = async (eventData: any) => {
//       try {
//         await lighthouse.uploadText(text, apiKey, name)
//       } catch (error) {
//           console.error('Failed to store data on Lighthouse:', error);
//       }
//   };

//     return (
//         <div>
//             <h1>Send Tokens</h1>
//             {!connected ? (
//                 <button onClick={connectWallet}>Connect MetaMask</button>
//             ) : (
//                 <div>
//                     <input
//                         type="text"
//                         className='text-black'
//                         value={recipient}
//                         onChange={(e) => setRecipient(e.target.value)}
//                         placeholder="Recipient Address"
//                     />
//                     <input
//                         type="number"
//                         className='text-black'
//                         value={amount}
//                         onChange={(e) => setAmount(e.target.value)}
//                         placeholder="Amount to Send"
//                     />
//                     <button onClick={sendTokens}>Send Tokens</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SendToken;

// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import lighthouse from '@lighthouse-web3/sdk'

// interface SendTokenProps {
//   contractAddress: string;
//   abi: any;
// }

// declare global {
//   interface Window {
//     ethereum: any;
//   }
// }

// const text = "Sometimes, I Wish I Was A Cloud, Just Floating Along"
// const apiKey = "YOUR_API_KEY"
// const name = "shikamaru" //Optional

// const SendToken: React.FC<SendTokenProps> = () => {
//   const [recipient, setRecipient] = useState<string>('');
//   const [amount, setAmount] = useState<string>('');
//   const [connected, setConnected] = useState<boolean>(false);
//   const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
//   const contractAddress = '0x49D9494f1CEaa172D32dB6485ebAE24038840b4D';
//   const abi = [
//     "function transfer(address to, uint256 value) returns (bool)",
//     "event Transfer(address indexed from, address indexed to, uint256 value)"
//   ];

//   useEffect(() => {
//     if (signer) {
//       const contract = new ethers.Contract(contractAddress, abi, signer);
//       contract.on('Transfer', (from, to, value, event) => {
//         console.log('Transfer event:', event);
//       });
//     }
//   }, [signer]);

//   // Connect to MetaMask
//   const connectWallet = async () => {
//     try {
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       await provider.send("eth_requestAccounts", []);
//       const signer = provider.getSigner();
//       setSigner(signer);
//       setConnected(true);
//     } catch (error) {
//       console.error('Error connecting to MetaMask', error);
//       alert('Failed to connect MetaMask. Make sure MetaMask is installed.');
//     }
//   };

//   // Handle token transfer
//   const sendTokens = async () => {
//     if (!signer) return;
//     const contract = new ethers.Contract(contractAddress, abi, signer);
//     const tx = await contract.transfer(recipient, ethers.utils.parseUnits(amount, '18'));
//     await tx.wait();
//     alert(`Transaction successful! Hash: ${tx.hash}`);
//   };

//   const storeEventOnLighthouse = async (eventData: any) => {
//     try {
//       await lighthouse.uploadText(text, apiKey, name)
//     } catch (error) {
//       console.error('Failed to store data on Lighthouse:', error);
//     }
//   }

//   return (
//     <div>
//       <h1>Send Tokens</h1>
//       {!connected ? (
//         <button onClick={connectWallet}>Connect MetaMask</button>
//       ) : (
//         <div>
//           <input
//             type="text"
//             className='text-black'
//             value={recipient}
//             onChange={(e) => setRecipient(e.target.value)}
//             placeholder="Recipient Address"
//           />
//           <input
//             type="number"
//             className='text-black'
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             placeholder="Amount to Send"
//           />
//           <button onClick={sendTokens}>Send Tokens</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SendToken;

import React, { useState } from "react";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import crypto from "crypto";

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
  const [truncatedEncryptedAddress, setTruncatedEncryptedAddress] = useState("");

  const encryptPublicAddress = async(publicAddress:any) => {
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
    setEncryptedAddress(`${truncatedEncryptedAddress}:${encrypted}:${randomNumber}`);
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
    <div>
      <h1>Send Tokens</h1>
      {!connected ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <div>
          <input
            type="text"
            className="text-black"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient Address"
          />
          <input
            type="number"
            className="text-black"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount to Send"
          />
          <button onClick={sendTokens}>Send Tokens</button>
        </div>
      )}
    </div>
  );
};

export default SendToken;
