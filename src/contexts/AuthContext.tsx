import React, { createContext, useContext, useState, PropsWithChildren } from "react";

interface IUser {
  address: string;
  seedPhrase: string;
  password: string | null;
}

type AuthContextType = {
  isAuthenticated: boolean | null;
  setIsAuthenticated: (value: boolean | null) => void;
  currentUser: IUser | null;
  setCurrentUser: (user: IUser | null) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  seedPhrase: string;
  setSeedPhrase: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isPasswordSet: boolean;
  setIsPasswordSet: (value: boolean) => void;
  isSeedPhraseSet: boolean;
  setIsSeedPhraseSet: (value: boolean) => void;
  isAddressSet: boolean;
  setIsAddressSet: (value: boolean) => void;
  showPasswordModal: boolean;
  setShowPasswordModal: (value: boolean) => void;
  error: string;
  setError: (value: string) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [seedPhrase, setSeedPhrase] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordSet, setIsPasswordSet] = useState<boolean>(false);
  const [isSeedPhraseSet, setIsSeedPhraseSet] = useState<boolean>(false);
  const [isAddressSet, setIsAddressSet] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
        setCurrentUser,
        isLoading,
        setIsLoading,
        seedPhrase,
        setSeedPhrase,
        password,
        setPassword,
        isPasswordSet,
        setIsPasswordSet,
        isSeedPhraseSet,
        setIsSeedPhraseSet,
        isAddressSet,
        setIsAddressSet,
        showPasswordModal,
        setShowPasswordModal,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
