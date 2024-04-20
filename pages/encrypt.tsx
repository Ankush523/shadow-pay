import React, { useState } from "react";
import crypto from "crypto";

const EncryptAddress: React.FC = () => {
  const [publicAddress, setPublicAddress] = useState("");
  const [encryptedAddress, setEncryptedAddress] = useState("");

  const encryptPublicAddress = () => {
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
    const truncatedEncryptedAddress = `0x${encrypted.slice(0, 40)}`;

    // Set the encrypted address and the random number
    setEncryptedAddress(`${truncatedEncryptedAddress}:${encrypted}:${randomNumber}`);

    // // Set the encrypted address and the random number
    // setEncryptedAddress(`${encrypted}:${randomNumber}`);
  };

  return (
    <div>
      <input
        type="text"
        className="text-black"
        placeholder="Enter public wallet address"
        value={publicAddress}
        onChange={(e) => setPublicAddress(e.target.value)}
      />
      <button onClick={encryptPublicAddress}>Encrypt Address</button>
      {encryptedAddress && <p>Encrypted Public Address: {encryptedAddress}</p>}
    </div>
  );
};

export default EncryptAddress;

// import React, { useState } from 'react';
// import crypto from 'crypto';

// const EncryptAddress: React.FC = () => {
//   const [publicAddress, setPublicAddress] = useState('');
//   const [encryptedAddress, setEncryptedAddress] = useState('');

//   const encryptPublicAddress = () => {
//     // Generate a random number
//     const randomNumber = crypto.randomBytes(32).toString('hex');

//     // Create a cipher using AES-256-CBC algorithm
//     const cipher = crypto.createCipheriv('aes-256-cbc', randomNumber.slice(0, 32), Buffer.from(randomNumber.slice(32), 'hex'));

//     // Encrypt the public address
//     let encrypted = cipher.update(publicAddress, 'utf8', 'hex');
//     encrypted += cipher.final('hex');

// // Ensure the encrypted address has a maximum length of 40 characters (20 bytes)
// const truncatedEncryptedAddress = `0x${encrypted.slice(0, 40)}`;

// // Set the encrypted address and the random number
// setEncryptedAddress(`${truncatedEncryptedAddress}:${randomNumber}`);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         className='text-black'
//         placeholder="Enter public wallet address"
//         value={publicAddress}
//         onChange={(e) => setPublicAddress(e.target.value)}
//       />
//       <button onClick={encryptPublicAddress}>Encrypt Address</button>
//       {encryptedAddress && <p>Encrypted Public Address: {encryptedAddress}</p>}
//     </div>
//   );
// };

// export default EncryptAddress;

// import React, { useState } from 'react';
// import crypto from 'crypto';

// const EncryptAddress: React.FC = () => {
//   const [publicAddress, setPublicAddress] = useState('');
//   const [encryptedAddress, setEncryptedAddress] = useState('');

//   const encryptPublicAddress = () => {
//     // Generate a random number of 48 bytes (384 bits)
//     const randomNumber = crypto.randomBytes(48).toString('hex'); // Increased to 48 bytes

//     // Create a cipher using AES-256-CBC algorithm
//     // Key is the first 32 bytes, IV is the next 16 bytes
//     const key = randomNumber.slice(0, 64); // 32 bytes for the key
//     const iv = Buffer.from(randomNumber.slice(64, 96), 'hex'); // 16 bytes for the IV

//     // Create cipher with the generated key and IV
//     const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);

//     // Encrypt the public address
//     let encrypted = cipher.update(publicAddress, 'utf8', 'hex');
//     encrypted += cipher.final('hex');

//     // Ensure the encrypted address has a maximum length of 40 characters (20 bytes)
//     const truncatedEncryptedAddress = `0x${encrypted.slice(0, 40)}`;

//     // Set the encrypted address and the random number
//     setEncryptedAddress(`${truncatedEncryptedAddress}:${randomNumber}`);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         className='text-black'
//         placeholder="Enter public wallet address"
//         value={publicAddress}
//         onChange={(e) => setPublicAddress(e.target.value)}
//       />
//       <button onClick={encryptPublicAddress}>Encrypt Address</button>
//       {encryptedAddress && <p>Encrypted Public Address: {encryptedAddress}</p>}
//     </div>
//   );
// };

// export default EncryptAddress;
