// src/contexts/Receive.tsx
import React, { createContext, useContext, useState } from 'react';

type ReceiveContextType = {
  receiveModal: boolean;
  setReceiveModal: (value: boolean) => void;
  sendModal: boolean;
  setSendModal: (value: boolean) => void;
};

export const ReceiveContext = createContext<ReceiveContextType | null>(null);

export function useReceive() {
  const context = useContext(ReceiveContext);
  if (!context) throw new Error('useReceive must be used within ReceiveProvider');
  return context;
}

export function ReceiveProvider({ children }: React.PropsWithChildren) {
  const [receiveModal, setReceiveModal] = useState(false);
  const [sendModal, setSendModal] = useState(false);

  return (
    <ReceiveContext.Provider
      value={{
        receiveModal,
        setReceiveModal,
        sendModal,
        setSendModal,
      }}
    >
      {children}
    </ReceiveContext.Provider>
  );
}