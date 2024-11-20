"use client"
// components/AuthProvider.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { isAuthenticated } from "../utils/auth";

// Define a interface para o contexto de autenticação
interface AuthContextType {
  isAuth: boolean;
  setIsAuth: (auth: boolean) => void;
}

// Define o contexto com o tipo correto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    // Verifica se o usuário está autenticado ao carregar o componente
    setIsAuth(isAuthenticated());

  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}