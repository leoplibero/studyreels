import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as apiLogin, register as apiRegister } from "../services/authService";
import { setAuthToken } from "../services/api";

const AuthContext = createContext();

function calculateLevel(xp) {
  return Math.max(1, Math.floor(Number(xp) / 100) + 1);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStored() {
      try {
        const storedToken = await AsyncStorage.getItem("auth_token");
        const storedUser = await AsyncStorage.getItem("auth_user");
        if (storedToken) {
          setToken(storedToken);
          setAuthToken(storedToken);
        }
        if (storedUser) setUser(JSON.parse(storedUser));
      } finally {
        setLoading(false);
      }
    }
    loadStored();
  }, []);

  const persist = async (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    setAuthToken(nextToken);
    await AsyncStorage.setItem("auth_token", nextToken || "");
    await AsyncStorage.setItem("auth_user", JSON.stringify(nextUser || null));
  };

  const handleLogin = async (credentials) => {
    const res = await apiLogin(credentials);
    if (!res.success) throw new Error(res.message || "Falha no login");
    await persist(res.token, res.data);
  };

  const handleRegister = async (payload) => {
    const res = await apiRegister(payload);
    if (!res.success) throw new Error(res.message || "Falha no cadastro");
    await persist(res.token, res.data);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    await AsyncStorage.multiRemove(["auth_token", "auth_user"]);
  };

  const applyXp = async (xpEarned) => {
    if (!user) return;
    const nextXp = Number(user.xp || 0) + Number(xpEarned || 0);
    const nextUser = { ...user, xp: nextXp, level: calculateLevel(nextXp) };
    setUser(nextUser);
    await AsyncStorage.setItem("auth_user", JSON.stringify(nextUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login: handleLogin, register: handleRegister, logout, applyXp }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
