import React, { useState } from 'react';
import crypto from 'crypto';

const DecryptAddress: React.FC = () => {
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [decryptedAddress, setDecryptedAddress] = useState('');

  const decryptMessage = () => {
    // Split the encrypted message and random number
    const [truncatedEncryptedAddress, encrypted, randomNumber] = encryptedMessage.split(':');

    // Convert the private key to a buffer
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');

    // Create a decipher using AES-256-CBC algorithm
    const decipher = crypto.createDecipheriv('aes-256-cbc', randomNumber.slice(0, 32), Buffer.from(randomNumber.slice(32), 'hex'));

    // Decrypt the message
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    setDecryptedAddress(decrypted);
  };

  return (
    <div>
      <input
        type="text"
        className='text-black'
        placeholder="Enter encrypted message"
        value={encryptedMessage}
        onChange={(e) => setEncryptedMessage(e.target.value)}
      />
      <input
        type="text"
        className='text-black'
        placeholder="Enter private key"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
      />
      <button onClick={decryptMessage}>Decrypt Address</button>
      {decryptedAddress && <p>Decrypted Public Address: {decryptedAddress}</p>}
    </div>
  );
};

export default DecryptAddress;

//e805da4a6e8970bd7b523b7b245f88a12918c06bbf1ca4d4d6a93cdfdfe50c57
