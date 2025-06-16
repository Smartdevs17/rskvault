import React, { createContext, useContext, useState } from "react";

export const TokenContext = createContext<any>(null);

export function useToken() {
  return useContext(TokenContext);
}

interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance?: number;
  chainId: number;
  userAddress: string;
}

export function TokenProvider({ children }: React.PropsWithChildren) {
  const [newTokenModal, setNewTokenModal] = useState<boolean>(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [chainId, setChainId] = useState<number>(11155111);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  return (
    <TokenContext.Provider
      value={{
        newTokenModal,
        setNewTokenModal,
        tokens,
        setTokens,
        selectedToken,
        setSelectedToken,
        chainId,
        setChainId,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}
