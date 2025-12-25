import React, { createContext, useState, useContext, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { loginUser, registerUser } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await loginUser({ email, password });

      setUser(response.data);
      setToken(response.token);

      // Armazenar token de forma segura
      await SecureStore.setItemAsync("authToken", response.token);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    setLoading(true);
    try {
      const response = await registerUser({ name, email, password, confirmPassword });

      setUser(response.data);
      setToken(response.token);

      // Armazenar token de forma segura
      await SecureStore.setItemAsync("authToken", response.token);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync("authToken");
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
