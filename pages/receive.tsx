import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Props to specify the contract address and Ethereum network provider URL
interface TokenEventProps {
    contractAddress: string;
    providerUrl: string;
}

// Type for storing transfer event data
type TransferEvent = {
    from: string;
    to: string;
    amount: string;
};

const Receive: React.FC<TokenEventProps> = () => {
    const [transfers, setTransfers] = useState<TransferEvent[]>([]);
    const contractAddress = '0x49D9494f1CEaa172D32dB6485ebAE24038840b4D';
    const providerUrl = 'https://sepolia.infura.io/v3/358f5ae5bc804b81ad74ce87a3682743';
    useEffect(() => {
        const provider = new ethers.providers.JsonRpcProvider(providerUrl);
        const contract = new ethers.Contract(contractAddress, [
            // ABI for the Transfer event
            "event Transfer(address indexed from, address indexed to, uint256 value)"
        ], provider);

        // Listening to the Transfer events emitted by the contract
        const onTransfer = (from: string, to: string, amount: ethers.BigNumber) => {
            console.log(`Transfer from ${from} to ${to} amount ${amount.toString()}`);
            setTransfers(prevTransfers => [
                ...prevTransfers,
                { from, to, amount: ethers.utils.formatEther(amount) }
            ]);
        };

        contract.on('Transfer', onTransfer);

        return () => {
            // Clean up the event listener when the component unmounts
            contract.off('Transfer', onTransfer);
        };
    }, [contractAddress, providerUrl]);

    return (
        <div>
            <h1>Token Transfers</h1>
            <ul>
                {transfers.map((transfer, index) => (
                    <li key={index}>
                        {`${transfer.from} transferred ${transfer.amount} tokens to ${transfer.to}`}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Receive;
