import React, { useState } from 'react';
import { ethers } from 'ethers';

interface SendTokenProps {
    contractAddress: string;
    abi: any;
}

declare global {
    interface Window {
        ethereum: any;
    }
}

const SendToken: React.FC<SendTokenProps> = () => {
    const [recipient, setRecipient] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [connected, setConnected] = useState<boolean>(false);
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);

    const contractAddress = '0x49D9494f1CEaa172D32dB6485ebAE24038840b4D';
    const abi = [
        "function transfer(address to, uint256 value) returns (bool)"
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
            console.error('Error connecting to MetaMask', error);
            alert('Failed to connect MetaMask. Make sure MetaMask is installed.');
        }
    };

    // Handle token transfer
    const sendTokens = async () => {
        if (!signer) return;
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const tx = await contract.transfer(recipient, ethers.utils.parseUnits(amount, '18'));
        await tx.wait();
        alert(`Transaction successful! Hash: ${tx.hash}`);
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
                        className='text-black'
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Recipient Address"
                    />
                    <input
                        type="number"
                        className='text-black'
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
