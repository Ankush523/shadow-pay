// src/contexts/SmartAccountContext.js
import React, { createContext, useContext, useState } from 'react';

const SmartAccountContext = createContext();

export const useSmartAccount = () => useContext(SmartAccountContext);

export const SmartAccountProvider = ({ children }) => {
  const [smartAccountAddress, setSmartAccountAddress] = useState('');

  return (
    <SmartAccountContext.Provider value={{ smartAccountAddress, setSmartAccountAddress }}>
      {children}
    </SmartAccountContext.Provider>
  );
};
